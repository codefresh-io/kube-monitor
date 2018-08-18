const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const client = new Client({ config: config.fromKubeconfig(), version: '1.9' });
const _ = require('lodash');
const JSONStream = require('json-stream');
const kefir = require('kefir');
const utils  = require('../utils')

const printEvents = (o)=>{
   
       let title= ["event", "kind", "namespace", "name"],
       columns=["event", "object.kind", "object.metadata.namespace", "object.metadata.name"],
       colWidths=[10, 30, 30, 30, 60]

       utils.print(o, {title, columns, colWidths});
}

const watchPodList = ({ labelSelector }={}) => {

    const stream = client.apis.v1.watch
    .namespaces('default')
    .pods()
    .getStream({qs: {labelSelector}});

    
    const jsonStream =  new JSONStream();
    const bufferedStream = kefir.fromEvents(jsonStream, "data")
    .bufferWithTimeOrCount(5000, 10).map((o)=>{
      return  _.map(o, (event)=>{
         return JSON.stringify(event)
         let obj =  _.pick(event, ["type", 
         "object.metadata.namespace", 
         "object.metadata.name"])
         let metadata = JSON.stringify(_.get(obj, "object.metadata"));
         _.set(obj, "object.metadata" , JSON.stringify(metadata));
         
  
      })
    }).filter((event)=>!_.isEmpty(event)) /*.map(printEvents)*/.log('events->')

    stream.pipe(jsonStream);
   

};

watchPodList({labelSelector:'run=test'})
