import React, { useState, useCallback } from "react";
import "./nav.css";
import { Search } from "../Search/Search";
import logo from "../../logo.png";

export const Nav = (props) => {
  const [search, setSearch] = useState(props.search || "");

  const recieveSearchText = useCallback(
    (propsChild) => {
      if (typeof propsChild === "string") {
        setSearch(propsChild.charAt(0).toUpperCase() + propsChild.slice(1));
      } else {
        setSearch("");
      }

      props.handleNavSearch(propsChild);
    },
    [props]
  );

  return (
    <div id="navContainer" className="nav-container">
      <div id="logoContainer" className="logo-container">
        <img id="logoImage" className="logo-image" alt="logo" src={logo} />
      </div>
      <Search search={search} handleSearch={recieveSearchText} />
      <div id="iconsContainer" className="icons-container">
        <div id="homeIconContainer" className="icon-container">
          <a href="https://www.nishantworldwide.in/">
            <i id="home" className="fa fa-home icon bar-icon" />
          </a>
        </div>
        <div id="contactIconContainer" className="icon-container">
          <a href="mailto:nishantmakwanacreations@gmail.com">
            <i id="contact" className="fa fa-envelope icon bar-icon" />
          </a>
        </div>
      </div>
    </div>
  );
};