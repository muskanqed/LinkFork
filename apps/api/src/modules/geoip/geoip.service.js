const ipaddr = require("ipaddr.js");

const lookupLocation = async (ipAddress) => {
    try {
        if (!ipAddress) {
            return {};
        }

        const address = ipaddr.process(ipAddress);

        // Only look up public, routable IP addresses.
        if (address.range() !== "unicast") {
            return {};
        }

        const response = await fetch(
            `https://ipwho.is/${encodeURIComponent(address.toString())}`,
            { signal: AbortSignal.timeout(2000) }
        );

        if (!response.ok) {
            return {};
        }

        const result = await response.json();

        if (!result.success) {
            return {};
        }

        return {
            country: result.country || null,
            countryCode: result.country_code || null,
            region: result.region || null,
            city: result.city || null
        };
    } catch (error) {
        return {};
    }
};

module.exports = { lookupLocation };