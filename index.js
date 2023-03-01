const express = require("express");
const bodyParser = require("body-parser")

const aboutRouter = require("./routes/about");
const eventRouter = require("./routes/event");
const mempoolRouter = require("./routes/mempool");
const pauseRouter = require("./routes/pause");

const PORT = 3000;
const HOST_NAME = "localhost";

const app = express();
app.use(express.static("client"));
app.use(bodyParser.urlencoded({extended: true}));

app.use("/event", eventRouter);
app.use("/about", aboutRouter);
app.use("/mempool", mempoolRouter);
app.use("/pause", pauseRouter);

app.listen(PORT, HOST_NAME, ()=> {
    console.log(`Server running at ${HOST_NAME}:${PORT}`)
})
