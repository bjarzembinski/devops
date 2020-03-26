const express = require("express");

const redis = require('redis');

const app = express();

//const process = require('process'); // require for crash - for tests only

const client = redis.createClient({
    host: 'redis-server', //hostname from docker-compose
    port: 6379
});

client.set('counter', 0);

app.get("/", (req, res) => {
    console.log('New request');
    //process.exit(0); // crash - for tests only

    client.get('counter', (err, counter) => {
        res.send('counter: ' + counter);
        client.set('counter', parseInt(counter) + 1);
    });
});

app.listen(8080, () => {
    console.log("Server listening on port 8080")
});
