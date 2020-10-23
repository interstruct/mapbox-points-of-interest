import React, { useState } from "react";
import Map from "Map";
import Sidebar from "Sidebar";
import "App.css";

const PORTO_LNG = -8.6291;
const PORTO_LAT = 41.1579;
const ZOOM = 13;

const App = function() {
  const [sidebar, setSidebar] = useState({
    open: false,
    properties: {},
  });

  const [position, setPosition] = useState({
    center: [PORTO_LNG, PORTO_LAT],
    zoom: ZOOM,
  });

  return (
    <div id="app">
      {sidebar.open && <Sidebar {...sidebar.properties} />}

      <Map
        sidebarOpen={sidebar.open}
        setSidebar={setSidebar}
        position={position}
        setPosition={setPosition}
      />
    </div>
  );
}

export default App;
