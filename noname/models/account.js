
var account_schema = new m.mongoose.Schema({
    token: String,
    token_secret: String,
    response_time: String,
    twitter_res: {}
},{
  versionKey: false
});

module.exports = m.mongoose.model('account', account_schema);