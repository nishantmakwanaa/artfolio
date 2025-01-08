import React, { useState, useEffect, useCallback } from "react";
import "./zoom-card-item.css";
import firebase from "../../Firebase/firebase";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export const ZoomCardItem = (props) => {
  const { card, handleTagSearch } = props;

  const setSearch = useState("")[1];

  const recieveTagText = useCallback(
    (childProps) => {
      setSearch(childProps);
      handleTagSearch(childProps);
    },
    [handleTagSearch, setSearch]
  );

  const tagsList = createTagsList(card.tags, recieveTagText);

  return (
      <div className="zoom-container">
        <ZoomImage card={card} />
        <div id="detailsContainer" className="details-container">
          <p id="title" className="title">
            {card.title}
          </p>
          <hr />
          <p id="description">{card.description}</p>
          <p id="date" className="date">
            – {card.date}
          </p>
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
  let tagsList = tags.map((i) => (
    <Tag currentTag={i} key={i} handleTagSearch={recieveTagText} />
  ));
  return tagsList;
}

function Tag(props) {
  const [, setSearch] = useState("");
  const [tag] = useState(props.currentTag.toString());

  function updateSearch(event) {
    event.preventDefault();

    setSearch(tag);

    props.handleTagSearch(tag);
  }

  return (
    <li className="tag" onClick={updateSearch}>
      #{tag}
    </li>
  );
}

function ZoomImage(props) {
  let card = props.card;
  return (
    <div id="imageContainer" className="image-container">
      <TransformWrapper>
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <React.Fragment>
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
          </React.Fragment>
        )}
      </TransformWrapper>
    </div>
  );
}

function Like(props) {
  let card = props.card;

  const [likeClassName, setLikeClassName] = useState(false);
  const [likeCounter, setLikeCounter] = useState(function () {
    return parseInt(props.card.likes, 10);
  });

  useEffect(() => {
    setLikeCounter(parseInt(props.card.likes, 10));
  }, [props.card.likes]);

  useEffect(() => {
    setLikeCounter(parseInt(props.card.likes, 10));
  }, [props]);

  function updateLikeDB() {
    var updates = {};
    updates["/Cards/" + card.id + "/likes"] = likeCounter + 1;
    firebase
      .database()
      .ref()
      .update(updates, function (error) {
        if (error) {
          return false;
        } else {

          setLikeClassName(!likeClassName);
          setLikeCounter(likeCounter + 1);
          return true;
        }
      });
  }

  return (
    <div className="like-container">
      <i
        className={
          likeClassName
            ? "fa fa-heart like-icon like-icon-anim"
            : "fa fa-heart like-icon "
        }
        onClick={updateLikeDB}
        onAnimationEnd={() => setLikeClassName(!likeClassName)}
      />
      <p id="likes">{likeCounter}</p>
    </div>
  );
}

function Dislike(props) {
  let card = props.card;

  const [dislikeClassName, setDislikeClassName] = useState(false);
  const [dislikeCounter, setDislikeCounter] = useState(function () {
    return parseInt(props.card.likes, 10);
  });

  useEffect(() => {
    setDislikeCounter(parseInt(props.card.dislikes, 10));
  }, [props.card.dislikes]);

  useEffect(() => {
    setDislikeCounter(parseInt(props.card.dislikes, 10));
  }, [props]);

  function updateDislikeDB() {
    var updates = {};
    updates["/Cards/" + card.id + "/dislikes"] = dislikeCounter + 1;
    firebase
      .database()
      .ref()
      .update(updates, function (error) {
        if (error) {
          return false;
        } else {

          setDislikeClassName(!dislikeClassName);
          setDislikeCounter(dislikeCounter + 1);
          return true;
        }
      });
  }

  return (
    <div className="dislike-container">
      <i
        className={
          dislikeClassName
            ? "fas fa-heart-broken dislike-icon dislike-icon-anim"
            : "fas fa-heart-broken dislike-icon"
        }
        onClick={updateDislikeDB}
        onAnimationEnd={() => setDislikeClassName(!dislikeClassName)}
      />
      <p id="dislikes" className="dislikes">
        {dislikeCounter}
      </p>
    </div>
  );
}