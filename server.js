const express = require('express');
const app = express();
const PORT = 3000;

// Serve static files (including /models)
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});