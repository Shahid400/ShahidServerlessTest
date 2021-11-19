import * as AWS from 'aws-sdk';

const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "localhost",
    endpoint: "http://localhost:8000",
});

export const Dynamo = {
    async createData(params) {
        try {
            await documentClient.put(params).promise();
            const msg = "Created";
            return msg;
        } catch (error) {
            const msg = "Please sent the right  body again"
            return msg;
        }
    },

    async getData(params) {
        try {
            const data = await documentClient.query(params).promise();
            return data;
        } catch (error) {
            return error
        }
    },

    async getOne(params) {
        try {
            const data = await documentClient.get(params).promise();
            return data;
        } catch (error) {
            return error
        }
    },

    async getList(params) {
        try {
            const list = await documentClient.scan(params).promise();
            return list;
        } catch (error) {
            return error
        }
    },

    async deleteOne(params) {
        try {
            await documentClient.delete(params).promise();
            const msg = "deleted";
            return msg;
        } catch (error) {
            return error
        }
    },

    async updateOne(params) {
        try {
            await documentClient.update(params).promise();
            const msg = "updated";
            return msg;
        } catch (error) {
            return error
        }
    },

}