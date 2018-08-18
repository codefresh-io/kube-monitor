const express       = require('express');
const app           = express();
const _             = require('lodash');
const Cache         = require('./cache');
const utils         =  require('./utils')
const morgan        =  require('morgan')

let EntityManager;
app.use(morgan());
app.get('/', (req, res) => res.send(200));
app.get('/kube', (req, res) => res.send(200));
app.get('/kube/clusters/:clusters/entities', (req, res) => {
    console.log('app.get /k8s/clusters/:clusters/entities: ${req.')
  
    let clusters = _.get(req, 'params.clusters', ['local']);
    const labelSelector = _.get(req, 'query.selector', {});
    const namespace = _.get(req, 'query.namespace', 'default');
    const cache = _.get(req, "query.cache", false);
    let kinds = _.chain(req).get('query.kinds', ['pods']).value();
    console.log(`${JSON.stringify(labelSelector)},
     ${JSON.stringify(kinds)}`);

     console.log(`with cache ${cache}`, cache);

    if (!_.isArray(kinds)) {
        kinds = ((k) => {
                return k.split(',');
            })(kinds);
    }
    (!_.isArray(clusters)) ? (clusters = [clusters]) : clusters;

    console.log(`labelSelector=  ${JSON.stringify(labelSelector)}, kinds = ${JSON.stringify(kinds)}`);
    
    (!!cache)? Cache.getEntities({ clusters, labelSelector, namespace, kinds })
    .then(printEntities)
    .then(res.send.bind(res))
    : EntityManager
        .getEntityByLabel({ clusters, labelSelector, namespace, kinds })
        .then(printEntities)
        .then(res.send.bind(res));
});
const printEntities = (entities)=>{
    _.chain(entities)
    .values()
    .forEach((e) => {
        const result = utils.printEntities(e);
        console.log(result);
    }).value();

  return entities
}
app.listen(8888, (err) => {
    
    console.log('connected');
});

const client = require('./config').init().then((client)=>{
     EntityManager = require('./visitors/recursive');
     EntityManager.getEntityByLabel({ labelSelector:"app=demo",
      kinds : ["pod", "deploy", "service"] })
        .then(()=>{
         console.log('was able to connect to K8s')
        });
}, ()=>{

}).catch((e)=>{
   // EntityManager = require('./visitors/recursive');
})

