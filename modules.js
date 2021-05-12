module.exports = {
    'express': require('express'),
    'app': require('express')(),
    'cons': require('consolidate'),
    'path': require('path'),
    'fs': require('fs'),
    'mongoose': require('mongoose'),
    'async': require("async"),
    '_': require('lodash'),
    'request': require('request'),
    'compression': require('compression'),
    'bodyParser': require('body-parser'),
    'session':require('express-session'),
    // 'methodOverride': require('method-override'),
    'cookieParser': require('cookie-parser'),
    'cookieSession': require('cookie-session'),
    //Authentication modules
    'nodemailer': require('nodemailer'),
    'xhub': require("express-x-hub"),
    //CronJob
    'cron': require('cron'),
    //morgan and logger
    'morgan': require('morgan'),
    'helmet': require('helmet'),
    'cors': require('cors'),
    'qs': require('qs')
};
