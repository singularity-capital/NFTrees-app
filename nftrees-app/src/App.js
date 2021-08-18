// base imports
import React ,{useEffect, useState} from 'react';
import './App.css';

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
import MycoinABI from './artifacts/contracts/Mycoin.sol/Mycoin.json';

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
  const[MycoinContract, setMycoinContract] = useState();

  const[isLoading, setLoading] = useState(true);
  const contractAddresses = {
    'NFTree' : '0xC8483f868e41E996761a701aCeA884e963cF88Fe',
    'Purchase' : '0xa44929195B0c3AF215c6efbe5c295cc6b99F7C44',
    'Mycoin' : '0xdb744e329458968Bed5dA948d3B2e73CA7AB4C3a',
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

    // get smart contracts
    const nftreeAddress = contractAddresses['NFTree'];
    const purchaseAddress = contractAddresses['Purchase'];
    const MycoinAddress = contractAddresses['Mycoin'];

    if(window.ethereum){ // update with contract addresses once deployed
      setNFTreeContract(await new window.web3.eth.Contract(NFTreeABI.abi, nftreeAddress));
      setPurchaseContract(await new window.web3.eth.Contract(PurchaseABI.abi, purchaseAddress));
      setMycoinContract(await new window.web3.eth.Contract(MycoinABI.abi, MycoinAddress));
    }
  }

  const getAllowance = async () => { 
    if(isConnected){   
      let allowance = await MycoinContract.methods.allowance(Currentaccount, contractAddresses['Purchase']).call();
      return allowance;
    }
    else{
      return 0;
    }
  }

  const approve = async (totalCost) => {
    let amount = String(bigInt(totalCost * (10**18)));
    if(isConnected){
      await MycoinContract.methods.approve(contractAddresses['Purchase'], amount).send({from: Currentaccount});
    }
    else {
      alert('connect metamask wallet');
    }
  }

  const buyNFTree = async (numCredits, totalCost, coin) => {   
    let amount = String(bigInt(totalCost * (10**18))); 
    if(isConnected){
      await PurchaseContract.methods.buyNFTree(numCredits, amount, coin).send({from: Currentaccount});
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
            <Impact/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
