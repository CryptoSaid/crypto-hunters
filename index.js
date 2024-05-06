const express = require("express");
const circulatingSupply = require("./routes/circulating-supply");

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/circulating-supply", circulatingSupply);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
