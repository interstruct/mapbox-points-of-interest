import React, { useState, useEffect } from "react";
import mapboxgl from 'mapbox-gl';

import "./Map.css"

const ACCESS_TOKEN = "pk.eyJ1IjoidGlja2xlbXluYXVzZWEiLCJhIjoiY2tjNjRmZjRrMG55OTJ2cml1am1wYm5wYiJ9.UdCvI7hHAUYEWdcmiwm78w";
const PORTO_LAT = 41.1579;
const PORTO_LNG = -8.6291;
const ZOOM = 13;

const Map = function() {
  let mapContainer;

  const [lat, setLat] = useState(PORTO_LAT);
  const [lng, setLng] = useState(PORTO_LNG);
  const [zoom, setZoom] = useState(ZOOM);

  useEffect(() => {
    mapboxgl.accessToken = ACCESS_TOKEN;
    ;
    const map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [lng, lat],
      zoom: zoom
    });

  });

  return (
    <div id="map" ref={(el) => mapContainer = el} />
  );
}

export default Map;
