import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import geoJson from "./json/coffee_all.json";

mapboxgl.accessToken = 'pk.eyJ1IjoieWl3ZW5tYXBib3giLCJhIjoiY2t2Y21kOGNhMGJrYTJ1bzJ3a3poMHp4eSJ9.ukeYdyBSNOQIa5bZSQ9raw';

export default function App() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-73.9840);
    const [lat, setLat] = useState(40.7549);
    const [zoom, setZoom] = useState(12);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/yiwenmapbox/clc3vrcdy001615qsvyh495xn',
            center: [lng, lat],
            zoom: zoom
        });
    });

    map.on("load", () => {
        // Add an image to use as a custom marker
        map.loadImage(
          "https://yiwenche.github.io/mapbox/src/img/solid-triangle-s.png",
          (error, image) => {
            if (error) throw error;
            map.addImage("solid-triangle", image);
            // Add a GeoJSON source with multiple points
            map.addSource("NPBD", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: geoJson.features,
              },
            });
            // Add a symbol layer
            map.addLayer({
              id: "points",
              type: "symbol",
              source: "NPBD",
              layout: {
                "icon-image": "solid-triangle",
                // get the title name from the source's "title" property
                "text-field": ["get", "PARKNAME"],
                "text-font": ["Roboto Condensed", "Arial Unicode MS Bold"],
                "text-offset": [0, 0.85],
                "text-anchor": "top",
                "text-size": 14,
                "icon-size": 0.3
              },
              paint: {
                "text-color": "#B86B77"
              }
            });
            // Add a fill layer
            map.addLayer({
              id: "fills",
              type: "fill",
              source: "NPBD",
              layout: {
              },
              paint: {
                "fill-color": "#B86B77",
                "fill-opacity": 0.2,
              }
            });
          }
        );
    })

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}