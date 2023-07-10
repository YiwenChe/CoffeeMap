import React from 'react';
import ReactDOM from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import MapCoffee from './MapCoffee';
import MainTitle from './MainTitle';
import Header from './Header';

ReactDOM.render(
  <React.StrictMode>
    <Header />
    <MainTitle />
    <MapCoffee />
  </React.StrictMode>,
  document.getElementById('root')
);
