var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');
const AWS = require('aws-sdk');
const dynamodbDocClient = new AWS.DynamoDB({ region: "us-east-1" });



var csv_filename = "C:\\Users\\trinet.tbs-004409\\Desktop\\alexa\\dataset-60days.csv";

rs = fs.createReadStream(csv_filename);
parser = parse({
    columns : true,
    delimiter : ','
}, function(err, data) {
    var split_arrays = [], size = 25;

    while (data.length > 0) {

        //split_arrays.push(data.splice(0, size));
        let cur25 = data.splice(0, size)
        let item_data = []

        for (var i = cur25.length - 1; i >= 0; i--) {
          const this_item = {
            "PutRequest" : {
              "Item": {
                // your column names here will vary, but you'll need do define the type
                //ID	RECALL_NUMBER_NUM	YEAR	MANUFACTURER_RECALL_NO_TXT	CATEGORY_ETXT	CATEGORY_FTXT	MAKE_NAME_NM	MODEL_NAME_NM	UNIT_AFFECTED_NBR	SYSTEM_TYPE_ETXT	SYSTEM_TYPE_FTXT	NOTIFICATION_TYPE_ETXT	NOTIFICATION_TYPE_FTXT	COMMENT_ETXT	COMMENT_FTXT	RECALL_DATE_DTE

                "recall_number": {
                  "S": cur25[i].RECALL_NUMBER_NUM + cur25[i].CATEGORY_ETXT.replace(" ","")
                },
                "make_model_year": {
                  "S": cur25[i].YEAR + cur25[i].MAKE_NAME_NM + cur25[i].MODEL_NAME_NM
                },
                "COMMENT": {
                  "S": cur25[i].COMMENT_ETXT
                }
              }
            }
          };
          item_data.push(this_item)
        }
        split_arrays.push(item_data);
    }
    data_imported = false;
    chunk_no = 1;
    async.each(split_arrays, (item_data, callback) => {
        const params = {
            RequestItems: {
                "tc_vr_en" : item_data
            }
        }
        dynamodbDocClient.batchWriteItem(params, function(err, res, cap) {
            if (err === null) {
                console.log('Success chunk #' + chunk_no);
                data_imported = true;
            } else {
                console.log(err);
                console.log('Fail chunk #' + chunk_no);
                data_imported = false;
            }
            chunk_no++;
            callback();
        });

    }, () => {
        // run after loops
        console.log('all data imported....');

    });

});
rs.pipe(parser);