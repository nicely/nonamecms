"use strict";

var path = require("path");

global.homePath = path.resolve(__dirname);

//NPM Modules
global.m = require(homePath+'/modules');

//Schema "Models"
//global.model = require(homePath+'/models');

//Noname CMS
//Config Global
global.nn_config = require('./noname/config')();
global.config = require('./noname/config')();
global.nn_f = require('./noname/nn_functions.js');
//set public root for view
global.client_path = '/nn_themes/' + nn_config.theme;
global.view_path = __dirname+'/views/nn_themes/'+nn_config.theme;
global.app_path = __dirname;