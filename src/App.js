import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import "./App.css";

const App = ({ history }) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/${url}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => history.push(`/${Math.abs(Math.random())}`)}>
          create room
        </button>
        <button onClick={() => setOpen(true)}>join room</button>
        {open && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter room id"
              onChange={(e) => setUrl(e.target.value)}
            />
            <input type="submit" />
          </form>
        )}
      </header>
    </div>
  );
};

export default withRouter(App);
