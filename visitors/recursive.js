
const _ = require('lodash');
const assert = require('assert');
const chalk = require('chalk');
const utils = require('../utils');
const debug = require('debug')('recursive')
const Status = require('./status');
const kefir = require('kefir');

 debugger;

 

const  getKubeClient = async (clusterInfo)=>{
  let client = await require('../kubeclient').Client(clusterInfo);

  assert(client, "client assertion");
  assert(client.apis, "client.api");

  return client;
}

getServices = async ({clusterInfo , name , namespace='default', labelSelector, isRecursive})=>{
  try{
  let client = await getKubeClient(clusterInfo);

  let serviceRequest  = await client.apis.v1
  .namespaces(namespace)
  .services
  .get({qs: {labelSelector}});

  let services = (_.get(serviceRequest, "body",
   _.get(serviceRequest, "body")))

  return services;

  }catch(e){
    console.log(`exception ${e}`)
    throw e;
  }
}
getDeployments = async({clusterInfo, namespace="default", name, labelSelector})=>{
  try{

  let client = await getKubeClient(clusterInfo);

  debug(chalk.green(`looking for pods with ${JSON.stringify(labelSelector)}`));
  let deploymentRequest =  await client.apis.apps.v1
  .namespaces(namespace)
  .deployments(name)
  //.get()
  .get({qs: {labelSelector}});

  assert(deploymentRequest);
  let deployments = _.get(deploymentRequest, "body", {});
  return deployments;

  }catch(e){
    throw e;
  }
}
getPods = async({clusterInfo ,namespace="default",name, labelSelector})=>{
   
  try {

    let client = await getKubeClient(clusterInfo);
    debug(chalk.green(`looking for pods with ${JSON.stringify(labelSelector)}`));
    let podsRequest =  await client.apis.v1
    .namespaces(namespace)
    .pods 
    //.get()
    .get({qs: {labelSelector}});

    assert(podsRequest);
    let pods = _.get(podsRequest, "body", {});
    console.log(JSON.stringify(pods));

    return pods;
  }catch (e){
    throw e;
  }
}
let imageInfoParser = (podInfo)=>{

  let cStatus = _.get(podInfo, "status.containerStatuses", {});
  _.forEach(cStatus, (status)=>{
    const regs = [["azure",/.\.azurecr\.io$/], "dockerhub", "gcr", "ecr"]
    
    if (/.\.azurecr\.io$/gi.test(status.image))
       console.log('azure')
    if (/^r\.cfcr\.io/gi.test(status.image))
       console.log(chalk.green('codefresh'))
   
  })
  return kefir.constant(podInfo)  ;
}
 /*
 spec:
    containers:
    - image: alpine
      imagePullPolicy: Always
      name: test
      resources: {}
      terminationMessagePath: /dev/termination-log
      terminationMessagePolicy: File
      volumeMounts:
      - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
        name: default-token-ndjvr
        readOnly: true

        containerStatuses:
    - containerID: docker://8ba4095131b63278c974ea87ef774b4c2630d70f368dac1fdc92c614aab13331
      image: alpine:latest
      imageID: docker-pullable://alpine@sha256:7043076348bf5040220df6ad703798fd8593a0918d06d3ce30c6c93be117e430
      lastState:
        terminated:
          containerID: docker://8ba4095131b63278c974ea87ef774b4c2630d70f368dac1fdc92c614aab13331
          exitCode: 0
          finishedAt: 2018-09-01T09:53:45Z
          reason: Completed
 */


 
getNamespaces = async ({name, labelSelector})=>{
  const namespaceRequest = await client.apis.v1
  .namespaces(name)
  .get({qs: {labelSelector}});


 let namespaces = _.get(namespaceRequest, "body", {})

 return namespaces;
}

getClusterNodes = async ({name, labelSelector})=>{
  const  nodesRequest = await client.apis.v1
  .nodes()
  .get({qs: {labelSelector}});


 let items = _.get(nodesRequest, "body.items", {})
 nodes = (!_.isUndefined(items)) ? items : _.get(nodesRequest, "body")

 _.set(node,"selector", )
 return nodes;
}
cachedGetServices = _.memoize(getServices, (a,b)=>{
  debug(`a=${JSON.stringify(a.selector.namespace)}`)
  return a.selector.namespace;
})

const nolabel = {"label": "doesnotexist"}

let getServicesAwait = _.partial(getServices,
   {selector:{"namespace":"default"}});

