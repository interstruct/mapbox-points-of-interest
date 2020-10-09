import React, { useState, useEffect } from "react";
import mapboxgl from 'mapbox-gl';
import cx from "classnames"

import "Map.scss"

import token from "token.json";
import points from "points.json";
import markers from "markers.json";

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

const loadPoints = (map, points) => {
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
};

const Map = function({ sidebarOpen, setSidebar, position, setPosition }) {
  let mapContainer;

  const [map, setMap] = useState(null);

  const onMapClick = (event) => {
    map.on("click", function(event) {
      if (event.defaultPrevented) { return; }

      setSidebar({
        open: false,
        properties: {},
      });

      if (window.previousPosition) {
        setPosition(window.previousPosition);
        window.previousPosition = null;
      }
    });
  }

  const onPointClick = (event) => {
    event.preventDefault();

    setSidebar({
      open: true,
      properties: event.features[0].properties,
    })

    // using global variables? 🤷
    //
    // The value of the previous map position we are saving here is used inside the "on load" map event handler function. This function belongs to
    // a closure that will be lost on re-rendering of this Map component (since the function will run again), and therefore the new value of the
    // position will not be known inside the "on load" map event handler. The only solution I could think of for this was to keep the previous map
    // position in a closure outside this function (window object).
    if (!window.previousPosition) {
      window.previousPosition = {
        center: map.getCenter().toArray(),
        zoom: map.getZoom(),
      };
    }

    setPosition({
      center: event.features[0].geometry.coordinates,
      zoom: 16,
    });
  }
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    mapboxgl.accessToken = token;

    setMap(new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/satellite-v9",
      ...position,
    }));

  }, [setSidebar, mapContainer]);
  /* eslint-enable react-hooks/exhaustive-deps */

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!map) { return; }

    map.addControl(
      new mapboxgl.NavigationControl(),
      'bottom-right',
    );

    map.addControl(new mapboxgl.ScaleControl());

    map.addControl(new mapboxgl.FullscreenControl());

    map.on("load", async () => {
      await loadMarkers(map, markers);
      loadPoints(map, points, setSidebar, setPosition);

      map.on("click", "points", onPointClick);
      map.on("click", onMapClick);
    });
  }, [map, setSidebar, setPosition]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (!map) { return; }

    map.flyTo(position);
  }, [position, map]);

  useEffect(() => {
    if (!map) { return; }

    map.resize();
  }, [sidebarOpen, map]);

  return (
    <div
      id="map"
      className={cx({ "sidebar-open": sidebarOpen})}
      ref={(el) => mapContainer = el}
    />
  );
}

export default Map;
