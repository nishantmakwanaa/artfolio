import React, { useState, useCallback, useEffect } from "react";
import ScrollLock from "react-scrolllock";
import firebase from "../Firebase/firebase";

import { Nav } from "./Nav/Nav";
import { Gallery } from "./Gallery/Gallery";
import { FloatingArrow } from "./FloatingArrow/FloatingArrow";
import { ZoomCardItem } from "./ZoomCardItem/ZoomCardItem";

import "./art-gallery.css";

export const ArtGallery = (props) => {
  const [lock, setLock] = useState(false);
  const [search, setSearch] = useState("");
  const [card, setCard] = useState([]);
  const [wide, setWide] = useState(false);

  useEffect(
    () => {
      if (props.windowWidth < 501) {
        console.log("narrow");
        setWide(false);
      } else {
        console.log("wide");
        setWide(true);
      }
    },
    [props.windowWidth]
  );

  const recieveNavSearchText = useCallback(
    (props) => {
      setSearch(props);
    },
    []
  );

  const recieveTagSearchText = useCallback(
    (props) => {

      setLock(false);

      setSearch(props.toLowerCase());
    },
    []
  );

  const recieveCardDetails = useCallback((propsChild) => {
    let cardId = propsChild.id;
    console.log("from recieveCardDetails", cardId);

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
        <Gallery
          search={search}
          handleGalleryClickedCard={recieveCardDetails}
        />
        {wide && lock && <ScrollLock />}
      </div>

      {card === undefined || card.length === 0 || !lock ? (
        <FloatingArrow />
      ) : (
        <div className={wide ? "zoom-card-wide" : "zoom-card-narrow"}>
          <i
            className="fas fa-times exit-icon"
            onClick={() => setLock(false)}
          />
          <ZoomCardItem card={card} handleTagSearch={recieveTagSearchText} />
        </div>
      )}
    </div>
  );
};