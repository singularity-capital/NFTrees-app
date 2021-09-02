import React from 'react';
import {NavLink} from "react-router-dom";
import './Navbar.css';
import logo from '../assets/logo.png';
import eth from '../assets/eth_logo.png';

function Navbar (props){

    function SubstringAddress () {
        if(props.account){
            if (props.Currentnetwork === 4){
                return(<div className = 'addressContainer'><img src = {eth} height = {20} alt = {'Could not load'}/> <p className = 'addressText'>{props.account.substring(0, 5) + "..." + props.account.substring(36, 42)}</p></div>)
            }
            // if network is wrong display 'wrong network'
            else {
                return(<div className = 'addressContainer'><p className = 'addressText'>wrong network</p></div>)
            }
        }
        else {
            return(<button onClick = {props.connectWallet} className = 'connectWallet'> <img src = {eth} height = {20} alt = {'Could not load'}/> <p className = 'connectWalletText'>connect wallet</p> </button>)
        }
    }

    return(
        <nav className = 'navbar'>
            {/* display navbar links */}
            <a className = "navbar-Brand" href = 'https://nftrees.com/'> <img src = {logo} height = {50} alt = {'Could not load'}/> </a>
            <div className = 'spacer'/>
            <NavLink exact activeClassName = "active-navbar-Link" className = "navbar-Link" to = '/'> PLANT </NavLink>
            <div className = 'spacer'/>
            <NavLink exact activeClassName = "active-navbar-Link" className = "navbar-Link" to = '/impact'> MY IMPACT </NavLink>
            <div className = 'spacer'/>

            {/* display user address */}
            <div className = "address my-auto"> <SubstringAddress/> </div>

        </nav>
    );
}

export default Navbar;