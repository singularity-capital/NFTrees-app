// base imports
import React ,{useEffect, useState} from 'react';
import './App.css';
import firebase from './firebase';

// import packages
import Web3 from 'web3';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import bigInt from "big-integer";

// import contract abis
import NFTreeABI from './artifacts/contracts/NFTree.sol/NFTree.json';
import PurchaseABI from './artifacts/contracts/Purchase.sol/Purchase.json';
import DAIABI from './artifacts/contracts/DAI.sol/DAI.json';
import USDCABI from './artifacts/contracts/USDC.sol/USDC.json';
import USDTABI from './artifacts/contracts/USDT.sol/USDT.json';

// import components
import Navbar from './components/Navbar';
import Plant from './components/Plant';
import Impact from './components/Impact';

function App() {
  const[Currentaccount, setCurrentaccount] = useState();
  const[Currentnetwork, setCurrentnetwork] = useState();
  const[isConnected, setIsConnected] = useState(false);

  const[NFTreeContract, setNFTreeContract] = useState();
  const[PurchaseContract, setPurchaseContract] = useState();
  const[DAIContract, setDAIContract] = useState();
  const[USDCContract, setUSDCContract] = useState();
  const[USDTContract, setUSDTContract] = useState();

  const[isLoading, setLoading] = useState(true);
  const contractAddresses = {
    'NFTree' : '0x8a5cda6bd214A69DA67a774b071f55750A8cda7e',
    'Purchase' : '0xf47EaA986ba08A7d0cE634B00E4d47BB9eC70968',
    'DAI' : '0x8f55de35229e5eC7759f396dC58E12d636Ac1e8c',
    'USDC' : '0x802B0f664b9c505eA0dbF633F8975C4B680A6354',
    'USDT' : '0xf8Cb6F45D110b9d54cf0007C5bD0A4FE21bbCb75'
  }

  useEffect(() => {
    console.log('app')
    const load = async () => {
      await loadWeb3();
    };

    // initialize web3 and load blockchain data
    load();

    if(window.ethereum){
      // reload on metamask accountsChanged event
      window.ethereum.on('accountsChanged', function (accounts) {
        load();
      });

      // reload on metamask networkChanged event
      window.ethereum.on('networkChanged', function (accounts) {
        load();
      });
    }

    setLoading(false);
  },[]);

  /* ethereum initialization functions */

  // detect ethereum browser 
  const loadWeb3 = async () => {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      loadBlockchainData();
    } else {
      window.alert(
        'no ethereum wallet detected.'
      );
    }
  }

  const checkConnection = async () => {
    // fetch user eth account
    const accounts = await window.web3.eth.getAccounts();
    const account = accounts[0];
    // set current account to account[0] if unlocked
    if (account){
      setIsConnected(true);
      setCurrentaccount(account);
    }

    // get networkId, display error if networkId != 1 (ethereum mainnet)
    // 1337 local host
    const networkId = await window.web3.eth.net.getId()
    if(networkId !== 4){
      setIsConnected(false);
      setCurrentaccount('wrong network');
      setCurrentnetwork(networkId);
    } else {
      setCurrentnetwork(networkId);
    }
  }

  const connectWallet = async () => {
    if(window.web3) {
      await window.ethereum.enable();
    } else {
      window.alert(
        'no ethereum wallet detected.'
      );
    }
    await loadBlockchainData();
  }

  // load ethereum accounts, network, and smart contracts 
  const loadBlockchainData = async () => {    
    // check
    await checkConnection();

    if(window.ethereum){ // update with contract addresses once deployed
      setNFTreeContract(await new window.web3.eth.Contract(NFTreeABI.abi, contractAddresses['NFTree']));
      setPurchaseContract(await new window.web3.eth.Contract(PurchaseABI.abi, contractAddresses['Purchase']));
      setDAIContract(await new window.web3.eth.Contract(DAIABI.abi, contractAddresses['DAI']));
      setUSDCContract(await new window.web3.eth.Contract(USDCABI.abi, contractAddresses['USDC']));
      setUSDTContract(await new window.web3.eth.Contract(USDTABI.abi, contractAddresses['USDT']));
    }
  }

  const getAllowance = async (coin) => { 
    if(isConnected){  
      let allowance;
      if(coin === 'DAI') {
        allowance = await DAIContract.methods.allowance(Currentaccount, contractAddresses['Purchase']).call();
      }
      else if (coin === 'USDC') {
        allowance = await USDCContract.methods.allowance(Currentaccount, contractAddresses['Purchase']).call();
      }
      else if (coin === 'USDT') {
        allowance = await USDTContract.methods.allowance(Currentaccount, contractAddresses['Purchase']).call();
      } 
      return allowance;
    }
    else{
      return 0;
    }
  }

  const approve = async (totalCost, coin) => {
    console.log(coin);
    let amount = String(bigInt(totalCost * (10**18)));
    if(isConnected){
      if(coin === 'DAI') {
        await DAIContract.methods.approve(contractAddresses['Purchase'], amount).send({from: Currentaccount});
      }
      else if (coin === 'USDC') {
        await USDCContract.methods.approve(contractAddresses['Purchase'], amount).send({from: Currentaccount});
      }
      else if (coin === 'USDT') {
        await USDTContract.methods.approve(contractAddresses['Purchase'], amount).send({from: Currentaccount});
      }
    }
    else {
      alert('connect metamask wallet');
    }
  }

  const buyNFTree = async (numCredits, totalCost, coin) => {   
    let amount = String(bigInt(totalCost * (10**18))); 
    if(isConnected){
      /*var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
      var yyyy = today.getFullYear();
      today = mm + '/' + dd + '/' + yyyy;

      var database = firebase.database().ref('transactions');
      database.push().set({
          date: today,
          wallet: Currentaccount,
          amount: totalCost,
          coin: coin,
          carbon_credits: numCredits,
          trees_planted: numCredits
      });
      console.log("DB INSERT");*/
      await PurchaseContract.methods.buyNFTree(numCredits, amount, coin).send({from: Currentaccount});
    }
    else {
      alert('connect metamask wallet');
    }
  }

  const calculateImpact = async () => {    
    if(isConnected){
      let totalOffset = 0;
      let totalTrees = 0
      let tokens = await NFTreeContract.methods.tokensOfOwner(Currentaccount).call();
      if (tokens.length != 0){
        for (var i = 0; i < tokens.length; i ++) {
          let uri = await NFTreeContract.methods.tokenURI(tokens[i]).call();
          let obj = await (await fetch(uri)).json();
          let offset = parseInt(obj['attributes'][0].value, 10);
          let trees = parseInt(obj['attributes'][1].value, 10);
          totalOffset += offset;
          totalTrees += trees;
        }
      }

      console.log("total NFTrees =", tokens.length)
      console.log("total offset =", totalOffset);
      console.log("total number of trees planted = ", totalTrees)
    }
    else {
      alert('connect metamask wallet');
    }
  }

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path = '/'>
            <Navbar account = {Currentaccount} connectWallet = {connectWallet}/>
            <Plant getAllowance = {getAllowance} approve = {approve} buyNFTree = {buyNFTree}/>
          </Route>

          <Route exact path = '/impact'>
            <Navbar account = {Currentaccount} connectWallet = {connectWallet}/>
            <Impact account = {Currentaccount}/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
