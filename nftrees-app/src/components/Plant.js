// base imports
import React, {useEffect, useState} from 'react';
import './Plant.css';
import card from '../assets/card.png';
import bigInt from "big-integer";
import Dropdown from 'react-dropdown';
import dai from '../assets/dai_logo.png';
import usdc from '../assets/usdc_logo.png';
import usdt from '../assets/usdt_logo.png';

import Web3 from 'web3';

class Plant extends React.Component {
    constructor (props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            level: 1,
            coinIndex: 0,
            totalCost: 10,
            coinMenuOpen: false,
            isApproved: false,
            test: 0
        }; 

        this.coins = [
            'DAI',
            'USDC',
            'USDT'
        ];

        this.options = [
            { value: 'DAI', label: <div className = 'currencyOption'><div className = 'currencyLogo'><img src={dai} height="20px" width="20px"/></div><p className = 'currencyText'>DAI</p></div> },
            { value: 'USDC', label: <div className = 'currencyOption'><div className = 'currencyLogo'><img src={usdc} height="20px" width="20px"/></div><p className = 'currencyText'>USDC</p></div> },
            { value: 'USDT', label: <div className = 'currencyOption'><div className = 'currencyLogo'><img src={usdt} height="20px" width="20px"/></div><p className = 'currencyText'>USDT</p></div> },
        ];

        this.defaultOption = this.options[0];

        /*this.addEventListeners = this.addEventListeners.bind(this);
        this.displayButton = this.displayButton.bind(this);
        this.displayNFTree = this.displayNFTree.bind(this);
        this.displayLevel = this.displayLevel.bind(this);
        this.displayLevelDescription = this.displayLevelDescription.bind(this);
        this.displayTotal = this.displayTotal.bind(this);
        this.incLevel = this.incLevel.bind(this);
        this.decLevel = this.decLevel.bind(this);
        this.changeCurrency = this.changeCurrency.bind(this);
        this.checkApproval = this.checkApproval.bind(this);
        this.approve = this.approve.bind(this);
        this.buyNFTree = this.buyNFTree.bind(this);*/

        this.checkApproval();
        this.addEventListeners();
    }

    /*useEffect(() => {
        const defaultOption = options[0];
        checkApproval();
        addEventListeners();
        
        return () => {
            console.log('cleaned up plant');
        };
    },[totalCost, test]);*/

    addEventListeners = async () => {
        this.props.DAIContract.events.allEvents()
        .on('data', (event) => {
            console.log(event);
            this.setState({
                test: event
            }); 
        })
        .on('error', console.error);
    }

    displayButton = () => {
        if(this.state.isApproved === false) {
            return(
                <button className = 'plantButton' onClick = {this.approve}>
                    <p> APPROVE {this.state.totalCost} {this.coins[this.state.coinIndex]}</p> 
                </button>
            )
        } else {
            return(
                <button className = 'plantButton' onClick = {this.buyNFTree}>
                    <p> PLANT </p> 
                </button>
            )
        }
    }

    displayNFTree = () => {
        return(
            <img src = {card} height = {560} width = {400}/>
        )
    }

    displayLevel = () => {
        return(
            'NFTree level ' + String(this.state.level)
        )
    }

    displayLevelDescription = () => {
        if(this.state.level === 1){
            return('1 tonne CO2 offset + 1 tree planted');
        }
        else if (this.state.level === 2){
            return('10 tonnes CO2 offset + 10 trees planted');
        }
        else if (this.state.level === 3){
            return('100 tonnes CO2 offset + 100 trees planted');
        }
        else{
            return('1000 tonnes CO2 offset + 1000 trees planted');
        }
    }

    displayTotal = () => {
        var coin;
        if (this.state.coinIndex === 0){
            coin = 'DAI';
        }
        else if (this.state.coinIndex === 1) {
            coin = 'USDC';
        }
        else if (this.state.coinIndex === 2) {
            coin = 'USDT';
        }
        return(
            '$' + String(this.state.totalCost) + ' ' + coin
        )
    }

    incLevel = () => {
        if(this.state.level < 4){
            this.setState({
                level: this.state.level + 1,
                totalCost: this.state.totalCost * 10,
            });
            console.log(this.state);
        }
    }

    decLevel = () => {
        if(this.state.level > 1){
            this.setState({
                level: this.state.level - 1,
                totalCost: this.state.totalCost / 10,
            }); 
        }
    }

    checkApproval = async () => {
        let allowance = await this.props.getAllowance(this.coins[this.state.coinIndex]);
        if(allowance < this.state.totalCost * (10**18)){
            this.setState({
                isApproved: false
            }); 
        }
        else {
            this.setState({
                isApproved: true
            }); 
        }
    }

    approve = async () => {
        if(this.props.isConnected){
            this.props.approve(this.state.totalCost, this.coins[this.state.coinIndex]);
        } else {
            alert("connect metamask!");
        }
    }

    buyNFTree = async () => {
        let numCredits = this.state.totalCost / 10;
        if(this.props.isConnected){
            this.props.buyNFTree(this.state.numCredits, this.state.totalCost, this.coins[this.state.coinIndex]);
        } else {
            alert("connect metamask!");
        }
    }

    changeCurrency = (event) => {
        console.log(event.value);
        var currency = event.value;
        if (currency === 'DAI'){
            this.setState({
                coinIndex: 0
            }); 
        }
        else if (currency === 'USDC') {
            this.setState({
                coinIndex: 1
            }); 
        }
        else if (currency === 'USDT') {
            this.setState({
                coinIndex: 2
            }); 
        }
    }

    render() {
        return (
            <div className = "Plant">
                <div className = 'plantContainer'>
                    <div className = 'plantGrid'>
                        <div className = 'plantLeft'>
                            <p className = 'plantTitle'>PLANT</p>

                            <div className = 'levelSelector'>
                                <div className = 'selector'> 
                                    <button className = 'selectorButton' onClick = {this.decLevel}> - </button>
                                    <button className = 'selectorButton' onClick = {this.incLevel}> + </button>
                                </div>

                                <div className = 'level'> 
                                    <p className = 'levelText'> {this.displayLevel()} </p>
                                </div>
                            </div>

                            <div className = 'levelDescription'>
                                <p className = 'description'>{this.displayLevelDescription()}</p>
                            </div>

                            <div className = 'currencySelector'>
                                <div className = 'currency'> 
                                    <Dropdown className = 'currencyDropdown' options={this.options} onChange={this.changeCurrency} value={this.options[this.state.coinIndex]} placeholder="Select currency"/>
                                </div>

                                <div className = 'total'> 
                                    <p className = 'totalText'> {this.displayTotal()} </p>
                                </div>
                            </div>

                            {this.displayButton()}
                        </div>

                        <div className = 'plantRight'>{this.displayNFTree()}</div>
                    </div>
                </div>
            </div>
        );
    }   
}

export default Plant;
