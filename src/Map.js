import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from 'mapbox-gl';

import Popup from "Popup";
import "Map.scss"

import token from "token.json";
import points from "points.json";
import markers from "markers.json";

const PORTO_LNG = -8.6291;
const PORTO_LAT = 41.1579;
const ZOOM = 13;
const IS_MOVING_POLLING_INTERVAL = 50;

const flyTo = (map, coordinates) => {
  map.flyTo({
    center: coordinates,
  });

  return new Promise((resolve, _reject) => {
    const interval = setInterval(() => {
      if (!map.isMoving()) {
        resolve();
        return;
      }

      if (!map.isMoving()) {
        clearInterval(interval);
        resolve();
      }
    }, IS_MOVING_POLLING_INTERVAL);
  });
}

let loadMarkers = async (map, markers) => {
  return Promise.all(
    Object.entries(markers).map(([marker, filename]) =>
      new Promise((resolve, reject) => {
        map.loadImage(filename, (error, image) => {
          if (error) {
            reject(error);
            return;
          }

          map.addImage(marker, image);
          resolve();
        })
      })
    )
  )
};

const loadPoints = async (map, points) => {
  let popup = null;

  map.addSource("points", points)

  map.addLayer({
    id: "points",
    type: "symbol",
    source: "points",
    layout: {
      "icon-image": "{icon}",
      "icon-allow-overlap": true,
    },
  });

  map.on("click", (e) => {
    if (popup) {
      popup.remove();
      popup = null;
    }
  });

  map.on("move", (e) => {
    if (popup) {
      popup.remove();
      popup = null;
    }
  });

  map.on("click", "points", async (e) => {
    var coordinates = e.features[0].geometry.coordinates;
    var properties = e.features[0].properties;
    var id = properties.id;

    if (document.querySelector(`#popup-root-${id}`)) {
      return;
    }

    let popupComponent = <Popup {...properties} />;
    let popupOptions = {
      maxWidth: "none",
    };

    await flyTo(map, e.features[0].geometry.coordinates);

    popup = new mapboxgl.Popup(popupOptions)
      .setLngLat(coordinates)
      .setHTML(`<div id="popup-root-${id}" class="popup-root" />`)
      .addTo(map);

    ReactDOM.render(
      popupComponent,
      document.querySelector(`#popup-root-${id}`),
    );
  });

  map.on("mouseenter", "points", function() {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "points", function() {
    map.getCanvas().style.cursor = "";
  });
};


const Map = function() {
  /* eslint-disable no-unused-vars */
  const [lng, setLng] = useState(PORTO_LNG);
  const [lat, setLat] = useState(PORTO_LAT);
  const [zoom, setZoom] = useState(ZOOM);
  /* eslint-enable no-unused-vars */

  let mapContainer;

  useEffect(() => {
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
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

    map.on("load", async () => {
      await loadMarkers(map, markers);
      await loadPoints(map, points);
    });
  });

  return (
    <div id="map" ref={(el) => mapContainer = el} />
  );
}

export default Map;
