describe('pod info related tests', ()=>{
    it('match repo', ()=>{
        let t =/.\.azurecr\.io$/gi.test( "codefreshregistry.azurecr.io");
        console.log(t);

    })
})