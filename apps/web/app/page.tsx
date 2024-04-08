"use client";
import { useState, useContext ,useEffect} from "react";
import { SocketContext } from "../context/SocketProvider";
import classes from "./page.module.css";



export default function App() {
  const state = useContext(SocketContext);
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("Messages:", state?.messages);
  }, [state?.messages]);

  // Log any changes in state
  useEffect(() => {
    console.log("State:", state);
  }, [state]);

  if (!state) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div>
        <input
        className={classes["chat-input"]}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="message"
        ></input>
      </div>
      <div>
        <button className={classes["button"]} onClick={(e) => state?.sendMessage(message)}>Send</button>
      </div>
      <div>
        {state?.messages.map((e) => (
          <li>{e}</li>
        ))}
      </div>
      </>
  );
}
