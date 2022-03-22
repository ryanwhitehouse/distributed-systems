import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT1 = "http://localhost:8000";
const ENDPOINT2 = "http://localhost:8001";

function App() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket1 = socketIOClient(ENDPOINT1);
    socket1.on('message-from-server-to-client', data => {
      setResponse(data);
    });

    socket1.on('connection', () => {
      console.log(`I'm connected with the main server`);

      socket1.emit('message-from-client-to-server', 'Hello from the client!');
    });

    const socket2 = socketIOClient(ENDPOINT2);
    socket2.on('message-from-failover-to-client', data => {
      setResponse(data);
    });

    socket2.on('connection', () => {
      console.log(`I'm connected with the failover`);

      socket2.emit('message-from-client-to-server', 'Hello from the client!');
    });
  }, []);

  if (!response) return null

  return (
    <p>
      Current count: {response.count}
      <br />
      Node: {response.nodeID}
      <br />
      App ID: {response.appID}
    </p>
  );
}

export default App;