const express       = require('express');
const app           = express();
const morgan        =  require('morgan');

app.use(morgan());
app.get('/', (req, res) => res.send(200));
app.get('/kube', (req, res) => res.send('/kube'));
app.get('/kube/k8s/clusters/:clusters/entities', (req, res) => {
    res.send(`/kube/k8s/clusters/${req.params.clusters}/entities`);
}); 
app.listen(8888, (err) => {
    console.log(`connected ${(err)? err : ""}`);
});

