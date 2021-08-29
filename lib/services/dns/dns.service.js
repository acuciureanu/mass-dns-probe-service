const {concurrency, nameservers} = require('../../config/dns.config');
const resolve = Symbol('resolve');
const { Resolver } = require('dns').promises;
const resolver = new Resolver();
const PromisePool = require('@supercharge/promise-pool');

class DnsService {

    constructor() {
        if (typeof concurrency === 'number' && concurrency > 0)
            this.concurrency = concurrency;
        else
            console.error('Please check if the DNS probing concurrency is configured properly.');

        if (Array.isArray(nameservers) && nameservers.length > 0)
            this.nameservers = nameservers;
        else
            console.error('Please check if the nameservers are configured properly.')

        this.resolver = resolver;
        this.resolver.setServers(this.nameservers);
    }

    /**
     * Resolve all the DNS records of a hostname 
     * @param {String} hostname A hostname
     * @returns {Object} Provides details after the resolver hostname proble is successful
     * @throws  {Object} Provides the reason why the resolver failed
     */
    [resolve] = hostname => this.resolver.resolveAny(hostname)
        .then((details) => ({ hostname, details, success: true }))
        .catch((err) => ({ hostname: err.hostname, error: { code: err.code, syscall: err.syscall }, success: false }));

    /**
    * Performs bulk dns resolve on all hostnames from an array
    * @param {String[]} hostnames An array of hostnames
    * @param {function} f A function which is applied on a resolved Promise of a DNS resolve query
    * @returns Promise<{ results, errors }>
    */
    probe = hostnames => fn => PromisePool.withConcurrency(this.concurrency).for(hostnames).process((hostname) => this[resolve](hostname).then(fn));
};

module.exports = new DnsService();