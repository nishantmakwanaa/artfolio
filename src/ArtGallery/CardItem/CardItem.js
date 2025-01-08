import React from "react";
import "./card-item.css";

function Card(props) {
  const currentCard = props.currentCard;

  return (
    <div id="cardContainer" className="card-container card-border">
      <div className="card-image-container">
        <img
          id="cardImage"
          className="card-image"
          alt={currentCard.title}
          src={currentCard.imgURL}
          onClick={() => window.location.href = `mailto:${currentCard.email}`}
        />
      </div>
      <div className="overlay">
        <div id="cardTitleContainer" className="items card-title-container">
          <p id="cardTitle">{currentCard.title}</p>
          <hr />
        </div>
        <div id="cardDateContainer" className="items card-date-container">
          <p id="cardDate">{currentCard.date}</p>
        </div>
        <div className="items artist-info-container">
          <p id="artistName">{currentCard.artistName}</p>
          <div className="social-links">
            {currentCard.socialMediaLinks && currentCard.socialMediaLinks.map((link, index) => (
              <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                <img src={link.icon} alt={link.name} className="social-icon" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const CardItem = (props) => {
  function updateCardDetailsOnClick(e) {
    e.preventDefault();

    let card = props.currentCard;

    props.handleClickedCard(card);
  }

  return (
    <li onClick={updateCardDetailsOnClick}>
      <Card currentCard={props.currentCard} />
    </li>
  );
};