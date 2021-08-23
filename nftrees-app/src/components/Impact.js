// base imports
import React, { PureComponent , useState, useEffect, useImperativeHandle} from 'react';
import './Impact.css';
import { calculateAddressEmissions } from "ethereum-emissions-calculator";
import CountUp from 'react-countup';
import firebase from '../firebase';

function Impact(props) {
  const[totalGas, setTotalGas] = useState(0);
    const[totalKg, setTotalKg] = useState(0);
    const[totalTransactions, setTotalTransactions] = useState(0);

    useEffect(() => {
      if (props.isConnected){
        handleCalculateEmissions();
      } else {
        alert('connect metamask!');
      }

      return () => {
        console.log('cleaned up impact');
      };
    }, []);


    const handleCalculateEmissions = async () => {
        setTotalGas(undefined);
        setTotalKg(undefined);
        setTotalTransactions(undefined);

        var gas = 0;
        var co2 = 0;
        var transactions = 0;
        var typeTransaction = ['eth', 'erc20', 'erc721'];
        var apiKey;
        const address = props.account;
        const callableReturnMessage = firebase.functions().httpsCallable('getEtherscanKey');
    
        await callableReturnMessage().then((result) => {
            apiKey = result.data.etherscanKey;
        }).catch((error) => {
          console.log(`error: ${JSON.stringify(error)}`);
        });

        for (var i = 0; i < 3; i++) {
            const emissions = await calculateAddressEmissions({
                transactionType: typeTransaction[i],
                address: address,
                etherscanAPIKey: apiKey,
            });
            
            gas += emissions['gasUsed'];
            co2 += emissions['kgCO2'];
            transactions += emissions['transactionsCount'];
        }
        
        setTotalGas(gas);
        setTotalKg(co2);
        setTotalTransactions(transactions);
    }
  
  return (
    <div className="Impact">
      <div className = 'impactContainer'>
        <div className = 'dashboard'>
          <div className = 'dashboardHeader'>
            <p className = 'dashboardTitle'>IMPACT DASHBOARD</p>
            <p className = 'carbonFootprint'>CARBON FOOTPRINT ⓘ</p>
            <p className = 'carbonFootprintValue'><CountUp className = 'carbonFootprintValue' end = {totalKg} duration = {1} separator ={','}/> kg CO2</p>
            
          </div>
          <p className = 'emissionsTitle'>EMISSIONS</p>
          <div className = 'dashboardContent'>
            <div className = 'dashboardLeft'>
              <p className = 'contentHeader'>Transactions</p>
              <CountUp className = 'emissionsValue' end = {totalTransactions} duration = {1} separator ={','}/>
            </div>
            <div className = 'dashboardMiddle'>
              <p className = 'contentHeader'>Gas spent (wei)</p>
              <CountUp className = 'emissionsValue' end = {totalGas} duration = {1} separator ={','}/>
            </div>
            <div className = 'dashboardRight'>
              <p className = 'contentHeader'>CO2 produced (kg)</p>
              <CountUp className = 'emissionsValue' end = {totalKg} duration = {1} separator ={','}/>
            </div>
          </div>
          <p className = 'impactTitle'>IMPACT</p>
          <div className = 'dashboardContent'>
            <div className = 'dashboardLeft'>
              <p className = 'contentHeader'>NFTrees</p>
              <CountUp className = 'impactValue' end = {totalTransactions} duration = {1} separator ={','}/>
            </div>
            <div className = 'dashboardRight'>
              <p className = 'contentHeader'>Trees planted</p>
              <CountUp className = 'impactValue' end = {totalTransactions} duration = {1} separator ={','}/>
            </div>
            <div className = 'dashboardMiddle'>
              <p className = 'contentHeader'>CO2 offset</p>
              <CountUp className = 'impactValue' end = {totalTransactions} duration = {1} separator ={','}/>
            </div>
          </div>
          <div className = 'dashboardSummary'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. 
            Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus 
            nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Impact;