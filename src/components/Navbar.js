import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";
import eth from "../assets/eth_logo.png";
import { slide as Menu } from "react-burger-menu";
import opensea_logo from "../assets/opensea_logo.png";
import { FaTree } from "react-icons/fa";
import "./Burger.css";

function Navbar(props) {
  function SubstringAddress() {
    if (props.account) {
      if (props.Currentnetwork === 1) {
        return (
          <div className="addressContainer">
            <div className="addressText">
              {props.account.substring(0, 5) +
                "..." +
                props.account.substring(36, 42)}
            </div>
          </div>
        );
      }
      // if network is wrong display 'wrong network'
      else {
        return (
          <div className="addressContainer">
            <p className="addressText">Wrong Network</p>
          </div>
        );
      }
    } else {
      return (
        <button onClick={props.connectWallet} className="connectWallet">
          {" "}
          <div className="connectWalletText">Connect Wallet</div>{" "}
        </button>
      );
    }
  }

  function SubstringAddressMobile() {
    if (props.account) {
      if (props.Currentnetwork === 1) {
        return (
          <div className="addressContainerMobile">
            <div className="addressText">
              {props.account.substring(0, 5) +
                "..." +
                props.account.substring(36, 42)}
            </div>
          </div>
        );
      }
      // if network is wrong display 'wrong network'
      else {
        return (
          <div className="addressContainerMobile">
            <p className="addressText">Wrong Network</p>
          </div>
        );
      }
    } else {
      return (
        <button onClick={props.connectWallet} className="connectWalletMobile">
          {" "}
          <div className="connectWalletText">Connect Wallet</div>{" "}
        </button>
      );
    }
  }

  return (
    <nav className="navbar">
      {/* display navbar links */}
      <a exact className="logo" href="https://nftrees.com/">
        {" "}
        <img className="logoImage" src={logo} alt="logo" height={50} />{" "}
        <div className="landingTitle">
          NF
          <div className="split" />
          Trees
        </div>
      </a>

      <div className="menu">
        <NavLink
          exact
          activeClassName="active-navbar-Link"
          className="navbar-Link"
          to="/"
        >
          Plant
        </NavLink>
        <NavLink
          exact
          activeClassName="active-navbar-Link"
          className="navbar-Link"
          to="/dashboard"
        >
          Dashboard
        </NavLink>
        <a
          exact
          activeClassName="active-navbar-Link"
          className="navbar-Link"
          href="https://offsetra.com/profile/NFTrees"
          rel="noreferrer"
          target="_blank"
        >
          Portfolio<sup>↗</sup>
        </a>
        <a
          exact
          activeClassName="active-navbar-Link"
          className="navbar-Link"
          href="https://opensea.io/collection/nftrees-carbon-credits"
          rel="noreferrer"
          target="_blank"
        >
          OpenSea<sup>↗</sup>
        </a>
      </div>

      {/* display user address */}
      <div className="address my-auto"> {SubstringAddress()} </div>

      <Menu right>
        <div className="addressMobile"> {SubstringAddressMobile()} </div>
        <NavLink exact className="menu-item" to="/">
          Plant
        </NavLink>
        <NavLink exact className="menu-item" to="/dashboard">
          Dashboard
        </NavLink>
        <a
          className="menu-item"
          href="https://offsetra.com/profile/NFTrees"
          target="_blank"
        >
          <FaTree style={{ marginRight: "10px" }} />
          Offsetra
        </a>
        <a
          className="menu-item"
          href="https://opensea.io/collection/nftrees-carbon-credits"
          target="_blank"
        >
          <img
            src={opensea_logo}
            alt="OpenSea"
            style={{ marginRight: "10px", height: "15px" }}
          />
          Opensea
        </a>
      </Menu>
    </nav>
  );
}

export default Navbar;
