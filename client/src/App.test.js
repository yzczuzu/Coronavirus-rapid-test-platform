import React from "react";
import App from './App';
import ReactDOM from "react-dom";

it("renders without crashingg", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
