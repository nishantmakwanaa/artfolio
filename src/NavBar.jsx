import React, { useState, useCallback, useEffect } from "react";
import "./Globals.css";
import logo from "../public/logo.png";

export const Nav = (props) => {
  const { search: initialSearch, handleNavSearch } = props;
  const [search, setSearch] = useState(initialSearch);

  const recieveSearchText = useCallback(
    (searchText) => {
      setSearch(searchText);
      handleNavSearch(searchText);
    },
    [handleNavSearch]
  );

  const Search = (props) => {
    const [search, setSearch] = useState(props.search);

    useEffect(() => {
      setSearch(props.search.charAt(0).toUpperCase() + props.search.slice(1));
    }, [props.search]);

    function updateSearch(event) {

      let searchText = event.target.value.substr(0, 30).toLowerCase();
      setSearch(searchText);

      props.handleSearch(searchText);
    }

    function deleteSearch() {

      let searchText = "";
      setSearch(searchText);

      props.handleSearch(searchText);
    }

    const updateSearchOnSubmit = (e) => {
      e.preventDefault();
      props.handleSearch(search);
    };

    return (
      <div id="searchContainer" className="search-container">
        <i id="searchIcon" className="fa fa-search search-icon" />
        <form onSubmit={updateSearchOnSubmit}>
          <input
            id="searchInput"
            className="search-input"
            onChange={updateSearch}
            placeholder="Search"
            value={search}
          />
        </form>

        <i
          className={
            search
              ? "fas fa-times delete-icon show"
              : "fas fa-times delete-icon hide"
          }
          onClick={deleteSearch}
        />
      </div>
    );
  };

  return (
    <div id="navContainer" className="nav-container">
      <div id="logoContainer" className="logo-container">
        <img id="logoImage" className="logo-image" alt="logo" src={logo} />
      </div>
      
      <Search search={search} handleSearch={recieveSearchText} />

      <div id="iconsContainer" className="icons-container">
        <div id="homeIconContainer" className="icon-container">
          <a href="https://shir0206.github.io/ShirWeb/">
            <i id="home" className="fa fa-home icon bar-icon" />
          </a>
        </div>
        <div id="contactIconContainer" className="icon-container">
          <a href="mailto:shir0206@gmail.com">
            <i id="contact" className="fa fa-envelope icon bar-icon" />
          </a>
        </div>
      </div>
    </div>
  );
};