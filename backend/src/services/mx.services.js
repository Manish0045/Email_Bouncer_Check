const { Resolver } = require("dns").promises;

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "8.8.4.4"]); // Google DNS for consistent results

const hasMX = async (domain) => {
    try {
        const mxRecords = await resolver.resolveMx(domain);
        if (mxRecords.length > 0) return true;
    } catch (err) {
        // MX not found, try A/AAAA records
    }

    try {
        const aRecords = await resolver.resolve(domain); // A records
        if (aRecords.length > 0) return true;
    } catch (err) {
        try {
            const aaaaRecords = await resolver.resolve6(domain); // AAAA records
            if (aaaaRecords.length > 0) return true;
        } catch (err) {
            return false; // no MX, no A/AAAA → undeliverable
        }
    }

    return false;
};

module.exports = hasMX;
