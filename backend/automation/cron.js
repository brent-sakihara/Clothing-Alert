const cron = require('node-cron');
const express = require('express');
let app = express();
cron.schedule('* * * * * *', function() {
    console.log('running a task every second');
});
app.listen(3000);