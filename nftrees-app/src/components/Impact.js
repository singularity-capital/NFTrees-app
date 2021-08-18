// base imports
import React, { PureComponent , useState, useEffect} from 'react';
import './Impact.css';
import { calculateAddressEmissions } from "ethereum-emissions-calculator";

function Impact() {
  const[totalGas, setTotalGas] = useState(0);
    const[totalKg, setTotalKg] = useState(0);
    const[totalTransactions, setTotalTransactions] = useState(0);
    const[validInput, setValidInput] = useState();
    const[calculating, setCalculating] = useState(false);
    var loading;

    useEffect(() => {
        loading = document.querySelector('#loading');
    }, [calculating, validInput]);

    const handleCalculateEmissions = async () => {
        setCalculating(true);
        setTotalGas(undefined);
        setTotalKg(undefined);
        setTotalTransactions(undefined);
        setValidInput(undefined);

        loading.style.display = 'flex';
        var gas = 0;
        var co2 = 0;
        var transactions = 0;
        var typeTransaction = ['eth', 'erc20', 'erc721'];

        const address = document.getElementById('input').value;
        const apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
        if((address.length === 42) & (address.slice(0, 2) === '0x')){
            for (var i = 0; i < 3; i++) {
                const emissions = await calculateAddressEmissions({
                    transactionType: typeTransaction[i],
                    address,
                    etherscanAPIKey: apiKey,
                });
                
                gas += emissions['gasUsed'];
                co2 += emissions['kgCO2'];
                transactions += emissions['transactionsCount'];
            }
            
            setTotalGas(gas);
            setTotalKg(co2);
            setTotalTransactions(transactions);
            setValidInput(true);
        } else {
            setValidInput(false);
        }
        loading.style.display = 'none';
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
              <p></p>
            </div>
            <div className = 'dashboardMiddle'>
              <p className = 'contentHeader'>Gas spent</p>

            </div>
            <div className = 'dashboardRight'>
              <p className = 'contentHeader'>CO2 produced</p>

            </div>
          </div>
          <p className = 'impactTitle'>IMPACT</p>
          <div className = 'dashboardContent'>
            <div className = 'dashboardLeft'>
              <p className = 'contentHeader'>NFTrees</p>

            </div>
            <div className = 'dashboardMiddle'>
              <p className = 'contentHeader'>CO2 offset</p>

            </div>
            <div className = 'dashboardRight'>
              <p className = 'contentHeader'>Trees planted</p>

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