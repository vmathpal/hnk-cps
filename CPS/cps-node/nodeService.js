import { Service } from 'node-windows';

var svc = new Service({
     name: "nodeS2",
     description: "this is our  server ",
     script: "C:\\Users\\Administrator\\ReactProjects\\CPS\\cps-node\\dist\\index.js"

});

svc.on('install',function(){
    //console.log("uninstall");
    svc.start();
});

svc.install();
