const request = require("request");
const ms = require("microseconds");
const CryptoJS = require("crypto-js");
const querystring = require("querystring");

const API_URL = "https://api.mistertango.com:8445";
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const API_USER = process.env.API_USERNAME;

const createRequest = (input, callback) => {
    let method;
    let queryObj;

    switch (input.data.method.toLowerCase()) {
        case "getbalance":
            method = "getBalance";
            queryObj = getBalance(input.data);
            break;
        case "getlist":
        case "getlist3":
            method = "getList3";
            queryObj = getList(input.data);
            break;
        case "sendmoney":
            method = "sendMoney";
            queryObj = sendMoney(input.data);
            break;
        default:
            callback(400, {
                jobRunID: input.id,
                status: "errored",
                error: "Invalid method"
            });
            return
    }

    let cmdUrl = "/v1/transaction/" + method;
    let fullUrl = API_URL + cmdUrl;
    queryObj.nonce = getNonce();
    let signature = makeSignature(queryObj, cmdUrl);
    let formData = querystring.stringify(queryObj);

    const options = {
        method: "POST",
        url: fullUrl,
        headers: {
            "X-API-KEY": API_KEY,
            "X-API-SIGN": signature,
            "X-API-NONCE": queryObj.nonce,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData,
        json: true
    };

    request(options, (error, response, body) => {
        // Add any API-specific failure case here to pass that error back to Chainlink
        if (error || response.statusCode >= 400) {
            callback(response.statusCode, {
                jobRunID: input.id,
                status: "errored",
                error: body,
                statusCode: response.statusCode
            });
        } else {
            callback(response.statusCode, {
                jobRunID: input.id,
                data: body,
                statusCode: response.statusCode
            });
        }
    });
};

// Create nonce in the form of a timestamp
const getNonce = () => new Date().getTime() + '' + parseInt(ms.now() / 100000000);

// makeSignature takes data object and the command_url (/v1/...), and creates a valid
// base64-encoded SHA512-hash of command_url + sha256(nonce + querystring.stringify(data))
// using the API_SECRET.
const makeSignature = (data, command_url) => {
    let hashString = data.nonce + querystring.stringify(data);
    let hashed = CryptoJS.SHA256(hashString).toString(CryptoJS.enc.Latin1);
    let encoded = CryptoJS.enc.Latin1.parse(command_url + hashed);
    return CryptoJS.HmacSHA512(encoded, API_SECRET).toString(CryptoJS.enc.Base64);
};

const getBalance = data => ({
    username: API_USER,
    date: data.date || ""
});

const getList = data => ({
    username: API_USER,
    dateFrom: data.dateFrom || "",
    dateTill: data.dateTill || "",
    page: data.page || ""
});

const sendMoney = data => ({
    username: API_USER,
    amount: data.amount,
    currency: "EUR",
    recipient: data.recipient.replace(' ', '_'),
    account: data.account,
    details: data.details
});

// createRequest() wrapper for GCP
exports.gcpservice = (req, res) => {
    createRequest(req.body, (statusCode, data) => {
        res.status(statusCode).send(data);
    });
};

// createRequest() wrapper for AWS Lambda
exports.handler = (event, context, callback) => {
    createRequest(event, (statusCode, data) => {
        callback(null, data);
    });
};

// Used for testing
module.exports.createRequest = createRequest;
