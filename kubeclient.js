const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;

let Auth = {client: undefined}
debugger;
module.exports.Auth  = Auth;
module.exports.Client = async (clusterInfo)=>{
  return getClient(clusterInfo);
}
module.exports.getClient = getClient;
async function getClient(clusterInfo) {
    console.log('running init process');
    try {
      let  client;
      if (process.env.LOCAL){
      client = new Client({ config: config.fromKubeconfig()
        , version: '1.9' });
      console.log('from kubeconfig');  
      Auth.client = client;
 
      return client;
    }
      else {
       client = new Client({ config: clusterInfo || config.getInCluster() });
       await client.loadSpec();  
       Auth.client = client;
    }
      // Load the /swagger.json from the kube-apiserver specified in config.fromKubeconfig()
      //
      
     
      
      return client

    } catch (err) {
      console.log('Error: ', err);
    }
  }

