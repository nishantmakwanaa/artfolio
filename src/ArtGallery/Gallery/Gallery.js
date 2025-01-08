import React, { useState, useEffect, useCallback } from "react";
import "./gallery.css";
import firebase from "../../Firebase/firebase";
import { CardItem } from "../CardItem/CardItem";

export const Gallery = (props) => {
  const [cardItemsData, setCardItemsData] = useState([]);
  const [clickedCard, setClickedCard] = useState(null);


  const { handleGalleryClickedCard } = props;

  const recieveCardDetails = useCallback(
    (propsChild) => {
      let card = propsChild;
      console.log("recieveCardDetails", card);
      setClickedCard(card);

      if (handleGalleryClickedCard) {
        handleGalleryClickedCard(card);
      }
      if (handleGalleryClickedCard) {
        handleGalleryClickedCard(card);
      }
    },
    [setClickedCard, handleGalleryClickedCard]
  );

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

  let cardItemsList = createCardItemsList(props.search, cardItemsData, recieveCardDetails);

  return (
    <div id="galleryContainer" className="gallery-container">
      <ul id="gallery" className="gallery">
        {cardItemsList}
      </ul>
      <p id="cardsCounter" className="cards-counter">
        {cardItemsList.length} Items Found
      </p>
    </div>
  );
};

function createCardItemsList(search, cardItemsData, recieveCardDetails) {
  let values = Object.values(cardItemsData);
  let list;

  if (search) {
    list = filterCards(values, search);
  } else {
    list = values;
  }

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
    let tagsFlag = i.tags
      ? i.tags.some((tag) => tag.toLowerCase().indexOf(search) !== -1)
      : false;

    return titleFlag || tagsFlag;
  });
}