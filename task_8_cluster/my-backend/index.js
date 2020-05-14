const keys = require('./keys');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => {
    console.log('No connection to PG DB.');
});

pgClient.query('CREATE TABLE IF NOT EXISTS results(number INT)').catch(err => {
    console.log(err);
});

const appId = uuidv4();

console.log(keys);

app.get('/', (req, resp) => {
    resp.send(`[${appId}] ${keys.initMessage}`);
});

app.post('/max', (req, resp) => {
    const values = req.body.values;
    const parsedValues = values.join(','); //parsed values allow get max value from cache

    redisClient.get(parsedValues, (err, cachedValue) => {
        if (!cachedValue) {
            const max = Math.max(...values);
            redisClient.set(parsedValues, max);
            resp.json({ max: max });

            pgClient.query('INSERT INTO results(number) VALUES($1)', [max], (err, resp) => {
                if (err) {
                    console.log(err);
                };
            })
        }
        else {
            resp.json({ max: cachedValue });
        };
    });
});

app.listen(4000, err => {
    console.log('Server listening on port 4000');	
});
