import React from "react";

const Popup = ({ title, address, description, picture }) => (
  <div className="popup-content">
    <h2>{title}</h2>
    <p>{address}</p>
    <p>{description}</p>
    <img src={picture} alt={title} />
  </div>
);

export default Popup;
