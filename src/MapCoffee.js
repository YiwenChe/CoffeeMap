import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import geoJson from "./json/coffee_all.json";
import "./MapCoffee.css";

mapboxgl.accessToken = 'pk.eyJ1IjoieWl3ZW5tYXBib3giLCJhIjoiY2t2Y21kOGNhMGJrYTJ1bzJ3a3poMHp4eSJ9.ukeYdyBSNOQIa5bZSQ9raw';

const MapCoffee = () => {
    const mapContainerRef = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-73.9840);
    const [lat, setLat] = useState(40.7549);
    const [zoom, setZoom] = useState(12);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/yiwenmapbox/clc3vrcdy001615qsvyh495xn",
            center: [lng, lat],
            zoom: [zoom],
        });

        map.current.on("load", () => {
            // Add an image to use as a custom marker
            map.current.loadImage(
                "https://yiwenche.github.io/CoffeeMap/src/img/house-icon-s.png",
                (error, image) => {
                    if (error) throw error;

                    // Add image as marker
                    map.current.addImage("house-s", image);

                    // Add source
                    map.current.addSource("coffeespots", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: geoJson.features,
                    },
                    });

                    // Add a symbol layer
                    map.current.addLayer({
                    id: "coffeespots",
                    type: "symbol",
                    source: "coffeespots",
                    layout: {
                        "icon-image": "house-s",
                        "text-field": ["get", "title"],
                        "text-font": ["Roboto Condensed", "Arial Unicode MS Bold"],
                        "text-offset": [0, 1.25],
                        "text-anchor": "top",
                        "text-size": 12,
                        "icon-size": 1
                    },
                    paint: {
                        "text-color": "#B86B77"
                    }
                    });
                }
            );
        })

        // When a click event occurs on a feature in the coffeespots layer, open a popup at the location of the feature, with description HTML from its properties.
        
        
        map.current.on('click', 'coffeespots', (e) => {
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;
            // Ensure that if the map is zoomed out such that multiple copies of the feature are visible, the popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
             
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map.current);
        });

        // Change the cursor to a pointer when the mouse is over the coffeespots layer.
        map.current.on('mouseenter', 'coffeespots', () => {
            map.current.getCanvas().style.cursor = 'pointer';
        });
            
        // Change it back to a pointer when it leaves.
        map.current.on('mouseleave', 'coffeespots', () => {
            map.current.getCanvas().style.cursor = '';
        });
    }, []);

    return (
        <div>
            <div ref={mapContainerRef} className="map-container" />
        </div>
    );
}

export default MapCoffee;