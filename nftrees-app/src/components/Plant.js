// base imports
import React, {useEffect, useState} from 'react';
import './Plant.css';
import card from '../assets/card.png';
import bigInt from "big-integer";
import Dropdown from 'react-dropdown';
import dai from '../assets/dai_logo.png';
import usdc from '../assets/usdc_logo.png';
import usdt from '../assets/usdt_logo.png';

function Plant(props) {
    const[level, setLevel] = useState(1);
    const[coinIndex, setcoinIndex] = useState(0);
    const[totalCost, setTotalCost] = useState(10);
    const[coinMenuOpen, setCoinMenuOpen] = useState(false);
    const[isApproved, setIsApproved] = useState(false);

    const coins = [
        'DAI',
        'USDC',
        'USDT'
    ];

    useEffect(() => {
        const defaultOption = options[0];
        checkApproval();
    },[totalCost]);

    function displayButton() {
        if(isApproved === false) {
            return(
                <button className = 'plantButton' onClick = {approve}>
                    <p> APPROVE {totalCost} {coins[coinIndex]}</p> 
                </button>
            )
        } else {
            return(
                <button className = 'plantButton' onClick = {buyNFTree}>
                    <p> PLANT </p> 
                </button>
            )
        }
    }

    function displayNFTree() {
        return(
            <img src = {card} height = {560} width = {400}/>
        )
    }

    function displayLevel() {
        return(
            'NFTree level ' + String(level)
        )
    }

    function displayLevelDescription(){
        if(level === 1){
            return('1 tonne CO2 offset + 1 tree planted');
        }
        else if (level === 2){
            return('10 tonnes CO2 offset + 10 trees planted');
        }
        else if (level === 3){
            return('100 tonnes CO2 offset + 100 trees planted');
        }
        else{
            return('1000 tonnes CO2 offset + 1000 trees planted');
        }
    }

    function displayTotal() {
        var coin;
        if (coinIndex === 0){
            coin = 'DAI';
        }
        else if (coinIndex === 1) {
            coin = 'USDC';
        }
        else if (coinIndex === 2) {
            coin = 'USDT';
        }
        return(
            '$' + String(totalCost) + ' ' + coin
        )
    }

    function incLevel() {
        if(level < 4){
            setLevel(level + 1);
            setTotalCost(totalCost * 10);
            //checkApproval();
        }
    }

    function decLevel() {
        if(level > 1){
            setLevel(level - 1);
            setTotalCost(totalCost / 10);
            //checkApproval();
        }
    }

    const checkApproval = async () => {
        let allowance = await props.getAllowance(coins[coinIndex]);
        console.log('allowance =', allowance);
        console.log('totalCost =', bigInt(totalCost * (10**18)));
        if(allowance < totalCost * (10**18)){
            setIsApproved(false);
        }
        else{
            setIsApproved(true);
        }
    }

    const approve = async () => {
        props.approve(totalCost, coins[coinIndex]);
    }

    const buyNFTree = async () => {
        let numCredits = totalCost / 10;
        props.buyNFTree(numCredits, totalCost, coins[coinIndex]);
    }

    const options = [
        { value: 'DAI', label: <div className = 'currencyOption'><div className = 'currencyLogo'><img src={dai} height="20px" width="20px"/></div><p className = 'currencyText'>DAI</p></div> },
        { value: 'USDC', label: <div className = 'currencyOption'><div className = 'currencyLogo'><img src={usdc} height="20px" width="20px"/></div><p className = 'currencyText'>USDC</p></div> },
        { value: 'USDT', label: <div className = 'currencyOption'><div className = 'currencyLogo'><img src={usdt} height="20px" width="20px"/></div><p className = 'currencyText'>USDT</p></div> },
    ];
    // const defaultOption = options[0];

    function changeCurrency(props) {
        var currency = props.value;
        if (currency === 'DAI'){
            setcoinIndex(0);
        }
        else if (currency === 'USDC') {
            setcoinIndex(1);
        }
        else if (currency === 'USDT') {
            setcoinIndex(2);
        }
    }

  return (
    <div className = "Plant">
        <div className = 'plantContainer'>
            <div className = 'plantGrid'>
                <div className = 'plantLeft'>
                    <p className = 'plantTitle'>PLANT</p>

                    <div className = 'levelSelector'>
                        <div className = 'selector'> 
                            <button className = 'selectorButton' onClick = {decLevel}> - </button>
                            <button className = 'selectorButton' onClick = {incLevel}> + </button>
                        </div>

                        <div className = 'level'> 
                            <p className = 'levelText'> {displayLevel()} </p>
                        </div>
                    </div>

                    <div className = 'levelDescription'>
                        <p className = 'description'>{displayLevelDescription()}</p>
                    </div>

                    <div className = 'currencySelector'>
                        <div className = 'currency'> 
                            <Dropdown className = 'currencyDropdown' options={options} onChange={changeCurrency} value={options[coinIndex]} placeholder="Select currency"/>
                        </div>

                        <div className = 'total'> 
                            <p className = 'totalText'> {displayTotal()} </p>
                        </div>
                    </div>

                    {displayButton()}
                </div>

                <div className = 'plantRight'>{displayNFTree()}</div>
            </div>
        </div>
    </div>
  );
}

export default Plant;
