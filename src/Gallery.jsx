import React, { useState, useEffect, useCallback } from "react";
import ScrollLock from "react-scrolllock";
import { ref, get } from "firebase/database";
import { CombinedCardItem } from "./Cards";
import { database } from './FireBase DB/FireBase';
import { Nav } from "./NavBar";
import "./Globals.css";

const ArtGallery = (props) => {
  const [cardItemsData, setCardItemsData] = useState([]);
  const [lock, setLock] = useState(false);
  const [search, setSearch] = useState("");
  const [card, setCard] = useState([]);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    if (props.windowWidth < 501) {
      setWide(false);
    } else {
      setWide(true);
    }
  }, [props.windowWidth]);

  useEffect(() => {
    const cardsRef = ref(database, 'Cards');
    get(cardsRef)
      .then((snapshot) => {
        const data = snapshot.val() ? snapshot.val() : {};
        const dataJSON = { ...data };
        setCardItemsData(dataJSON);
      })
      .catch((error) => {
        console.error("Error Fetching Card Data : ", error);
      });
  }, []);

  const recieveNavSearchText = useCallback((props) => {
    setSearch(props);
  }, []);

  const recieveTagSearchText = useCallback((props) => {
    setLock(false);
    setSearch(props.toLowerCase());
  }, []);

  const recieveCardDetails = useCallback((propsChild) => {
    let cardId = propsChild.id;
    recieveCardFromDB(cardId);
  }, []);

  function recieveCardFromDB(cardId) {
    const cardRef = ref(database, '/Cards/' + cardId);
    get(cardRef)
      .then((snapshot) => {
        const data = snapshot.val() ? snapshot.val() : {};
        setCard(data);
        setLock(true);
      })
      .catch((error) => {
        console.error("Error Fetching Card Data : ", error);
      });
  }

  function createCardItemsList(search, cardItemsData) {
    let filteredData = Object.keys(cardItemsData).map((i) => cardItemsData[i]);
    
    if (search === "") {
      return filteredData.map((card) => (
        <CombinedCardItem
          key={card.id}
          currentCard={card}
          handleTagSearch={recieveTagSearchText}
          handleClickedCard={recieveCardDetails}
        />
      ));
    } else {

      let matchedData = filteredData.filter((i) => {
        const titleMatch = i.title && i.title.toLowerCase().includes(search);
        const tagMatch = i.tags && i.tags.some(tag => tag.toLowerCase().includes(search));
        return titleMatch || tagMatch;
      });

      return matchedData.map((card) => (
        <CombinedCardItem
          key={card.id}
          currentCard={card}
          handleTagSearch={recieveTagSearchText}
          handleClickedCard={recieveCardDetails}
        />
      ));
    }
  }

  return (
    <div className="gallery-container">
      <ScrollLock isActive={lock} />
      <Nav searchText={recieveNavSearchText} />
      <div id="gallery">
        {createCardItemsList(search, cardItemsData)}
      </div>
    </div>
  );
};

export default ArtGallery;