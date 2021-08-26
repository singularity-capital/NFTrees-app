// base imports
import React from 'react';
import './Impact.css';
import { calculateAddressEmissions } from "ethereum-emissions-calculator";
import CountUp from 'react-countup';
import firebase from '../firebase';

class Impact extends React.Component {

  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      totalGas: 0,
      totalKg: 0,
      totalTransactions: 0
    }; 

    if (props.isConnected){
      this.handleCalculateEmissions(props.account);
    } else {
      alert('connect metamask!');
    }
  }

  async handleCalculateEmissions(account) {
    var gas = 0;
    var co2 = 0;
    var transactions = 0;
    var typeTransaction = ['eth', 'erc20', 'erc721'];
    var apiKey;
    const address = account;
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
    
    this.setState({
      totalGas: gas,
      totalKg: co2,
      totalTransactions: transactions
    });
  }
  
  render() {
    return (
      <div className="Impact">
        <div className = 'impactContainer'>
          <div className = 'dashboard'>
            <div className = 'dashboardHeader'>
              <p className = 'dashboardTitle'>IMPACT DASHBOARD</p>
              <p className = 'carbonFootprint'>CARBON FOOTPRINT ⓘ</p>
              <p className = 'carbonFootprintValue'><CountUp className = 'carbonFootprintValue' end = {this.state.totalKg} duration = {1} separator ={','}/> kg CO2</p>
              
            </div>
            <p className = 'emissionsTitle'>EMISSIONS</p>
            <div className = 'dashboardContent'>
              <div className = 'dashboardLeft'>
                <p className = 'contentHeader'>Transactions</p>
                <CountUp className = 'emissionsValue' end = {this.state.totalTransactions} duration = {1} separator ={','}/>
              </div>
              <div className = 'dashboardMiddle'>
                <p className = 'contentHeader'>Gas spent (wei)</p>
                <CountUp className = 'emissionsValue' end = {this.state.totalGas} duration = {1} separator ={','}/>
              </div>
              <div className = 'dashboardRight'>
                <p className = 'contentHeader'>CO2 produced (kg)</p>
                <CountUp className = 'emissionsValue' end = {this.state.totalKg} duration = {1} separator ={','}/>
              </div>
            </div>
            <p className = 'impactTitle'>IMPACT</p>
            <div className = 'dashboardContent'>
              <div className = 'dashboardLeft'>
                <p className = 'contentHeader'>NFTrees</p>
                <CountUp className = 'impactValue' end = {this.state.totalTransactions} duration = {1} separator ={','}/>
              </div>
              <div className = 'dashboardRight'>
                <p className = 'contentHeader'>Trees planted</p>
                <CountUp className = 'impactValue' end = {this.state.totalTransactions} duration = {1} separator ={','}/>
              </div>
              <div className = 'dashboardMiddle'>
                <p className = 'contentHeader'>CO2 offset</p>
                <CountUp className = 'impactValue' end = {this.state.totalTransactions} duration = {1} separator ={','}/>
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
}

export default Impact;