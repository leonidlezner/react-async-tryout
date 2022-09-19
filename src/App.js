import axios, { CanceledError } from "axios";
import { useEffect, useState, useRef } from "react";
import JokeGenerator from "./JokeGenerator";

export default function App() {
  const [language, setLanguage] = useState("en");
  const [visible, setVisible] = useState(true);

  function handleSelect(event) {
    setLanguage(event.target.value);
  }

  return (
    <div className="App p-10">
      {visible && <JokeGenerator language={language} />}
      <br />
      <form>
        <select onChange={handleSelect} value={language}>
          <option value="de">Deutsch</option>
          <option value="en">English</option>
        </select>
      </form>
      <br />
      <button
        className="border bg-gray-200 p-1"
        onClick={() => setVisible((prevVisible) => !prevVisible)}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
