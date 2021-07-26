const { Resolver } = require('dns').promises;

const resolver = new Resolver();

resolver.setServers(['8.8.8.8', '4.4.4.4']);

/**
 * Print a stringified object to console
 * @param {Object} data - Any object which can be stringified
 */
const log = data => console.log(JSON.stringify(data));

/**
 * Resolve all the DNS records of a hostname 
 * @param {String} hostname A hostname
 * @returns {Object} Provides details after the resolver hostname proble is successful
 * @throws  {Object} Provides the reason why the resolver failed
 */
const resolve = hostname => resolver.resolveAny(hostname)
    .then((details) => ({ hostname, details, success: true }))
    .catch((err) => ({ hostname: err.hostname, error: { code: err.code, syscall: err.syscall }, success: false }));

/**
 * Performs bulk dns resolve on all hostnames from an array
 * @param {String[]} hostnames An array of hostnames
 * @param {function} f A function which is applied on a resolved Promise of a DNS resolve query
 */
const perform = hostnames => f => hostnames.reduce((promise, hostname) => promise.then(() => resolve(hostname).then(f)), Promise.all([]));

module.exports = { perform, log };
