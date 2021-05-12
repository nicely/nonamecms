
var post_schema = new m.mongoose.Schema({
    'title': String,
    'content': String,
    'md_content': String,
    'description': String,
    'slug': String,
    'tags': Array,
    'videos': Array,
    'active': Boolean,
    'featured': Boolean,
    'featured_image': String,
    'author_name': String,
    'author_slug': String,
    'theme': String,
    'page': Boolean,
    'category': String,
    'last_mod_date': String,
    'click': Number,
    'structuredData': Boolean
},{
  versionKey: false
});

post_schema.index({name: 'text', 'title': 'text'});

module.exports = m.mongoose.model('nnposts', post_schema);