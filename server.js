var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
let cards = [];
let lanes = [];
let catalog = [];

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

app.use('/', router);

router.post('/cards', function(req, res) {
	cards.push(req.body);
	res.send('message resceved');
});
router.get('/cards', function(req, res) {
	res.send(cards);
});
router.get('/cards/:card_id', function(req, res) {
	res.send(cards.find((card) => card.id == req.params.card_id));
});
router.put('/cards/:card_id', function(req, res) {
	let update = cards.find((card) => card.id == req.params.card_id);
	update.color = req.body.color || update.color;
	update.body = req.body.body || update.body;
	update.title = req.body.title || update.title;
});

router.post('/catalog', function(req, res) {
	catalog = req.body;
	res.send('message resceved');
});
router.get('/catalog', function(req, res) {
	res.send(catalog.catalog);
});
app.listen(port);
console.log('Uplink acquired on port ' + port);
