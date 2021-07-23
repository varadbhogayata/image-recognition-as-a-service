const AWS = require('aws-sdk');
AWS.config.update({region: 'region'});
const shell = require('shelljs')
var sqs = new AWS.SQS({accessKeyId: '', secretAccessKey: '', apiVersion: ''});
const fs = require('fs')

const BUCKET_NAME = "cc-project-input-image"
var s3 = new AWS.S3({
    accessKeyId: 'key',
    secretAccessKey: 'key',
})

var queueURL = "https://sqs.region.amazonaws.com/k/sqs-name";

var params = {
 AttributeNames: [
    "SentTimestamp"
 ],
 MaxNumberOfMessages: 1,
 MessageAttributeNames: [
    "All"
 ],
 QueueUrl: queueURL,
 VisibilityTimeout: 10,
 WaitTimeSeconds: 20
};

sqs.receiveMessage(params, function(err, data) {
  if (err) {
    console.log("Receive Error", err);
  } else if (data.Messages) {
    var deleteParams = {
      QueueUrl: queueURL,
      ReceiptHandle: data.Messages[0].ReceiptHandle
    };
    // console.log(data.Messages[0].MessageAttributes.S3_URL.StringValue)
    s3_url = data.Messages[0].MessageAttributes.S3_URL.StringValue
    s3_image_name = s3_url.split('/')
    image_name = s3_image_name[s3_image_name.length - 1]
    downloadFile(image_name)
    sqs.deleteMessage(deleteParams, function(err, data) {
      // if (err) {
      //   console.log("Delete Error", err);
      // } else {
      //   console.log("Message Deleted", data);
      // }
    });
  } else{
      shell.exec('pathto/CC_Project_App_Tier/terminate_app_tier.sh')
  }
});


const downloadFile = (fileName) => {
  var params = {
      Key: fileName,
      Bucket: BUCKET_NAME
  }
  s3.getObject(params, function(err, data) {
      if (err) {
          throw err
      }
      if (data.Body){
        fs.writeFileSync('pathto/CC_Project_App_Tier/classifier/'+fileName, data.Body)
      }
      // console.log('file downloaded successfully')
  })
};
