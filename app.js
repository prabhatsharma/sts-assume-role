// Load the SDK and UUID
var AWS = require('aws-sdk');

var sts = new AWS.STS();

var params = {
    DurationSeconds: 3600,
    ExternalId: "123ABC",
    RoleArn: "arn:aws:iam::460424022147:role/org-master-account-role",
    RoleSessionName: "cbRole"
};

sts.assumeRole(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
        // console.log(data); // successful response
        var tempCreds = {
            accessKeyId: data.Credentials.AccessKeyId,
            secretAccessKey: data.Credentials.SecretAccessKey,
            sessionToken: data.Credentials.SessionToken
        }
        var s3 = new AWS.S3(tempCreds);
        var params = {
            Bucket: "qsbucket1",
            MaxKeys: 2
        };

        s3.listObjectsV2(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data); // successful response
        })

        var ses = new AWS.SES(tempCreds);
        var params = {
            Destination: {
                BccAddresses: [],
                CcAddresses: [
                    "recipient3@example.com"
                ],
                ToAddresses: [
                    "recipient1@example.com",
                    "recipient2@example.com"
                ]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: "This message body contains HTML formatting. It can, for example, contain links like this one: <a class=\"ulink\" href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" target=\"_blank\">Amazon SES Developer Guide</a>."
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: "This is the message body in text format."
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Test email"
                }
            },
            ReplyToAddresses: [],
            ReturnPath: "",
            ReturnPathArn: "",
            Source: "sender@example.com",
            SourceArn: ""
        };

        ses.sendEmail(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data); // successful response
            /*
            data = {
             MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
            }
            */
        });
    }
});