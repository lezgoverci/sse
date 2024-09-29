const express = require('express');
const app = express();
const PORT = 3000;

// SSE endpoint
app.get('/events', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // Send the headers to establish SSE connection

  // Send initial message
  res.write(`data: ${JSON.stringify({ message: 'SSE connection established' })}\n\n`);

  // Send a message every 2 seconds
  const intervalId = setInterval(() => {
    const data = { message: 'Hello from SSE!', timestamp: new Date().toISOString() };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 2000);

  // If the client closes the connection, stop the interval
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send(`
    <h1>SSE Example</h1>
    <ul id="messages"></ul>
    <script>
      const evtSource = new EventSource('/events');
      evtSource.onmessage = function(event) {
        const newElement = document.createElement('li');
        newElement.textContent = event.data;
        document.getElementById('messages').appendChild(newElement);
      };
    </script>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
