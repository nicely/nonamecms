
var page_schema = new m.mongoose.Schema({
    'title': String,
    'slug': String,
    'tags': Array,
    'active': Boolean,
    'description': String,
    'theme': String
},{
  versionKey: false
});

module.exports = m.mongoose.model('nnpages', page_schema);