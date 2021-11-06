import React from "react";
import "./App.css";

import Header from "./components/Header/Header";
import Map from "./components/Map/Map";

function App() {
  return (
    <>
      <nav>
        <Header />
      </nav>
      <main>
        <Map />
      </main>
    </>
  );
}

export default App;
