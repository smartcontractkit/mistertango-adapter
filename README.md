# Mistertango External Adapter

## How to use

* Install dependencies `npm install`

* Set up [Environment variables](#environment-variables)

* *Optional:* Run tests `npm test`

* Run `createRequest()` in one of the following ways:
    * call it directly
    * use the `handler()` wrapper for AWS Lambda
    * use the `gcpservice()` wrapper for GCP

* Use one of the available [Available methods](#available-methods)
    * Set method name in `data.method`, along with method-specific parameters

To create a ZIP file to upload to AWS/GCP, run:

```bash
zip -r cl-ea.zip .
```

## Environment variables

| Variable      |               | Description | Example |
|---------------|:-------------:|------------- |:---------:|
| `API_KEY`     | **Required**  | API key of the user. See [Mistertango Settings](https://bank.mistertango.com/profile/settings) | `e6ab820c-ad73-4f6c-9a39-8978a26b506a` |
| `API_SECRET`  | **Required**  | API secret of the user. See [Mistertango Settings](https://bank.mistertango.com/profile/settings) | `2a8f2e4e3b7e541` |
| `API_USERNAME`  | **Required**  | Email address of the Mistertango user | `you@example.com` |

## Available methods

### getBalance

Get client balance for current or previous date

#### Request

| Variable | Type |   | Description |
|----------|------|---|-------------|
| `date`   | String | *Optional* | Date for balance (current date, if skipped) |

#### Response

```json
{
   "status":true,
   "api":{
      "version":"string",
      "title":"string"
   },
   "message":"string",
   "data":{
      "available_balance":0,
      "reservations":0,
      "real_balance":0
   },
   "duration":0
}
```

### getList/getList3

Get transaction list for date or period, newest first, 100 transactions per call

#### Request

| Variable | Type |   | Description |
|----------|------|---|-------------|
| `dateFrom` | String | *Optional* | Start of period (week ago, if skipped) |
| `dateTill` | String | *Optional* | End of period (current date, if skipped) |
| `page` | Integer | *Optional* | Page of transaction list in period (1, if skipped) |

#### Response

```json
{
   "status":true,
   "api":{
      "version":"string",
      "title":"string"
   },
   "message":"string",
   "data":[
      {
         "total":0,
         "account":{
            "balance":0,
            "balance_from":0,
            "balance_till":0,
            "incomes":0,
            "expenses":0
         },
         "list":[
            {
               "uuid":"string",
               "other_side":"string",
               "other_side_account":"string",
               "direction":"string",
               "amount":0,
               "fee":0,
               "comment":"string",
               "status":"string",
               "date":"string",
               "type":"string"
            }
         ]
      }
   ],
   "duration":0
}
```

### sendMoney

Send money to IBAN account

#### Request

| Variable | Type |   | Description |
|----------|------|---|-------------|
| `amount` | Double | **Required** | Amount of money |
| `recipient` | String | **Required** | Name of the recipient |
| `account` | String | **Required** | IBAN account number or Mistertango username |
| `details` | String | **Required** | Details (description) of the transfer |

#### Response

```json
{
   "status":true,
   "api":{
      "version":"string",
      "title":"string"
   },
   "message":"string",
   "data":"string",
   "duration":0
}
```

## Disclaimer

In order to use this adapter, you will need to create an account with and obtain credentials from Mistertango and agree to and comply with Mistertango’s applicable terms, conditions and policies.  In no event will SmartContract Chainlink Limited SEZC be liable for your or your user’s failure to comply with any or all of Mistertango’s terms, conditions or policies or any other applicable license terms.