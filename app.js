const express = require('express');
const router = require('./routes/routes.js');

const app = express();
app.use(express.json());
app.use('/tickets', router);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
