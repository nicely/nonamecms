const express = require('express')
const app = express()

require('./globals')

/** Database Configuration */
m.mongoose.connect(nn_config.db_address + nn_config.db_name, {
  user: nn_config.dbUser
  ,password: nn_config.dbPass
});

m.mongoose.connection.on("open", function () {

/** View Engine */
var swig = require('swig');
var substring = function (input, count) {
  return input.toString().substr(0, count);
};
swig.setFilter('substring', substring);
m.app.use(m.compression())

app.engine('html', m.cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

/** Express session */
app.use(m.session({ resave: true ,secret: '91392028' , saveUninitialized: true}));

function static(dirname, age) {
    return m.express.static(m.path.join(__dirname, dirname), { maxAge: age });
}
/** Set Static Folder */
app.use('/nn_themes', static('client/nn_themes', 86400000*7));
app.use('/', static('client', 60000));

/** Body Parser MW (edited for CMS upload limit issue) */
app.use(m.bodyParser.urlencoded({extended:false,limit: '50mb'}));
app.use(m.bodyParser.json({limit: '50mb'}));

/** CMS Routes */
app.use('/nn-admin/signin', require("./noname/controllers/admin/signin"));
app.use('/nn-admin',nn_f.check_session, require("./noname/controllers/admin"));
app.use('/sitemap.xml', require("./noname/controllers/sitemap"));
app.use('/', require("./noname/controllers/custom"));
app.use('/', require("./noname/controllers/index"));

/** Start App */
app.listen(nn_config.port);

console.log("DB: " + nn_config.db_name);
});