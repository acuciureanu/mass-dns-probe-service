const blacklist = require('mailchecker').blacklist();
const { Resolver } = require('dns').promises;
const fs = require('fs');

const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '4.4.4.4']);

const outputFile = 'output.txt';

const probe = (domain) => resolver.resolveAny(domain).then(() => {
    console.log(`${domain} (OK)`)
    return domain;
}).catch((err) => console.error(`${domain} (FAIL) ${err.code}`));

const write = (content) => {
    if (typeof content !== 'undefined')
        fs.writeFile(outputFile, content + '\n', { flag: 'a+' }, () => { });
};

const run = (domains, f) => domains.reduce((p, domain) => {
    return p.then(() => probe(domain).then(f));
}, Promise.resolve([]));

run(blacklist, write);
