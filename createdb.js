const AWS = require('aws-sdk');
const dynamodbDocClient = new AWS.DynamoDB({ region: "us-east-1" });

var params = {
    TableName: "tc_vr_en",
    KeySchema: [
        { AttributeName: "recall_number", KeyType: "HASH" },  //Partition key
        { AttributeName: "make_model_year", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "recall_number", AttributeType: "S" },
        { AttributeName: "make_model_year", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 2
    }
};

dynamodbDocClient.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {node
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});