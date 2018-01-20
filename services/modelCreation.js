const keys = require("../config/keys");
const mongoose = require("mongoose");
const PolynomialRegression = require("ml-regression").PolynomialRegression;
require("../models/RatingModel");

mongoose.connect(keys.mongoURI);

const RatingModel = mongoose.model("ratingModel")
const Sessions = mongoose.model("sessions");

const modelCreation = async ( spotID ) => {
	Sessions.find({ _spot: spotID }).exec(async function(err, doc) {
		const ratings = doc.map(s => s.condition.rating / 10);
		const windSpeeds = doc.map(
			s => (s.condition.windSpeed ? s.condition.windSpeed : null)
		);
		const windDirection = doc.map(
			s => (s.condition.windDirection ? s.condition.windDirection : null)
		);
		const swellEnergy = doc.map(
			s => (s.condition.swellEnergy ? s.condition.swellEnergy : null)
		);
		const swellDirection = doc.map(
			s => (s.condition.swellDirection ? s.condition.swellDirection : null)
		);
		const tide = doc.map(s => (s.condition.tide ? s.condition.tide : null));

		const windSpeedModel = new PolynomialRegression(windSpeeds, ratings, 2);
		const windDirectionModel = new PolynomialRegression(
			windDirection,
			ratings,
			3
		);
		const swellEnergyModel = new PolynomialRegression(swellEnergy, ratings, 2);
		const swellDirectionModel = new PolynomialRegression(
			swellDirection,
			ratings,
			3
		);
		const tideModel = new PolynomialRegression(tide, ratings, 2);

		const modelsArray = {
			windSpeedModel: windSpeedModel,
			windDirectionModel: windDirectionModel,
			swellEnergyModel: swellEnergyModel,
			swellDirectionModel: swellDirectionModel,
			tideModel: tideModel
		}

		RatingModel.findOneAndUpdate({_spot:spotID}, modelsArray,{upsert:true}, function(err, doc){
			if (err) return res.send(500, { error: err });
		});

	});
};

module.exports = modelCreation;
