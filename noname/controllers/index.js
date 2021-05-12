var r = require('express').Router();
var nn_model = require('../models')

//Front Page Controll
var front_page;
if (m.fs.existsSync(app_path + '/views/nn_themes/' + nn_config.theme + '/front_page.html')) {
    front_page = true;
};

r.get('/', function (req, res) {
    if (front_page) {
        res.render('nn_themes/' + nn_config.theme + '/front_page', { post: nn_config.front_page });
    } else {
        nn_model.nn_posts.find({ 'active': true, 'page': false }).sort('-_id').limit(12).exec(function (err, posts) {
        if (err) { res.status(404).render('nn_themes/' + config.theme + '/404', {}); return; }
        res.render('nn_themes/' + nn_config.theme + '/blog_page', { posts: posts, post: nn_config.blog_page });
    });
    }
});

if (front_page) {
    r.get('/blog', function (req, res) {
        nn_model.nn_posts.find({ 'active': true, 'page': false }).sort('-last_mod_date').limit(8).exec(function (err, posts) {
            if (err) { return res.status(404).render('nn_themes/' + nn_config.theme + '/404', {}); }

                for(var i = 0; i < posts.length; i++){
                    posts[i].readeable_date = posts[i]._id.getTimestamp().toUTCString().toString().slice(0,16);
                }
            res.render('nn_themes/' + nn_config.theme + '/blog_page', { posts: posts, post: nn_config.blog_page });
        });
    });
    }
    
    r.get('/archives', function (req, res) {
        nn_model.nn_posts.find({ 'active': true, 'page': false }).sort('-_id').exec(function (err, posts) {
            if (err) { return res.status(404).render('nn_themes/' + nn_config.theme + '/404', {}); }
                for(var i = 0; i < posts.length; i++){
                    posts[i].readeable_date = posts[i]._id.getTimestamp().toUTCString().toString().slice(0,16);
                }
            res.render('nn_themes/' + nn_config.theme + '/blog_archive', { posts: posts, post: nn_config.blog_archive });
        });
    }); 

r.get('/robots.txt', function(req, res){
    res.type('text/plain')
    res.send(`User-agent: *\nAllow: /\n\nSitemap: `+ nn_config.website_address +`sitemap.xml')`);
});

//Added for coment.io
/* if (config.theme == 'seoking_coment'){
    r.get('/login', function (req, res) {
        if(req.query.redirect){
            res.redirect('https://www.coment.io/?redirect=upgrade');
        }else{
            res.redirect('https://www.coment.io');
        }
    });
} */

//search
r.get('/search',function(req,res){

    if(!req.query.query) return res.render('nn_themes/' + nn_config.theme + '/search', { posts: [], post: nn_config.search_page });

    nn_model.nn_posts.find({$text: {$search: req.query.query},'active': true}).lean().sort('-click').exec(function (err, posts) {
        for(var i = 0; i < posts.length; i++){
            posts[i].readeable_date = posts[i]._id.getTimestamp().toUTCString().toString().slice(0,16);
        }
        res.render('nn_themes/' + nn_config.theme + '/search', { posts: posts, post: nn_config.blog_page });
    });
});

//Pagination
r.get('/page/:number',function(req,res){
    if(!req.params.number || req.params.number == '0') return res.status(404).render('nn_themes/' + nn_config.theme + '/404', {});

    var skip = req.params.number * 10;

    nn_model.nn_posts.find({ 'active': true, 'page': false }).skip(skip).sort('-last_mod_date').limit(10).exec(function (err, posts) {
        if (err || !posts.length) { return res.status(404).render('nn_themes/' + nn_config.theme + '/404', {}); }

            for(var i = 0; i < posts.length; i++){
                posts[i].readeable_date = posts[i]._id.getTimestamp().toUTCString().toString().slice(0,16);
            }
        res.render('nn_themes/' + nn_config.theme + '/pagination', { posts: posts, post: nn_config.pagination_page, number: parseInt(req.params.number)  });
    });
});

r.get('/amp/:slug', function (req, res) {
    var slug = req.params.slug;
    nn_model.nn_posts.findOne({ 'slug': slug , structuredData: true }).lean().exec(function (err, post) {
        if (err || !post || !post.active) { return res.status(404).render('nn_themes/' + nn_config.theme + '/404', {}); }
            nn_model.nn_posts.update({'slug': post.slug},{$inc: {'click': 1}},function (err){});

            nn_model.nn_posts.find({'page': false,'active': true}).lean().select('title slug').sort('-click').limit(5).exec(function (err, popular_posts) {
                if(err) console.log(err);

                var tag = (post.tags && post.tags[0]) ? post.tags[0] : null;

                post.content = post.content.replace(/<img/g,'<amp-img layout="fixed-height" height="200"');

                console.log(post.content)

          post.readeable_date = post._id.getTimestamp().toUTCString().toString().slice(0,16);

            post.structured_modified_time = new Date(post.last_mod_date).toISOString();
            post.structured_created_time = post._id.getTimestamp().toISOString();

        res.render('nn_themes/'+ nn_config.theme +'/amp_post', { 'post': post, 'popular': popular_posts });
     });
    });
});

r.get('/:slug', function (req, res) {
    var slug = req.params.slug;
    nn_model.nn_posts.findOne({ 'slug': slug }).lean().exec(function (err, post) {
        if (err || !post || !post.active) { return res.status(404).render('nn_themes/' + nn_config.theme + '/404', {}); }
            nn_model.nn_posts.update({'slug': post.slug},{$inc: {'click': 1}},function (err){});

            nn_model.nn_posts.find({'page': false,'active': true}).lean().select('title slug').sort('-click').limit(5).exec(function (err, popular_posts) {
                if(err) console.log(err);

                var tag = (post.tags && post.tags[0]) ? post.tags[0] : null;

                nn_model.nn_posts.find({'tags': tag,'_id': { $ne: post._id },'active': true}).lean().select('title slug').sort('-click').limit(5).exec(function (err, related_posts) {
                    if(err) console.log(err);

          post.readeable_date = post._id.getTimestamp().toUTCString().toString().slice(0,16);
          if(post.structuredData){
            post.structured_modified_time = new Date(post.last_mod_date).toISOString();
            post.structured_created_time = post._id.getTimestamp().toISOString();
          }
        res.render(nn_f.render_path(post), { 'post': post, 'popular': popular_posts, 'related':related_posts });
        });
     });
    });
});



//for all endpoints
r.get('*',function(req,res){
    res.status(404).render('nn_themes/' + nn_config.theme + '/404', {});
});
   
   

module.exports = r;