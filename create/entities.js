
const assert = require('assert');
const Mustache = require('mustache');
const Yaml = require('js-yaml');
const _ = require('lodash');

const  getKubeClient = async ()=>{
    let client = await require('../config').Client();
  
    assert(client, "client assertion");
    assert(client.apis, "client.api");
  
    return client;
  }

const createPod = async ({name,namespace="default"
, cluster, podTemplate})=>{

    let manifest =  Mustache.render(podTemplate, {name});
    manifest = Yaml.load(manifest);
    
    client = await getKubeClient();
    await client.apis.v1
    .namespaces(namespace)
    .pods 
    //.get()
    .post({body: manifest});

    createdPod = await client.apis.v1
    .namespaces(namespace)
    .pods(name) 
    .get();

    return createdPod;
     
}

 
const createDeploy = ({cluster, spec})=>{

}
const createService = async ({cluster, namespace="default", manifest})=>{
   
   
   client = await getKubeClient();

    let serviceRequest  = await client.apis.v1
    .namespaces(namespace)
    .services
    .post({body: manifest});
 
    let createdService  = await client.apis.v1
    .namespaces(namespace)
    .services(_.get(manifest, "metadata.name"))
    .get();

    return createdService;

}
const createConfig = ({cluster, spec})=>{

}
const createSecret = ({cluster, spec})=>{

}

module.exports.createPod = createPod;
module.exports.createService = createService;