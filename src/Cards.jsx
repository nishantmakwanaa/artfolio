import React, { useState, useCallback } from "react";
import "./Globals.css";
import firebase from "./FireBase DB/FireBase";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export const CombinedCardItem = (props) => {
  const card = props.currentCard;

  const [likeClassName, setLikeClassName] = useState(false);
  const [dislikeClassName, setDislikeClassName] = useState(false);
  const [likeCounter, setLikeCounter] = useState(parseInt(card.likes, 10));
  const [dislikeCounter, setDislikeCounter] = useState(parseInt(card.dislikes, 10));
  const [search, setSearch] = useState("");

  const recieveTagText = useCallback(
    (childProps) => {
      setSearch(childProps);
      props.handleTagSearch(childProps);
    },
    [props]
  );

  const updateCardDetailsOnClick = (e) => {
    e.preventDefault();
    props.handleClickedCard(card);
  };

  const updateLikeDB = () => {
    const updates = {};
    updates["/Cards/" + card.id + "/likes"] = likeCounter + 1;
    firebase.database().ref().update(updates, (error) => {
      if (!error) {
        setLikeClassName(!likeClassName);
        setLikeCounter(likeCounter + 1);
      }
    });
  };

  const updateDislikeDB = () => {
    const updates = {};
    updates["/Cards/" + card.id + "/dislikes"] = dislikeCounter + 1;
    firebase.database().ref().update(updates, (error) => {
      if (!error) {
        setDislikeClassName(!dislikeClassName);
        setDislikeCounter(dislikeCounter + 1);
      }
    });
  };

  const tagsList = createTagsList(card.tags, recieveTagText);

  return (
    <div className="combined-card-container">
      <div id="cardContainer" className="card-container card-border" onClick={updateCardDetailsOnClick}>
        <div className="card-image-container">
          <img id="cardImage" className="card-image" alt={card.title} src={card.imgURL} />
        </div>
        <div className="overlay">
          <div id="cardTitleContainer" className="items card-title-container">
            <p id="cardTitle">{card.title}</p>
            <hr />
          </div>
          <div id="cardDateContainer" className="items card-date-container">
            <p id="cardDate">{card.date}</p>
          </div>
        </div>
      </div>

      <div className="zoom-container">
        <ZoomImage card={card} />
        <div id="detailsContainer" className="details-container">
          <p id="title" className="title">{card.title}</p>
          <hr />
          <p id="description">{card.description}</p>
          <p id="date" className="date">– {card.date}</p>
          <ul>{tagsList}</ul>
          <div className="likes-container">
            <Like
              likeClassName={likeClassName}
              likeCounter={likeCounter}
              updateLikeDB={updateLikeDB}
            />
            <Dislike
              dislikeClassName={dislikeClassName}
              dislikeCounter={dislikeCounter}
              updateDislikeDB={updateDislikeDB}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CardItem = CombinedCardItem;
export const ZoomCardItem = CombinedCardItem;

function createTagsList(tags, recieveTagText) {
  return tags.map((i) => (
    <Tag currentTag={i} key={i} handleTagSearch={recieveTagText} />
  ));
}

function Tag(props) {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState(props.currentTag.toString());

  const updateSearch = (event) => {
    event.preventDefault();
    setSearch(tag);
    props.handleTagSearch(tag);
  };

  return <li className="tag" onClick={updateSearch}>#{tag}</li>;
}

function ZoomImage(props) {
  const card = props.card;
  return (
    <div id="imageContainer" className="image-container">
      <TransformWrapper>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="image-wrapper">
              <TransformComponent>
                <img id="image" className="image" src={card.imgURL} alt={card.title} />
              </TransformComponent>
            </div>
            <div className="tools">
              <button className="zoom-in-btn" onClick={zoomIn}>
                <i className="fas fa-search-plus zoom-in-icon" />
              </button>
              <button className="zoom-out-btn" onClick={zoomOut}>
                <i className="fas fa-search-minus zoom-out-icon" />
              </button>
              <button className="zoom-reset-btn" onClick={resetTransform}>
                <i className="fas fa-expand zoom-reset-icon" />
              </button>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

function Like({ likeClassName, likeCounter, updateLikeDB }) {
  return (
    <div className="like-container">
      <i
        className={likeClassName ? "fa fa-heart like-icon like-icon-anim" : "fa fa-heart like-icon"}
        onClick={updateLikeDB}
      />
      <p id="likes">{likeCounter}</p>
    </div>
  );
}

function Dislike({ dislikeClassName, dislikeCounter, updateDislikeDB }) {
  return (
    <div className="dislike-container">
      <i
        className={dislikeClassName ? "fas fa-heart-broken dislike-icon dislike-icon-anim" : "fas fa-heart-broken dislike-icon"}
        onClick={updateDislikeDB}
      />
      <p id="dislikes" className="dislikes">{dislikeCounter}</p>
    </div>
  );
}