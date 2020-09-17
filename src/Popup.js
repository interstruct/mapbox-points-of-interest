import React from "react";
import "Popup.scss";

const Popup = ({ title, address, description, picture }) => (
  <div className="popup-content">
    <div className="popup-content-header">
      <h1>{title}</h1>
      <h2>{address}</h2>
    </div>

    <div className="popup-content-container">
      <div className="popup-content-container-left">
        <img src={picture} alt={title} />
      </div>

      <div className="popup-content-container-right">
        <p>{description}</p>
      </div>
    </div>
  </div>
);

export default Popup;
