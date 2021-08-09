// base imports
import React, {useEffect, useState} from 'react';
import './Plant.css';
import card from '../assets/card.png';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function Plant() {
    const[level, setLevel] = useState(1);
    const[coin, setCoin] = useState('USDT');
    const[totalCost, setTotalCost] = useState(10);
    const[coinMenuOpen, setCoinMenuOpen] = useState(false);
    const[isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        checkApproval();
    },[]);

    function displayButton(){
        if(isApproved === false){
            return(
                <button className = 'plantButton'>
                    <p> APPROVE </p> 
                </button>
            )
        } else {
            return(
                <button className = 'plantButton'>
                    <p> PLANT </p> 
                </button>
            )
        }
    }

    function displayNFTree(){
        return(
            <img src = {card} height = {560} width = {400}/>
        )
    }

    function displayLevel(){
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
        return(
            '$' + String(totalCost) + ' ' + coin
        )
    }

    function incLevel() {
        if(level < 4){
            setLevel(level + 1);
            setTotalCost(totalCost * 10);
            checkApproval();
        }
    }

    function decLevel() {
        if(level > 1){
            setLevel(level - 1);
            setTotalCost(totalCost / 10);
            checkApproval();
        }
    }

    function checkApproval() {

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
