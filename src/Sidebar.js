import React from "react";

import "Sidebar.scss";

const Sidebar = ({ title, address, description, picture }) => (
  <div id="sidebar" className="sidebar-content">
    <h2>{title}</h2>
    <p>{address}</p>
    <p>{description}</p>
    <img src={picture} alt={title} />
  </div>
);

export default Sidebar;
