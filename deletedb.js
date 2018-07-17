const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ region: "us-east-1" });

var params = {
    TableName : "tc_vr_en"
};

dynamodb.deleteTable(params, function(err, data) {
    if (err) {
        console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});