const express = require('express');
const app = express();
require('express-ws')(app);
const config = require('./config');
const port = config.application.port;
const dns = require('./lib/services/dns/dns.service');

// TODO Remove when ready.
// This is used to get some hostnames to the sake of testing
const blacklist = require('mailchecker').blacklist();

app.ws('/', async (ws) => await dns.probe(blacklist)((results) => ws.send(JSON.stringify(results))));

app.listen(port, () => console.log(`App running on port ${port}`));