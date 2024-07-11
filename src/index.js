import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import Starrating from "./Starrating";

function Test() {
  const [state,setstate] = useState(0)
  return <div>
    <Starrating color="blue" maxrating={10} setstate={setstate}/>
    <p>This movie was rated {state} stars</p>
  </div>;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <Starrating
      maxrating={5}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <Starrating maxrating={5} defaultrating={3} size={24} />
    <Test/> */}
    <App/>
  </React.StrictMode>
);
