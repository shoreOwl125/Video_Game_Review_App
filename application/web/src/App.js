import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutUs from './AboutUs';
import AndrewDahlstrom from './individual-pages/AndrewDahlstrom';
import JasonAvina from './individual-pages/JasonAvina';
import JoyceFu from './individual-pages/JoyceFu';
import NadirAli from './individual-pages/NadirAli';
import KaylaMaa from './individual-pages/KaylaMaa';
import AidanBayerCalvert from './individual-pages/AidanBayerCalvert';
import RyanFlannery from './individual-pages/RyanFlannery';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AboutUs />} />
          <Route path="/team/andrew-dahlstrom" element={<AndrewDahlstrom />} />
          <Route path="/team/jason-avina" element={<JasonAvina />} />
          <Route path="/team/joyce-fu" element={<JoyceFu />} />
          <Route path="/team/nadir-ali" element={<NadirAli />} />
          <Route path="/team/kayla-maa" element={<KaylaMaa />} />
          <Route path="/team/aidan-bayer-calvert" element={<AidanBayerCalvert />} />
          <Route path="/team/ryan-flannery" element={<RyanFlannery />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