const getServiceStream  = (options)=>{
  return kefir.fromPromise
  (getServices(options)).spy('services=>')
  .map(utils.flattenEntityList)
  //.flatten()
  .spy('services=>');
}
const getDeploymentStream = (options)=>{
  let deployFunc = _.partial(getDeployments, options);
  return  kefir.fromPromise(deployFunc())
  .map(utils.flattenEntityList)
  //.flatten()
  .spy('deployment=>')
}

const getPodsStream = (options)=>{
  let podsFunc = _.partial(getPods, options);
  return  kefir.fromPromise(podsFunc())
  .map(utils.flattenEntityList)
  .map((pod)=>{
    let images = _.pick(pod, ["status.containerStatuses",
     "status.containerStatuses"]);
     console.log(`!!!images ${JSON.stringify(pod)}`);

     return pod;
  }).flatten().flatMap(imageInfoParser).scan((prev, next)=>{prev.push(next); return prev}, [])

  .spy('pods=>')
}
const streamFactories = {
   services: getServiceStream,
   service: getServiceStream,
   deployment: getDeploymentStream,
   deployments: getDeploymentStream,
   pod : getPodsStream,
   pods : getPodsStream
  }
const getEntityByLabel = ({clusterInfo , namespace , labelSelector , kinds =["pod"] }) => {
 

let streams = _.chain(streamFactories).filter((streamFunc , kind)=>{
   
         console.log(JSON.stringify(kind));
         return _.includes(kinds, kind);
      }).values().map((f)=>{
      return f({clusterInfo, namespace , labelSelector});
      }).value();
  
let resultStream = kefir.merge(streams).log('streams')
  .scan((prev, entity) => {
    let kind = _.chain(entity)
    .first()
    .get("kind", undefined).value();
  
    if (_.isUndefined(kind)) {
      console.log('!!')
      return prev;
    }
    _.set(prev, kind, entity)
    return prev;
  }, {})
  .last().log('entities=>')
 
  return resultStream.takeErrors(1).toPromise();
}


const getKubeEntities = ({namespace, labelSelector , kinds =["pod"] }) => {

  let services = kefir.fromPromise
    (getServices({namespace, labelSelector})).spy('services=>').map(utils.flattenEntityList).flatten().spy();

  let deployments = services.flatMap((s) => {
    let selector = _.get(s, "spec.selector", nolabel);
    (_.isEmpty(selector)) ? selector=nolabel : selector

    labelSelector = utils.labelsToString(_.get(selector, "matchLabels", selector));
    let deployFunc = _.partial(getDeployments, { labelSelector });
    return kefir.fromPromise(deployFunc())
  }).map(utils.flattenEntityList)
  .flatten()
  //.spy();


  let pods = deployments.flatMap((d) => {
    let selector = _.get(d, "spec.selector", nolabel);
    (_.isEmpty(selector)) ? selector=nolabel : selector
    console.log(`selector=${JSON.stringify(selector)}`);
    labelSelector = utils.labelsToString(_.get(selector, "matchLabels", selector));
     console.log(`selector=${JSON.stringify(selector)}`);
    
    let podsFunc = _.partial(getPods, { labelSelector});
    return kefir.fromPromise(podsFunc())
  }).map(utils.flattenEntityList)
  .flatten()
  //.spy()
//  .offLog()

  let aggregative = kefir.merge([services, deployments,pods])
    .scan((prev, entity) => {
      let data = _.get(prev, entity.kind, []);
      assert(data);
      data.push(entity);
      debug(`data = ${JSON.stringify(data)}`);
      debug(chalk.green('proccessing entity  '
        + JSON.stringify(entity)));

      return prev;
    }, { service: [], deployment: [], pod: [] })
    .last()
    .flatMap((o)=>{
      let v = _.pick(o, kinds);
      return  kefir.constant(v);
    })
    //.spy();
     //.offLog();

  let resultStream = aggregative.flatMap((o) => {
    return kefir.sequentially(0, _.values(o))
  })
  //.spy('result->Stream');
  resultStream.onError(_.partial(console.log, "Error:"));
  resultStream.onValue((o) => {

    let configuration = {
      title: ["kind", "name",  "labels", "status"],
      columns: ["kind", "metadata.name", "metadata.spec.labels", "spec.selector", "status.phase"],
      colWidths: [10, 30, 30, 30, 60]
    }

    console.log(utils.showInTable(configuration, o))

    return o;
  });
  aggregative.onEnd(() => {
    debug('end of aggregative stream')
  })

  return resultStream.toPromise();
}

 

module.exports.getPods = getPods;
module.exports.getKubeEntities = getKubeEntities;
module.exports.getEntityByLabel = getEntityByLabel;