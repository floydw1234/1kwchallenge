var request = require("request-promise");

var options = {
    uri: 'http://cpgateway.calit2.uci.edu:7502',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
};

request(options)
    .then(function (lightReading) {
        console.log(lightReading.sensor01);
    })
    .catch(function (err) {
        // API call failed...
    });
