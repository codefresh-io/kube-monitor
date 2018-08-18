const utils = require('./utils');

describe('uitls', () => {
    const obj = {};
    const o = {
        kind: 'ServiceList',
        apiVersion: 'v1',
        metadata:
        {
            selfLink: '/api/v1/namespaces/default/services/',
            resourceVersion: '3122369'
        },
        items:
        [
                { metadata: obj, spec: obj, status: obj },
                { metadata: obj, spec: obj, status: obj },
                { metadata: obj, spec: obj, status: obj }
        ]
    };

    it('faltten', (done) => {
        console.log(JSON.stringify(utils.flattenEntityList(o)));
        done();
    });
});