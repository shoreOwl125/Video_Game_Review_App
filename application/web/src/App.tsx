import React, { useState } from 'react'; // Combine the import statements
import './styles.css'; // Ensure this path is correct

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AboutUs from "./AboutUs";
import AndrewDahlstrom from "./individual-pages/AndrewDahlstrom";
import JasonAvina from "./individual-pages/JasonAvina";
import JoyceFu from "./individual-pages/JoyceFu";
import NadirAli from "./individual-pages/NadirAli";
import KaylaMaa from "./individual-pages/KaylaMaa";
import AidanBayerCalvert from "./individual-pages/AidanBayerCalvert";
import RyanFlannery from "./individual-pages/RyanFlannery";
import { ComponentProps } from "react"; // Moved up to the top
import { ModeToggle } from "./components/mode-toggle";
import { useTheme } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { cn } from "./lib/utils";
import SearchPage from "./components/SearchPage"; // Adjust based on your directory

// The CodeText component should be defined after all imports
const CodeText = (props: ComponentProps<"span">) => {
  return (
    <span
      {...props}
      className={cn(
        props.className,
        "bg-muted text-muted-foreground rounded font-mono text-sm p-1"
      )}
    />
  );
};

function App() {
  return (
    <div className="App">
      <SearchPage />
    </div>
  );
}

/*
Uncomment this block for the routing functionality
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
*/

export default App;
