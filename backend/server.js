let express = require('express');
let app = express();

const API_PORT = process.env.API_PORT || 8081;
const HOST = '0.0.0.0';

// Send message for default route
app.get('/', function(req, res){
    res.send("Express is running successfully!");
});

// Listen to specified port(always keep this at bottom of the file)
app.listen(API_PORT, HOST);

console.log(`Running on http://${HOST}:${API_PORT}`);
