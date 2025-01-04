import React, { useState, useEffect } from "react";
import { ArtGallery } from "./Gallery";

export default function App() {
  const { width } = useWindowDimensions();

  const appStyle = {
    textAlign: "center",
    fontFamily: "Calibri",
    listStyle: "none"
  };

  return (
    <div className="App" style={appStyle}>
      <ArtGallery windowWidth={width} />
    </div>
  );
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}