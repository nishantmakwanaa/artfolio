import React from "react";
import "./floating-arrow.css";

export const FloatingArrow = () => {
  return (
    <button className="arrow-button">
      <div className="arrow-container">
        <div className="round">
          <i className="fa fa-angle-up arrow" />
          <i className="fa fa-angle-up arrow bottom-arrow" />
        </div>
      </div>
    </button>
  );
};