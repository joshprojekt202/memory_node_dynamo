const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const duration = event.queryStringParameters.duration || 30;
    // const duration = 30;

    const timeLimit = Date.now() - (duration * 60000);

    const params = {
        TableName: 'Thoughts',
        FilterExpression: '#ts between :start and :end',
        ExpressionAttributeNames: {
            '#ts': 'Timestamp' // Substitute 'Timestamp' with '#ts' to avoid reserved keyword conflict
        },
        ExpressionAttributeValues: {
            ':start': timeLimit,
            ':end': Date.now()
        }
    };

    try {
        const result = await dynamoDb.scan(params).promise();
        return { statusCode: 200, body: JSON.stringify(result.Items) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify(error) };
    }
};
