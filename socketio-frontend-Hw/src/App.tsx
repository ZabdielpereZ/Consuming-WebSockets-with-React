import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";
import { io } from "socket.io-client";
import MessageInput from "./components/MessageInput";
import ChatBody from "./components/ChatBody";

const socket = io("http://127.0.0.1:5000", { autoConnect: false });

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    socket.on("message", (message) => {
      setChat((prevChat) => [...prevChat, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", { username });
      if (response.data.username) {
        setMessage(response.data.message);
        setIsLoggedIn(true);
        handleConnect();
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleConnect = () => {
    socket.connect();
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    socket.disconnect();
    setIsConnected(false);
  };

  return (
    <Container>
      <h3>Connection Status: {isConnected ? "Connected" : "Not connected"}</h3>
      {!isLoggedIn ? (
        <Form onSubmit={handleLogin}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
          <Button type="submit">Login</Button>
        </Form>
      ) : (
        <>
          <ChatBody socket={socket} chat={chat} />
          <MessageInput socket={socket} username={username} />
          <Button onClick={handleDisconnect}>Disconnect</Button>
        </>
      )}
      {!isConnected && isLoggedIn && (
        <Button onClick={handleConnect}>Connect</Button>
      )}
    </Container>
  );
}

export default App;
