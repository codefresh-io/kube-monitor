const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const fs     = require('fs')
const assert = require('assert');

debugger;

const test = async (options)=>{
    let client = new Client(options);
    await client.loadSpec();
    assert(client);

    const namespaceRequest = await client.apis.v1
    .namespaces
    .get();
  
  
   let namespaces = _.get(namespaceRequest, "body", {})

   console.log(JSON.stringify(namespaces));
}
const _ = require('lodash');
const cert = JSON.parse(fs.readFileSync(__dirname + "/cert"), "");

let o = _.chain(cert).mapValues((v)=>{
    return Buffer.from(v, "base64");
})
.set("url", "https://127.0.0.1:6443")
.set("insecureSkipTlsVerify", true).value();
 
console.log(JSON.stringify(o));
test({config:o});




function getInCluster() {
    const host = process.env.KUBERNETES_SERVICE_HOST;
    const port = process.env.KUBERNETES_SERVICE_PORT;
    const clientCertificate = "./cert"
    const privateKey = "./privateKey";

  
    if (!host || !port) {
      throw new TypeError(
        'Unable to load in-cluster configuration, KUBERNETES_SERVICE_HOST' +
        ' and KUBERNETES_SERVICE_PORT must be defined');
    }
  
    const ca = fs.readFileSync(caPath, 'utf8');
    const bearer = fs.readFileSync(tokenPath, 'utf8');
    const namespace = fs.readFileSync(namespacePath, 'utf8');
    const clientCert =  fs.readFileSync(clientCertificate);
    const privateKey = fs.readFileSync(privateKey);

  
    return {
      url: `https://${host}:${port}`,
      ca,
      auth: { bearer },
      namespace
    };
  }
  