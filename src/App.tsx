import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useT } from "./lib/i18n/useT";

function App() {
  const t = useT();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(`Learn React`)}
        </a>
      </header>
    </div>
  );
}

export default App;
