const _ = require('lodash');
const utils = require('../utils')

describe('visitors test', () => {
    it.only('rescursive', (done) => {
        const recursive = require('./recursive');
        const getK8sentities = recursive.getKubeEntities;
        const getEntityByLabel = recursive.getEntityByLabel;
        const printEntities = utils.printEntities;
        getEntityByLabel({ labelSelector: 'run=test', kinds:["service",
         "pod", "deployment"] })
        .then((entities)=>{
            _.chain(entities)
            .values().forEach((v)=>{
                let f = printEntities (v)
                console.log(f);
                return f;
             }).forEach(console.log).value();
             done();
        }
            , done);

    });
    it.skip('labels', () => {
        debugger;
        const labelsToString = require('../utils').labelsToString;
        console.log(labelsToString({ selector: { 'app': 'demo', 'release': 'bbbb8' } }));
    });
});
