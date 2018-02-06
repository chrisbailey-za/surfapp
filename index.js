const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const axios = require('axios');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const CronJob = require('cron').CronJob;

const tideCall = require('./services/tideCall');
const mswCall = require('./services/mswCall');

require('./models/User');
require('./models/Spot');
require('./models/Session');
require('./models/Rating');
require('./models/ForecastHist');
require('./models/ForecastTable');
require('./services/passport');


mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());

app.use(
	cookieSession({
		maxAge: 90 * 24 * 60 * 60 * 1000,
		keys: [keys.cookieKey]
	})
);

app.use(passport.initialize());
app.use(passport.session());

//returns function and immediately calls with the variable app
require('./routes/authRoutes')(app);
require('./routes/spotRoutes')(app);
require('./routes/sessionRoutes')(app);
require('./routes/locationRoutes')(app);
require('./routes/conditionRoutes')(app);
require('./routes/forecastRoutes')(app);
require('./routes/modelCreation')(app);
require('./routes/ratingRoutes')(app);

if (process.env.NODE_ENV === 'production') {
	// Express will serve production assests like main.js file
 app.use(express.static('client/build'));

	// Express will serve the index.html file as default route
	const path = require('path');
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname,'client', 'build', 'index.html'));
	});
}

var tideCron = new CronJob({cronTime: '* * *', onTick: tideCall, start: true, timeZone: 'Africa/Johannesburg'})
var mswCron = new CronJob({cronTime: '* * * *', onTick: mswCall, start: true, timeZone: 'Africa/Johannesburg'})

const PORT = process.env.PORT || 5000;
app.listen(PORT);

