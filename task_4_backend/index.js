const keys = require('./keys');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

var gcd = (a, b) => {
    var q;
    while (b) {
        q = a;
        a = b;
        b = q % b;
    }
    return a;
}

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
});

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => console.log('No connection to PG DB'));

pgClient.query('CREATE TABLE IF NOT EXISTS results(number INT)').catch(err => console.log(err));

console.log(keys); // easiest way of debugging

app.get('/', (req, resp) => {
    resp.send('Hello from backend!');
});

app.get('/:num1/:num2', (req, resp) => {
    console.log('New request');

    const value1 = req.params.num1;
    const value2 = req.params.num2;

    redisClient.get((value1, value2), (err, cachedResult) => {
        if (!cachedResult) {
            const result = gcd(value1, value2);
            redisClient.set((value1, value2), parseInt(result));
            resp.send('Greatest common divisor ' + value1 + ' and ' + value2 + ' is ' + result);

            pgClient.query('INSERT INTO results(number) VALUES($1)', [result], (err, res) => {
                if (err) {
                    console.log(err);
                };
            })
        }
        else {
            resp.send('Greatest common divisor ' + value1 + ' and ' + value2 + ' is ' + cachedResult);
        };
    });
});

app.get('/gcd_list', (req, resp) => {
    pgClient.query('SELECT * FROM results', (err, res) => {
        if (err) {
            console.log(err);
        }
        else {
            resp.send(res.rows);
        };
    })
});

app.listen(8080, err => {
    console.log('Server listening on port 8080');
});
