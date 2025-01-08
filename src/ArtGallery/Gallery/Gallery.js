import React, { useState, useEffect, useCallback } from "react";
import "./gallery.css";
import firebase from "../../Firebase/firebase"
import { CardItem } from "../CardItem/CardItem";

export const Gallery = props => {

  const [cardItemsData, setCardItemsData] = useState([]);
  const [setClickedCard] = useState(null);


  const recieveCardDetails = useCallback(
    propsChild => {
      let card = propsChild;
      console.log("recieveCardDetails", card);
      setClickedCard(card);
  }, [setClickedCard]);

  useEffect(
    () => {

      firebase
        .database()
        .ref("Cards")
        .once("value", querySnapShot => {
          let data = querySnapShot.val() ? querySnapShot.val() : {};
          let dataJSON = { ...data };

          setCardItemsData(dataJSON);
        });
    },
    []
  );

  let cardItemsList = createCardItemsList(
    props.search,
    cardItemsData,
    recieveCardDetails
  );

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

  let cardItemsList = list.map(i => (
    <CardItem
      currentCard={i}
      key={i.id.toString()}
      handleClickedCard={recieveCardDetails}
    />
  ));

  return cardItemsList;
}

function filterCards(values, search) {
  let filtered = values.filter(i => {

    let titleFlag = i.title.toLowerCase().indexOf(search) !== -1;

    let tagsFlag = false;
    if (!titleFlag && i.tags) {
      i.tags.filter(tag => {
        if (!tagsFlag) {
          tagsFlag = tag.toLowerCase().indexOf(search) !== -1;
        }
        return tagsFlag;
      });
    }

    return titleFlag || tagsFlag;
  });

  return filtered;
}