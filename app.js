const express = require('express');
const app = express();
const port = 5000;
const dns = require('./lib/services/dns/dns.service');
const { constraints } = require('./lib/config/dns.config');

// TODO Remove when ready.
// This is used to get some hostnames to the sake of testing
const blacklist = require('mailchecker').blacklist();

const applyConstraints = (details, constraints) => filterKeys.every(key => {
    return constraints[key](detail[key]);
});

// var filtered = [1, 2, 3, 4].filter(
//     function(e) {
//       return this.indexOf(e) < 0;
//     },
//     [2, 4]
// );

const doSomething = (results) => {
    if (typeof results.details !== 'undefined') {
        const x = applyConstraints(results.details, constraints);
        // console.log(JSON.stringify(x));
    }
};

const run = async () => await dns.probe(blacklist)(doSomething);

run();

app.listen(port, () => console.log(`App running on port ${port}`));