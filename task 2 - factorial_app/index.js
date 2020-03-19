const express = require("express");

const redis = require('redis');

const app = express();

const client = redis.createClient({
    host: 'redis-server', //hostname from docker-compose
    port: 6379
});

app.get("/:number", (req, res) => {
    console.log('New request');

    const value = req.params.number;

    if (value > 9) {
        process.exit(1);
    };

    client.get(value, (err, result) => {
        if (!result) {
            const result = GetFactorial(value);
            client.set(value, parseInt(result));
        }
        res.send('Integral from ' + value + ' is: ' + result);
    });
});

function GetFactorial(num) {
    var val = 1;
    for (var i = 2; i <= num; i++)
        val = val * i;
    return val;
}

app.listen(8080, () => {
    console.log("Server listening on port 8080")
});
