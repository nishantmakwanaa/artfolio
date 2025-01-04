import React, { useState, useEffect, useCallback } from "react";
import ScrollLock from "react-scrolllock";
import firebase from "./FireBase DB/FireBase";
import { CardItem } from "./Cards";
import { Nav } from "./NavBar";
import { FloatingArrow } from ".Gallery";
import { ZoomCardItem } from "./Cards";
import "./Globals.css";

export const ArtGallery = (props) => {
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
    firebase
      .database()
      .ref("Cards")
      .once("value", (querySnapShot) => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let dataJSON = { ...data };

        setCardItemsData(dataJSON);
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
    firebase
      .database()
      .ref("/Cards/" + cardId)
      .once("value", (querySnapShot) => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let card = { ...data };

        setCard(card);
        setLock(true);
      });
  }

  function createCardItemsList(search, cardItemsData, recieveCardDetails) {
    let values = Object.values(cardItemsData);
    let list = search ? filterCards(values, search) : values;

    return list.map((i) => (
      <CardItem
        currentCard={i}
        key={i.id.toString()}
        handleClickedCard={recieveCardDetails}
      />
    ));
  }

  function filterCards(values, search) {
    return values.filter((i) => {
      let titleFlag = i.title.toLowerCase().indexOf(search) !== -1;

      let tagsFlag = false;
      if (!titleFlag && i.tags) {
        i.tags.forEach((tag) => {
          if (!tagsFlag) {
            tagsFlag = tag.toLowerCase().indexOf(search) !== -1;
          }
        });
      }

      return titleFlag || tagsFlag;
    });
  }

  let cardItemsList = createCardItemsList(search, cardItemsData, recieveCardDetails);

  return (
    <div id="ArtGallery" className="wide-art-gallery">
      <div
        className={
          lock
            ? wide
              ? "art-gallery-background avoid-clicks"
              : "art-gallery-background avoid-clicks no-scroll"
            : ""
        }
      >
        <Nav search={search} handleNavSearch={recieveNavSearchText} />
        <div id="galleryContainer" className="gallery-container">
          <ul id="gallery" className="gallery">
            {cardItemsList}
          </ul>
          <p id="cardsCounter" className="cards-counter">
            {cardItemsList.length} items found
          </p>
        </div>
        {wide && lock && <ScrollLock />}
      </div>

      {card === undefined || card.length === 0 || !lock ? (
        <FloatingArrow />
      ) : (
        <div className={wide ? "zoom-card-wide" : "zoom-card-narrow"}>
          <i className="fas fa-times exit-icon" onClick={() => setLock(false)} />
          <ZoomCardItem card={card} handleTagSearch={recieveTagSearchText} />
        </div>
      )}
    </div>
  );
};