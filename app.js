const express = require('express');
const app = express();
require('express-ws')(app);
const port = 5000;
const dnsProbe = require('./lib/services/dns/probe.service')

// TODO Remove when ready.
// This is used to get some hostnames to the sake of testing
const blacklist = require('mailchecker').blacklist();

app.ws('/', (ws) => dnsProbe.perform(blacklist)((message) => ws.send(JSON.stringify(message))));

app.listen(port, () => console.log(`App running on port ${port}`));