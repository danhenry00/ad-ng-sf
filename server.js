const express = require('express');
const http = require('http');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const axios = require('axios');
const querystring = require('querystring');
const url = require('url');
const jsforce = require('jsforce');

const app = express();

const port = process.env.PORT || 4200;

var privatekey = fs.readFileSync('keys/lp_sfdc_jwt_key.key');
var credentials = require('./credentials.json');

var jwtparams = {
    iss: credentials.salesforce.consumer_key,
    prn: credentials.salesforce.username,
    aud: credentials.salesforce.url,
    exp: parseInt(moment().add(2, 'minutes').format('X'))
};

var token = jwt.sign(jwtparams, privatekey, { algorithm: 'RS256' });

var params = {
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: token
};

var token_url = new url.URL('/services/oauth2/token', credentials.salesforce.url).toString();
var conn = null;
axios.post(token_url, querystring.stringify(params))
    .then(function (res) {

        console.log("**Connecting to Saleforce")
        conn = new jsforce.Connection({
            instanceUrl: res.data.instance_url,
            accessToken: res.data.access_token
        });
        if(conn.accessToken)
        {
            console.log("**Connected to Saleforce as " + credentials.salesforce.username);
        }
    })
    .catch(error => {
        console.error(error);
    });

app.get('/api/accounts', (req, resp) =>
{
    
    console.log('get /api/accounts');
    conn.query("SELECT Id, Name FROM Account LIMIT 10", function (err, result) {
        if (err) { return console.error(err);}
        console.log("total : " + result.totalSize);
        console.log("fetched : " + result.records.length );
        console.log("stringify : " + JSON.stringify(result.records));
        resp.json(result.records);
      });
});

app.use(express.static(__dirname + '/dist/ad-ng-sf'));
const server = http.createServer(app);
server.listen(port, () => console.log('Running...'));