import React, { useState, useEffect } from "react";
import mapboxgl from 'mapbox-gl';

import "Map.scss"
import points from "points.json";
import token from "token.json";

const PORTO_LNG = -8.6291;
const PORTO_LAT = 41.1579;
const ZOOM = 13;

const Map = function() {
  const [lng, setLng] = useState(PORTO_LNG);
  const [lat, setLat] = useState(PORTO_LAT);
  const [zoom, setZoom] = useState(ZOOM);

  let mapContainer;

  useEffect(() => {
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [lng, lat],
      zoom: zoom
    });

    map.on("load", function() {
      map.addSource("points", points);

      map.addLayer({
        id: "points",
        type: "symbol",
        source: "points",
        layout: {
          "icon-image": "{icon}-15",
          "icon-allow-overlap": true
        },
      });
    });

    map.on("click", "points", function(e) {
      var coordinates = e.features[0].geometry.coordinates.slice();
      var description = e.features[0].properties.description;

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
      });

      map.on("mouseenter", "points", function() {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "points", function() {
        map.getCanvas().style.cursor = "";
      });
  });

  return (
    <div id="map" ref={(el) => mapContainer = el} />
  );
}

export default Map;