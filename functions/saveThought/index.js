const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2)); // Log the starting event

    try {
        if (!event.body) throw new Error('Missing body in the event');
        
        const data = JSON.parse(event.body);
        if (!data.content) throw new Error('Missing content in the body');

        console.log("Parsed request body:", data); // Log the parsed body

        const params = {
            TableName: 'Thoughts',
            Item: {
                ThoughtID: uuid.v4(),
                Content: data.content,
                Timestamp: Date.now()
            },
        };

        console.log("DynamoDB Put Params:", JSON.stringify(params, null, 2)); // Log the params for DynamoDB put operation

        await dynamoDb.put(params).promise();
        console.log("Put operation successful."); // Log after the put operation

        return { statusCode: 200, body: JSON.stringify(params.Item) };
    } catch (error) {
        console.error("Error caught in Lambda function:", error); // Log any errors
        return { statusCode: 500, body: JSON.stringify({ Message: "Internal server error", Error: error.toString() }) };
    }
};
