import React, { useState, useCallback } from "react";
import "./zoom-card-item.css";
import firebase from "../../Firebase/firebase";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export const ZoomCardItem = (props) => {
  const card = props.card;
  const setSearch = useState("")[1];

  const recieveTagText = useCallback(
    (childProps) => {
      setSearch(childProps);
      props.handleTagSearch(childProps);
    },
    [props, setSearch]
  );

  const tagsList = createTagsList(card.tags, recieveTagText);

  return (
    <div className="zoom-container">
      <ZoomImage card={card} />
      <div id="detailsContainer" className="details-container">
        <p id="title" className="title">{card.title}</p>
        <hr />
        <p id="description">{card.description}</p>
        <p id="date" className="date">– {card.date}</p>
        <ul>{tagsList}</ul>
        <div className="likes-container">
          <Like card={card} />
          <Dislike card={card} />
        </div>
      </div>
    </div>
  );
};

function createTagsList(tags, recieveTagText) {
  return tags.map((i) => (
    <Tag currentTag={i} key={i} handleTagSearch={recieveTagText} />
  ));
}

function Tag(props) {
  const [tag] = useState(props.currentTag);

  const updateSearch = (event) => {
    event.preventDefault();
    props.handleTagSearch(tag);
  };

  return (
    <li className="tag" onClick={updateSearch}>
      #{tag}
    </li>
  );
}

function ZoomImage({ card }) {
  return (
    <div id="imageContainer" className="image-container">
      <TransformWrapper>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="image-wrapper">
              <TransformComponent>
                <img
                  id="image"
                  className="image"
                  src={card.imgURL}
                  alt={card.title}
                />
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

function Like({ card }) {
  const [likeClassName, setLikeClassName] = useState(false);
  const [likeCounter, setLikeCounter] = useState(card.likes);

  const updateLikeDB = () => {
    const updates = {};
    updates[`/Cards/${card.id}/likes`] = likeCounter + 1;
    firebase.database().ref().update(updates, (error) => {
      if (!error) {
        setLikeClassName(!likeClassName);
        setLikeCounter(likeCounter + 1);
      }
    });
  };

  return (
    <div className="like-container">
      <i
        className={likeClassName ? "fa fa-heart like-icon like-icon-anim" : "fa fa-heart like-icon"}
        onClick={updateLikeDB}
        onAnimationEnd={() => setLikeClassName(!likeClassName)}
      />
      <p id="likes">{likeCounter}</p>
    </div>
  );
}

function Dislike({ card }) {
  const [dislikeClassName, setDislikeClassName] = useState(false);
  const [dislikeCounter, setDislikeCounter] = useState(card.dislikes);

  const updateDislikeDB = () => {
    const updates = {};
    updates[`/Cards/${card.id}/dislikes`] = dislikeCounter + 1;
    firebase.database().ref().update(updates, (error) => {
      if (!error) {
        setDislikeClassName(!dislikeClassName);
        setDislikeCounter(dislikeCounter + 1);
      }
    });
  };

  return (
    <div className="dislike-container">
      <i
        className={dislikeClassName ? "fa fa-heart-broken dislike-icon dislike-icon-anim" : "fa fa-heart-broken dislike-icon"}
        onClick={updateDislikeDB}
        onAnimationEnd={() => setDislikeClassName(!dislikeClassName)}
      />
      <p id="dislikes">{dislikeCounter}</p>
    </div>
  );
}
