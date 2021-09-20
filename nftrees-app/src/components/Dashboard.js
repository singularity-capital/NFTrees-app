// base imports
import React from 'react';
import './Dashboard.css';
import { calculateAddressEmissions } from "ethereum-emissions-calculator";
import CountUp from 'react-countup';
import firebase from '../firebase.js';
// eslint-disable-next-line
import functions from "firebase/functions";

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      totalGas: 0,
      totalKg: 0,
      totalTransactions: 0,
      totalNFTrees: 0, 
      totalOffset: 0,
      totalTrees: 0,
      isLoading: true
    }; 
  }

  componentDidMount = async() => {
    if (this.props.isConnected){
      await this.handleCalculateEmissions(this.props.account);
      let impact = await this.props.calculateImpact();
      this.setState({
        totalNFTrees: impact['nftrees'], 
        totalOffset: impact['offset'],
        totalTrees: impact['treesPlanted'],
        isLoading: false
      })
    } else {
      this.setState({
        isLoading: false
      })
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

  displayCarbonFootprint = () => {
    if(this.state.totalKg - this.state.totalOffset * 1000 <= 0){
      return(
        <div className = 'carbonFootprintUnit'><CountUp className = 'carbonFootprintValue' end = {this.state.totalKg - this.state.totalOffset * 1000} duration = {1} separator ={','} style = {{color: '#74CA86'}}/> kg CO<sub>2</sub></div>
      )
    }
    else{
      return(
        <div className = 'carbonFootprintUnit'><CountUp className = 'carbonFootprintValue' end = {this.state.totalKg - this.state.totalOffset * 1000} duration = {1} separator ={','}/> kg CO<sub>2</sub></div>
      )
    }
  }

  summaryOutput = () => {
    const delta = this.state.totalKg - this.state.totalOffset * 1000;
    if (delta < 0) {
      return "negative!";
    } else if (delta > 0) {
      return "positive. Plant more NFTrees to go carbon negative!";
    } else {
      return "neutral. Plant more NFTrees to go carbon negative!";
    }
  }
  
  render() {
    if(this.state.isLoading === true){
      return (
        <div className="Impact">
          <div className = 'impactContainer'>
            <div className = 'dashboard'>
              calculating impact...
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="Impact">
          <div className = 'impactContainer'>
            <div className = 'dashboard'>
              <div className = 'dashboardHeader'>
                <p className = 'dashboardTitle'>Impact Dashboard</p>
                <p className = 'carbonFootprint'>Carbon Footprint</p>
                <div className = 'carbonFootprintValue'>{this.displayCarbonFootprint()}</div>
              </div>
              <p className = 'emissionsTitle'>Emissions</p>
              <div className = 'dashboardContent'>
                <div className = 'dashboardLeft'>
                  <p className = 'contentHeader'>Transactions</p>
                  <CountUp className = 'emissionsValue' end = {this.state.totalTransactions} duration = {1} separator ={','}/>
                </div>
                <div className = 'dashboardMiddle'>
                  <p className = 'contentHeader'>Gas Spent (wei)</p>
                  <CountUp className = 'emissionsValue' end = {this.state.totalGas} duration = {1} separator ={','}/>
                </div>
                <div className = 'dashboardRight'>
                  <p className = 'contentHeader'>CO<sub>2</sub> Produced (kg)</p>
                  <CountUp className = 'emissionsValue' end = {this.state.totalKg} duration = {1} separator ={','}/>
                </div>
              </div>
              <p className = 'impactTitle'>Offsets</p>
              <div className = 'dashboardContent'>
                <div className = 'dashboardLeft'>
                  <p className = 'contentHeader'>NFTrees</p>
                  <CountUp className = 'impactValue' end = {this.state.totalNFTrees} duration = {1} separator ={','}/>
                </div>
                <div className = 'dashboardRight'>
                  <p className = 'contentHeader'>Trees Planted</p>
                  <CountUp className = 'impactValue' end = {this.state.totalTrees} duration = {1} separator ={','}/>
                </div>
                <div className = 'dashboardMiddle'>
                  <p className = 'contentHeader'>CO<sub>2</sub> Offset (kg)</p>
                  <CountUp className = 'impactValue' end = {this.state.totalOffset * 1000} duration = {1} separator ={','}/>
                </div>
              </div>
              <div className = 'dashboardSummary'>
                Your on-chain activity has created approximately {this.state.totalKg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} kg of carbon emissions. With {this.state.totalNFTrees} NFTrees 
                purchased, you have succesfully offset and sequestered {(this.state.totalOffset * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} kg of carbon from the environment. 
                This makes your Ethereum wallet carbon {this.summaryOutput()} View your NFTrees on <a className = 'dashboardLink' href="https://opensea.io/collection/nftrees-carbon-credits" target='_blank' rel='noreferrer'>OpenSea</a> and 
                verify the carbon offsets from our <a className = 'dashboardLink' href="https://offsetra.com/" target='_blank' rel='noreferrer'>Portfolio</a>.
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Dashboard;