const connections = [];

onconnect = (e) => {
  const port = e.ports[0];
  connections.push(port);

  port.onmessage = (e) => {
    connections.forEach((connection) => {
      if (connection === port) return;
      connection.postMessage(e.data);
    });
  };
};
