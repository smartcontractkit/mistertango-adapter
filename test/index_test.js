const assert = require('chai').assert;
const createRequest = require('../index.js').createRequest;

describe('createRequest', () => {
    context('Requests data', () => {
        const jobID = "278c97ffadb54a5bbb93cfec5f7b5503";
        const req = {
            id: jobID,
            data: {
                method: ""
            }
        };

        it('should fail on invalid method', (done) => {
            // Notice method not set.
            createRequest(req, (statusCode, data) => {
                assert.equal(statusCode, 400, "status code");
                assert.equal(data.jobRunID, jobID, "job id");
                assert.isUndefined(data.data, "response data");
                done();
            })
        });

        it('should get balance', (done) => {
            req.data.method = "getbalance"; // Case insensitive
            createRequest(req, (statusCode, data) => {
                assert.equal(statusCode, 200, "status code");
                assert.equal(data.jobRunID, jobID, "job id");
                assert.isNotEmpty(data.data, "response data");
                done();
            })
        });

        it('should get list of transactions', (done) => {
            req.data.method = "getlist"; // Case insensitive, no need append "3"
            createRequest(req, (statusCode, data) => {
                assert.equal(statusCode, 200, "status code");
                assert.equal(data.jobRunID, jobID, "job id");
                assert.isNotEmpty(data.data, "response data");
                done();
            })
        });
    })
});
