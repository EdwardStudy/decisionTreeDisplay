define([
	'../../app'
], function (app) {
	app.factory('distrConfig', [ function () {
		return [
			{
				"id": 1,
				"name": "Normal",
				"introduce": "http://en.wikipedia.org/wiki/Normal_distribution",
				"parameter": [
					{"name": "Mean", "default": 0},
					{"name": "Std dev", "default": 1}
				]
			},
			{
				"id": 2,
				"name": "Uniform",
				"introduce": "http://en.wikipedia.org/wiki/Uniform_distribution_(continuous)",
				"parameter": [
					{"name": "Mean", "default": 0},
					{"name": "Std dev", "default": 100}
				]
			},
			{
				"id": 3,
				"name": "Triangular",
				"introduce": "http://en.wikipedia.org/wiki/Triangular_distribution",
				"parameter": [
					{"name": "Min", "default": 0},
					{"name": "likeliest", "default": 0.5},
					{"name": "Max", "default": 1}
				]
			},
			{
				"id": 4,
				"name": "Beta",
				"introduce": "http://en.wikipedia.org/wiki/Beta_distribution",
				"optional": true,
				"parameter": [
					{"name": "Alpha", "default": 8},
					{"name": "Beta", "default": 4},
					{"name": "Mean" , "default": 0, "optional": true},
					{"name": "standard deviation" , "default": 0, "optional": true}
				]
			},
			{
				"id": 5,
				"name": "Chi",
				"introduce": "http://en.wikipedia.org/wiki/Chi_distribution",
				"parameter": [
					{"name": "n", "default": 4},
					{"name": "Sigma", "default": 1}
				]
			},
			{
				"id": 6,
				"name": "ChiSqured",
				"introduce": "http://en.wikipedia.org/wiki/Chi-squared_distribution",
				"parameter": [
					{"name": "n", "default": 4},
					{"name": "Sigma", "default": 1}
				]
			},
			{
				"id": 7,
				"name": "Erlang",
				"introduce": "http://en.wikipedia.org/wiki/Erlang_distribution",
				"parameter": [
					{"name": "k", "default": 4},
					{"name": "Lambda", "default": 0.5}
				]
			},
			{
				"id": 8,
				"name": "Exponential",
				"introduce": "http://en.wikipedia.org/wiki/Exponential_distribution",
				"parameter": [
					{"name": "Lambda", "default": 0.5}
				]
			},
			{
				"id": 9,
				"name": "Gamma",
				"introduce": "http://en.wikipedia.org/wiki/Gamma_distribution",
				"parameter": [
					{"name": "Alpha", "default": 2},
					{"name": "Lambda", "default": 1}
				]
			},
			{
				"id": 10,
				"name": "HyperExponential",
				"introduce": "http://en.wikipedia.org/wiki/Hyperexponential_distribution",
				"parameter": [
					{"name": "Lambda", "default": 2},
					{"name": "P", "default": 0.4}
				]
			},
			{
				"id": 11,
				"name": "Laplace",
				"introduce": "http://en.wikipedia.org/wiki/Laplace_distribution",
				"parameter": [
					{"name": "a", "default": 1},
					{"name": "b", "default": 1}
				]
			},
			{
				"id": 12,
				"name": "Logistic",
				"introduce": "http://en.wikipedia.org/wiki/Logistic_distribution",
				"parameter": [
					{"name": "a", "default": 1},
					{"name": "b", "default": 1}
				]
			},
			{
				"id": 13,
				"name": "LogNormal",
				"introduce": "http://en.wikipedia.org/wiki/Log-normal_distribution",
				"optional": true,
				"parameter": [
					{"name": "u (mean of logs)", "default": 5},
					{"name": "Sigma (std. dev. of logs)", "default": 1},
					{"name": "Mean" , "default": 0, "optional": true},
					{"name": "Median" , "default": 0, "optional": true}
				]
			},
			{
				"id": 14,
				"name": "Maxwell",
				"introduce": "http://en.wikipedia.org/wiki/Maxwell-Boltzmann_distribution",
				"parameter": [
					{"name": "Alpha", "default": 5}
				]
			},
			{
				"id": 15,
				"name": "Rayleigh",
				"introduce": "http://en.wikipedia.org/wiki/Rayleigh_distribution",
				"parameter": [
					{"name": "Alpha", "default": 1}
				]
			},
			{
				"id": 16,
				"name": "Weibull",
				"introduce": "http://en.wikipedia.org/wiki/Weibull_distribution",
				"parameter": [
					{"name": "Scale factor", "default": 1},
					{"name": "Shape", "default": 2}
				]
			},
			{
				"id": 17,
				"name": "Possion",
				"introduce": "http://en.wikipedia.org/wiki/Poisson_distribution",
				"parameter": [
					{"name": "Lambda", "default": 10}
				]
			},
			{
				"id": 18,
				"name": "Binomial",
				"introduce": "http://en.wikipedia.org/wiki/Binomial_distribution",
				"parameter": [
					{"name": "P (probability)", "default": 0.1},
					{"name": "Trials", "default": 20}
				]
			},
			{
				"id": 19,
				"name": "Gaussian_Fractal",
				"introduce": "http://en.wikipedia.org/wiki/Parabolic_fractal_distribution",
				"parameter": [
					{"name": ".10 (p=30%)", "default": 0},
					{"name": ".50 (p=40%)", "default": 5},
					{"name": ".90 (p=30%)", "default": 10}
				]
			},
			{
				"id": 20,
				"name": "Swanson_Fractal",
				"introduce": "http://en.wikipedia.org/wiki/Parabolic_fractal_distribution",
				"parameter": [
					{"name": ".10 (p=25%)", "default": 1},
					{"name": ".50 (p=50%)", "default": 5},
					{"name": ".90 (p=25%)", "default": 9}
				]
			},
			{
				"id": 21,
				"name": "Table",
				"introduce": "",
				"parameter": [
					{"name": "select table", "default": ""}
				]
			},
			{
				"id": 22,
				"name": "Drichlet",
				"introduce": "http://en.wikipedia.org/wiki/Dirichlet_distribution",
				"parameter": [
					{"name": "Alpha list", "default": "List(20;75;5)"}
				]
			},
			{
				"id": 23,
				"name": "MultiNormal",
				"introduce": "http://en.wikipedia.org/wiki/Multivariate_normal_distribution",
				"parameter": [
					{"name": "select table", "default": ""}
				]
			}
		];

	}])
});
