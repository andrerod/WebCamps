var util = require('util');

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/public'));

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/', function(req, res){
  res.render('index');
});

// Routes
require('./routes/game')(app);

var port = process.env.PORT || 8080;
app.listen(port);

console.log(util.format('Express app started on port %s', port));