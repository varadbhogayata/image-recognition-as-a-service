const AWS = require('aws-sdk');
var metadata = require('node-ec2-metadata');
AWS.config.update({region:''});

const ec2 = new AWS.EC2({apiVersion: '',accessKeyId: '', secretAccessKey: ''});


metadata.getMetadataForInstance('instance-id')
.then(function(instanceId) {
    console.log("Instance ID: " + instanceId);
    const params = {
    InstanceIds: [
         instanceId
    ]
  };
  
  ec2.terminateInstances(params, function(err, data) {
    // if (err) {
    //   console.log(err, err.stack); 
    // } else {
    //   console.log(data);          
    // }  
  });
  
})
.fail(function(error) {
    console.log("Error: " + error);
});

