import React from 'react';
import {NavLink} from "react-router-dom";
import { NavHashLink } from 'react-router-hash-link';
import './Navbar.css';
import logo from '../assets/logo.png';
import eth from '../assets/eth_logo.png';
import polygon from '../assets/polygon_logo.png';

function Navbar (props){

    function SubstringAddress () {
        // if address variable is an address, substring to save space
        if(props.account){
            if (props.account.length > 40){
                return(<div className = 'addressContainer'><img src = {eth} height = {20}/> <p className = 'addressText'>{props.account.substring(0, 5) + "..." + props.account.substring(36, 42)}</p></div>)
            }
            // if network is wrong display 'wrong network'
            else if (props.account === 'wrong network'){
                return(<div className = 'addressContainer'><p className = 'addressText'>{props.account}</p></div>)
            }
            else{
                return(<button onClick = {props.connectWallet} className = 'connectWallet'> <img src = {eth} height = {20}/> <p className = 'connectWalletText'>connect wallet</p> </button>)
            }
        }
        else {
            return(<button onClick = {props.connectWallet} className = 'connectWallet'> <img src = {eth} height = {20}/> <p className = 'connectWalletText'>connect wallet</p> </button>)
        }
    }

    return(
        <nav className = 'navbar'>
            {/* display navbar links */}
            <a className = "navbar-Brand" href = 'https://nftrees.com/'> <img src = {logo} height = {50}/> </a>
            <p className = 'spacer'/>
            <NavLink exact smooth activeClassName = "active-navbar-Link" className = "navbar-Link" to = '/'> Plant </NavLink>
            <p className = 'spacer'/>
            <NavLink exact smooth activeClassName = "active-navbar-Link" className = "navbar-Link" to = '/impact'> My impact </NavLink>
            <p className = 'spacer'/>
            <NavLink exact smooth activeClassName = "active-navbar-Link" className = "navbar-Link" to = '/wallet'> My wallet </NavLink>
            <p className = 'spacer'/>

            {/* display user address */}
            <p className = "address my-auto"> <SubstringAddress/> </p>

        </nav>
    );
}

export default Navbar;