import React, { useState } from "react";
import PropTypes from "prop-types";

const containerstyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const starcontainerstyle = {
  display: "flex",
  marginLeft:"2rem"
};

Starrating.prototype = {
  maxrating: PropTypes.number,
  size: PropTypes.number,
  color: PropTypes.string,
  defaultrating: PropTypes.number,
  messages: PropTypes.array,
  // setstate: PropTypes.func,
};

function Starrating({
  maxrating = 5,
  color = "#fcc419",
  size = 48,
  messages = [],
  defaultrating = 0,
  setstar,
}) {
  const [rating, setrating] = useState(defaultrating);
  const [temp, settemp] = useState(0);
  const textstyle = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size / 1.5}px`,
  };
  return (
    <div style={containerstyle}>
      <div style={starcontainerstyle}>
        {Array.from({ length: maxrating }, (_, i) => (
          <Star
            settemp={settemp}
            key={i}
            index={i + 1}
            full={temp ? temp >= i + 1 : rating >= i + 1}
            setrating={(val) => {
              setrating(val);
              setstar(val);
            }}
            size={size}
            color={color}
          />
        ))}
      </div>
      <p style={textstyle}>
        {messages.length === maxrating
          ? messages[temp - 1] || messages[rating - 1]
          : temp || rating || ""}
      </p>
    </div>
  );
}

function Star({ index, full, settemp, setrating, color, size }) {
  function set() {
    setrating(index);
  }
  const starstyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: "block",
    cursor: "pointer",
  };
  return (
    <span
      onMouseEnter={() => {
        settemp(index);
      }}
      onMouseLeave={() => {
        settemp(0);
      }}
      onClick={set}
      role="button"
      style={starstyle}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}

export default Starrating;
