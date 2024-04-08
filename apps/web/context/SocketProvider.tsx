"use client";

import React, { FC, ReactNode, createContext, useCallback, useEffect, useState } from "react";
import { useContext } from "react";
import { Socket , io} from "socket.io-client";

export const SocketContext = createContext<ISocketContext|null>(null);

interface ISocketContext {
    sendMessage : (msg:string) => any;
    messages : string[];
}

interface ISocketProps {
    children? : ReactNode;
}

export const SocketProvider:FC<ISocketProps> = ({children}) => {
    const [messages,setMessages] = useState<string []>([]);
    const [socket, setSocket] = useState<Socket>();

    const sendMessage: ISocketContext["sendMessage"] = useCallback(
        (msg) => {
          console.log("Send Message", msg);
          if (socket) {
            socket.emit("event:message", { message: msg });
          }
        },
        [socket]
      );

      const onMessageRec = useCallback((msg: string) => {
        console.log("Received message from server:", msg);
        try {
            const { message } = JSON.parse(msg) as { message: string };
            console.log("Parsed message:", message);
            setMessages((prevMessages) => [...prevMessages, message]);
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    }, []);


    useEffect(()=> {
        const _socket = io("http://localhost:8000");
        _socket.on("message", onMessageRec);

        setSocket(_socket);

        return () => {
        _socket.off("message", onMessageRec);
        _socket.disconnect();
        setSocket(undefined);
        };
    },[])

    return (
        <SocketContext.Provider value={{ sendMessage, messages }}>
          {children}
        </SocketContext.Provider>
      );
}