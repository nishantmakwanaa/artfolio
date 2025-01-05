import React, { useState, useEffect, useCallback } from "react";
import "./gallery.css";
import firebase from "../../Firebase/firebase";
import { CardItem } from "../CardItem/CardItem";

export const Gallery = (props) => {
  const [cardItemsData, setCardItemsData] = useState([]);
  const setClickedCard = useState(null);


  const recieveCardDetails = useCallback(
    (propsChild) => {
      let card = propsChild;
      console.log("recieveCardDetails", card);
      setClickedCard(card);
    },
    [setClickedCard] // Ensure setClickedCard is correctly used
  );

  useEffect(() => {
    // DB Request, extract all the data from Firebase
    firebase
      .database()
      .ref("Cards")
      .once("value", querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let dataJSON = { ...data };

        // Initialize the state with all the data received from DB
        setCardItemsData(dataJSON);
      });
  }, []); // Run only once when component mounts

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
        {cardItemsList.length} items found
      </p>
    </div>
  );
};

/**
 * Extract JSON received from DB {cardItemsData}
 * init new {CardItem} component for each JSON object, as props
 * @param {State} cardItemsData
 */
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

/**
 * Filter the cards according to the search text
 */
function filterCards(values, search) {
  return values.filter((i) => {
    const titleFlag = i.title.toLowerCase().includes(search.toLowerCase());
    const tagsFlag = i.tags && i.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return titleFlag || tagsFlag;
  });
}
