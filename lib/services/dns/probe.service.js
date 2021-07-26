const { concurrentTasks, nameservers } = require('../../../config').probe.resolve;
const { Resolver } = require('dns').promises;
const PromisePool = require('@supercharge/promise-pool');

const resolver = new Resolver();

resolver.setServers(nameservers);

const defaultConcurrency = 2;

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
 * @returns Promise<{ results, errors }>
 */
const perform = hostnames => f => {
    const concurrency = (typeof concurrentTasks === 'number' && concurrentTasks > 0) ? concurrentTasks : defaultConcurrency;
    console.log(`Starting processing servers with concurrency set at ${concurrency} ...`);
    return PromisePool.withConcurrency(concurrency).for(hostnames).process((hostname) => resolve(hostname).then(f));
};

module.exports = { perform };
