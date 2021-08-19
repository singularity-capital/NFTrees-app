// base imports
import React, { PureComponent , useState, useEffect, useImperativeHandle} from 'react';
import './Impact.css';
import { calculateAddressEmissions } from "ethereum-emissions-calculator";
import CountUp from 'react-countup';

function Impact(props) {
  const[totalGas, setTotalGas] = useState(0);
    const[totalKg, setTotalKg] = useState(0);
    const[totalTransactions, setTotalTransactions] = useState(0);
    const[validInput, setValidInput] = useState();
    const[calculating, setCalculating] = useState(false);
    var loading;

    useEffect(() => {
        /*const calculate = async () => {
          await handleCalculateEmissions();
          console.log(totalTransactions);
        }
        calculate();
        loading = document.querySelector('#loading');*/
        handleCalculateEmissions();
    }, [calculating, validInput]);


    const handleCalculateEmissions = async () => {
        setCalculating(true);
        setTotalGas(undefined);
        setTotalKg(undefined);
        setTotalTransactions(undefined);

        //loading.style.display = 'flex';
        var gas = 0;
        var co2 = 0;
        var transactions = 0;
        var typeTransaction = ['eth', 'erc20', 'erc721'];

        //const address = props.account;
        const address = '0xBB379331De54A7c0a4b2bfF5A54A14cdba7E9E6d';
        console.log(address);
        //const apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
        const apiKey = 'NDKJ13HJPXBGN9AD9DQKJH25W1FDC86IDR';
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
        
        //loading.style.display = 'none';
        setCalculating(false);
    }
  
  return (
    <div className="Impact">
      <div className = 'impactContainer'>
        <div className = 'dashboard'>
          <div className = 'dashboardHeader'>
            <p className = 'dashboardTitle'>IMPACT DASHBOARD</p>
            <p className = 'carbonFootprint'>CARBON FOOTPRINT ⓘ</p>
            <p className = 'carbonFootprintValue'>1XXXXX kg CO2</p>
          </div>
          <p className = 'emissionsTitle'>EMISSIONS</p>
          <div className = 'dashboardContent'>
            <div className = 'dashboardLeft'>
              <p className = 'contentHeader'>Transactions</p>
              <CountUp className = 'emissionsValue' end = {totalTransactions} duration = {1} separator ={','}/>
            </div>
            <div className = 'dashboardMiddle'>
              <p className = 'contentHeader'>Gas spent</p>
              <CountUp className = 'emissionsValue' end = {totalTransactions} duration = {1} separator ={','}/>
            </div>
            <div className = 'dashboardRight'>
              <p className = 'contentHeader'>CO2 produced</p>
              <CountUp className = 'emissionsValue' end = {totalTransactions} duration = {1} separator ={','}/>
            </div>
          </div>
          <p className = 'impactTitle'>IMPACT</p>
          <div className = 'dashboardContent'>
            <div className = 'dashboardLeft'>
              <p className = 'contentHeader'>NFTrees</p>
              <CountUp className = 'impactValue' end = {totalTransactions} duration = {1} separator ={','}/>
            </div>
            <div className = 'dashboardMiddle'>
              <p className = 'contentHeader'>CO2 offset</p>
              <CountUp className = 'impactValue' end = {totalTransactions} duration = {1} separator ={','}/>
            </div>
            <div className = 'dashboardRight'>
              <p className = 'contentHeader'>Trees planted</p>
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