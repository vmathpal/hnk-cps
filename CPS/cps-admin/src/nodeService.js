var Service = require('node-windows').Service;

var svc = new Service({
     name: "node1",
     description: "this is our  server ",
     //scripts:"C:\\Users\\Administrator\\ReactProjects\\CPS\\cps-node\\scipt.js"
       scripts:"C:\\Users\\Administrator\\ReactProjects\\CPS\\cps-admin\\src\\index.js"

});

svc.on('install',function(){
    //console.log("uninstall");
    svc.start();
});

svc.install();
