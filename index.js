const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const axios = require('axios');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const modelCreation = require('./services/modelCreation');

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

modelCreation('5a603dede53b7a02afb7d995');

const PORT = process.env.PORT || 5000;
app.listen(PORT);

