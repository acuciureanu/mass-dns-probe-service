const blacklist = require('mailchecker').blacklist();
const { Resolver } = require('dns').promises;

const resolver = new Resolver();

resolver.setServers(['8.8.8.8', '4.4.4.4']);

const print = data => console.log(JSON.stringify(data));

const probe = hostname => resolver.resolveAny(hostname)
    .then((details) => ({ hostname, details, success: true }))
    .catch((err) => ({ hostname: err.hostname, error: { code: err.code, syscall: err.syscall }, success: false }));

const run = hostnames => f => hostnames.reduce((promise, hostname) => promise.then(() => probe(hostname).then(f)), Promise.resolve([]));

run(blacklist)(print);
