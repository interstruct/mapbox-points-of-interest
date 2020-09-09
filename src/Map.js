import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from 'mapbox-gl';

import Popup from "Popup";
import "Map.scss"
import points from "points.json";
import token from "token.json";

const PORTO_LNG = -8.6291;
const PORTO_LAT = 41.1579;
const ZOOM = 13;

const Map = function() {
  /* eslint-disable no-unused-vars */
  const [lng, setLng] = useState(PORTO_LNG);
  const [lat, setLat] = useState(PORTO_LAT);
  const [zoom, setZoom] = useState(ZOOM);
  /* eslint-enable no-unused-vars */

  const styles = {
    'satellite-v9': 'Satallite',
    'outdoors-v11': 'Outdoors',
    'streets-v11': 'Streets',
  };

  let mapContainer;
  let map;

  useEffect(() => {
    mapboxgl.accessToken = token;

    map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [lng, lat],
      zoom: zoom
    });

    // The navigation control is the 3 buttons on the bottom right of the map.
    // It allows to control zoom and orientation of the map using buttons instead of a mouse.
    // It's usefull to more easly control the map in mobile mode.
    map.addControl(
      new mapboxgl.NavigationControl(),
      'bottom-right',
    );

    // This control displays the ratio of a distance on the map to the corresponding distance on the ground.
    map.addControl(new mapboxgl.ScaleControl());

    // Adds a fullscreen button to the map.
    map.addControl(new mapboxgl.FullscreenControl());

    map.on("style.load", function() {
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
      var coordinates = e.features[0].geometry.coordinates;
      var properties = e.features[0].properties;
      var id = properties.id;

      if (document.querySelector(`#popup-root-${id}`)) {
        return;
      }

      let popupComponent = <Popup {...properties} />;

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<div id="popup-root-${id}" />`)
        .addTo(map);

      ReactDOM.render(
        popupComponent,
        document.querySelector(`#popup-root-${id}`),
      );

      map.flyTo({
        center: e.features[0].geometry.coordinates,
      });
    });

    map.on("mouseenter", "points", function() {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "points", function() {
      map.getCanvas().style.cursor = "";
    });
  });

  const toggleStyle = (style) => (e) => {
    if (!map) return;

    console.log(style);
    map.setStyle('mapbox://styles/mapbox/' + style);
  }

  return (
    <div id="map" ref={(el) => mapContainer = el}>
      <div id="menu">
        {Object.entries(styles).map(([style, label]) => (
          <div key={label}>
            <button id={style} onClick={toggleStyle(style)} />
            <label htmlFor={style}>{label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Map;
