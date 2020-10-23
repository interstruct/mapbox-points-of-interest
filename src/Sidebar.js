import React from "react";

import "Sidebar.scss";

const Sidebar = ({ title, address, description, picture }) => (
  <div id="sidebar" className="sidebar-content">
    <h2>{title}</h2>
    <span>{address}</span>
    <img src={picture} alt={title} />
    <p>{description}</p>
  </div>
);

export default Sidebar;
