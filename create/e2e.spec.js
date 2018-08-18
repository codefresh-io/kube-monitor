describe('create entities', ()=>{

 const Yaml = require('js-yaml');
 const fs   = require('fs');
 const crud = require('./entities');
 const _    = require('lodash');
 const Mustache = require('mustache');

 
  var podTemplate =  fs.readFileSync
    (__dirname + '/pod.yaml', 'utf8');
 
 
  it('create pods', (done)=>{
    crud.createPod({podTemplate , name: "test.pod.4"})
    .then((entity)=>{
        console.log(`entity created ${JSON.stringify(entity)}`);
        done();
  })
});
it.only('create service', (done)=>{
    
  
    var serviceTemplate =  fs.readFileSync
    (__dirname + '/service.yaml', 'utf8');

    let model = {
        release : {Name : "release1"},
        metadata: {
            name: "srv2",
            labels: {
                app: "test.srv4"
            }
        },
        spec : {
            service : {
                externalPort : 2222,
                portname: "myport"
            }
        }
    }

   // _.set(model, "annotations.codefresh.refresh")
    debugger;
    let manifest =  Mustache.render(serviceTemplate, model);
    console.log(manifest);
    manifest = Yaml.load(manifest);
   
    crud.createService({manifest : manifest })
    .then((entity)=>{
        console.log(`entity created ${JSON.stringify(entity)}`);
        done();
  })

})
it('test template', ()=>{
    debugger;
    

    var podTemplate =  fs.readFileSync
        (__dirname + '/pod.yaml', 'utf8');
    let manifest = Mustache.render(podTemplate.toString(),
     {name: "test1"})
    console.log(JSON.stringify(manifest));

})
});
