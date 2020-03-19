const express = require("express")

const app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get("/", (req, res) => {
    res.send("Hello world from node app");
})

app.listen(4000, () => { // choosen port
    console.log("Server listening on port 4000");
})
