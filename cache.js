// fetch interval
// cache

'use strict';

const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 20, checkperiod: 5});
const Promise = require('bluebird');
const kefir = require('kefir');
const utils = require('./utils');
const  _ = require('lodash');
const recursive = require('./visitors/recursive');
const getEntityByLabel = recursive.getEntityByLabel;
const printEntities = utils.printEntities;


const getFromCache = Promise.promisify(myCache.get, { context: myCache });
const setToCache = Promise.promisify(myCache.set, { context: myCache });

myCache.on('expired', (key) => { 
    console.log(`oleg1 key ${key} has expired, consider get more `);
});
myCache.on('del', (key) => {
    console.log(`[${new Date()}] key ${key} has expired, consider get more `);
});
myCache.on( "set", (key) => {
    console.log(` ${new Date()} key ${key} has set`);
});

const getEntities = ({ clusterInfo = 'local', namespace, labelSelector, kinds = ['service',
    'pod', 'deployment'] }) => {
    const cacheKey = `${namespace + "_" + clusterInfo.name + "_" +  labelSelector}`;
    console.log(`cache key =  ${cacheKey}`);
    return getFromCache(cacheKey)
    .then((k) => {
        if (_.isUndefined(k)) {
            console.log(`${new Date()} -no cache for key ${cacheKey} wtih a result ${k}`);
            return getEntityByLabel({ clusterInfo,  labelSelector,
                kinds })
           .then((entities) => {
               console.log(`setting cache for key ${cacheKey}`);
               setToCache(cacheKey, entities);
               return entities;
           });

        } else        {
            console.log('feting from cache...');
            console.log(`[${new Date()}-${JSON.stringify(k)}`);
            return k; 
}
    }
    , () => {
        console.log('error !');
        return value;
    });
};

const test = () => {

    const stream = kefir.interval(1000, 'run=test')
    .flatMap((labelSelector) => {
        return  kefir.fromPromise(getEntities({ labelSelector }));
    }).map((r) => {
        _.forEach(r, (v, k) => {
            console.log(`cached result num of ${JSON.stringify(k)} is ${_.size(v)}`);
        });

    });

    stream.onValue(_.noop);
};


module.exports.getEntities = getEntities;
