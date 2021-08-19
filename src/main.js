#!/usr/bin/env node

const yargs = require("yargs");
const axios = require("axios");
const flatCache = require('flat-cache')


function get_single_data(url) {
    return new Promise((resolve, reject) => {
        const b64name = Buffer.from(url).toString("base64");
        const cache = flatCache.create(b64name);
        const items = cache.all();
        if (Object.keys(items).length === 0) {
            axios.get(url)
                .then(res => {
                    cache.setKey('total', res.data.total);
                    cache.setKey('items', res.data.items);
                    cache.save();
                    resolve(cache.all());
                }).catch(reason => reject(reason));
        } else {
            resolve(items);
        }
    });
}

function get_data(limit = 10, filter) {
    return get_single_data(`https://static-api.prod.bonusway.com/api/16/campaigns_limit_${limit}_offset_0_order_popularity.json`)
        .then(res => {
            const data = [];
            const first_array = res.items.filter(filter);
            for (let offset = limit; offset < res.total; offset += limit) {
                data.push(
                    get_single_data(
                        `https://static-api.prod.bonusway.com/api/16/campaigns_limit_${limit}_offset_${offset}_order_popularity.json`
                    ).then(res => res.items.filter(filter))
                );
            }
            return Promise.all(data).then(results => first_array.concat(...results));
        });
}

function main() {
    const options = yargs
        .usage("Usage: -a <amount>")
        .option("a", {alias: "amount", describe: "Filter out commissions lower or equal to this number" , type: "float", default: 2.25})
        .option("f", {alias: "force", describe: "Clear the cache and redownload from the api" , type: "boolean"})
        .argv;

    if (options.force) {
        flatCache.clearAll()
    }

    get_data(10, e => (e.commission.max.unit === "%" && e.commission.max.amount > options.amount))
        .then(results => {
            console.log(results.sort((e1, e2) => e1.title.toLowerCase() < e2.title.toLowerCase() ? -1 : 1).map(e => e.title).join("\n"));
        }).catch(e => console.log(e));
}

module.exports.get_data = get_data
module.exports.main = main