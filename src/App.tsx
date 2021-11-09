import React, { useState } from "react";

import Header from "./components/Header/Header";
import Map from "./components/Map/Map";

function App() {
  const [clickDistances, setClickDistances] = useState(false)
  const [clickCPUProcess, setClickCPUProcess] = useState(false)

  const clickOnCPU = () => {
    setClickDistances(false)
    setClickCPUProcess(true)
  }

  const clickOnDistance = () => {
    setClickCPUProcess(false)
    setClickDistances(true)
  }

  
  return (
    <>
      <nav>
        <Header clickOnCPUProcess={() => clickOnCPU()} clickOnDistance={clickOnDistance} />
      </nav>
      <main>
        <Map distances={clickDistances} cpu={clickCPUProcess} />
      </main>
    </>
  );
}

export default App;
