const _               = require('lodash');
const utils           = require('../utils')
const timely          = require('timely');
const chalk           = require('chalk');
const Cache           = require('../cache');

describe('visitors test', async () => {
        let clusterInfo;

        const loadClusterInfo = async (path)=>{
        const _               = require('lodash');
        const fs              = require('fs');
 

        clusterInfo = JSON.parse(fs.readFileSync(__dirname + "/"  +  path), "");
        let cert = await _.chain(clusterInfo).omit(["url", "insecureSkipTlsVerify"])
        .mapValues((v)=>{
            return Buffer.from(v, "base64");
        }).value();
        
         _.assign(clusterInfo, cert)

        
        return clusterInfo
    }
   

    
    it.only('rescursive', async () => {
        

        const recursive = require('./recursive');
        const getK8sentities = recursive.getKubeEntities;
        const getEntityByLabel = recursive.getEntityByLabel;
        const printEntities = utils.printEntities;
        const cachedEntities = async (options)=>{
            await Cache.getEntities(options)
         }

       try{
        clusterInfo = await loadClusterInfo("../util/certAzure");
        getEnityByLabelWithTime = timely.promise(getEntityByLabel);
        getCachedEntitiesByTime1  = timely.promise(cachedEntities);
        getCachedEntitiesByTime2  = timely.promise(cachedEntities);
       // result = await getEnityByLabelWithTime({clusterInfo,  labelSelector: 'run=node', kinds:["service",
        /// "pod", "deployment"] }) 

        ///console.log(chalk.red(getEnityByLabelWithTime.time/1000));
        console.log('call no cache')
        result = await getCachedEntitiesByTime1({clusterInfo,  labelSelector: 'run=node', kinds:["service",
        "pod", "deployment"] }) 

        console.log(chalk.red(getCachedEntitiesByTime1.time/1000));

        console.log('call using cache')
        result = await getCachedEntitiesByTime2({clusterInfo,  labelSelector: 'run=node', kinds:["service",
        "pod", "deployment"] }) 

        console.log(chalk.red(getCachedEntitiesByTime2.time/1000));

       /* _.chain(entities)
            .values().forEach((v)=>{
                let f = printEntities (v)
                console.log(f);
                return f;
             }).forEach(console.log).value();*/
     
    
        }catch(e){
            throw e;
        }
       
    });
    it.skip('labels', () => {
        debugger;
        const labelsToString = require('../utils').labelsToString;
        console.log(labelsToString({ selector: { 'app': 'demo', 'release': 'bbbb8' } }));
    });
});
