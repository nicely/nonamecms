var r = require('express').Router();;
var nn_model = require('../../models')

r.get('/', function (req, res) {
    if(req.session.nn_logged){

        var query;
        if(req.query.type == 'posts' & req.query.status == 'active'){
            query = {page:false,active: true}
        }else if(req.query.type == 'posts' & !req.query.status){
            query = {page:false,active: false}
        }else if(req.query.type == 'pages' & !req.query.status){
            query = {page:true,active: false}
        }else if(req.query.type == 'pages' & !req.query.status){
            query = {page:true,active: false}
        }else{
            var query = {};
        }

    nn_model.nn_posts.find(query).sort('-_id').exec(function (err, posts) {
        if (err) { res.render('nn_admin/index', { posts: posts, err: err }); return; }
        res.render('nn_admin/index', { posts: posts });
    });
    }else{
        res.render('nn_admin/signin', {});
    }
});

r.get('/post/new', function (req, res) {
    var themes = [];
    m.fs.readdirSync(view_path+'/custom').forEach(file => {
        if(file){
            themes.push(file.toString());
        }
    });
    res.render('nn_admin/post_new', {themes: themes});
});


r.post('/post/new', function (req, res) {
    var b = req.body;
    var post = new nn_model.nn_posts({
        'title': b.post_title,
        'content': b.post_content,
        'md_content': b.md_content,
        'description': b.post_description,
        'slug': nn_f.slug(b.post_title),
        'tags': b.post_tags.split(','),
        'videos': b.post_videos.split(','),
        'page': (b.post_page) ? true : false,
        'active': (b.post_active) ? true : false,
        'featured': (b.post_featured) ? true : false,
        'last_mod_date': nn_f.lastModDate(new Date())
    })
    if(b.theme) post.theme = b.theme; else post.theme = 'default.html';
    post.save(function (err) {
        res.redirect('/nn-admin');
    });

});

r.get('/post/:id/edit', function (req, res) {
    nn_model.nn_posts.findOne({ '_id': req.params.id }, function (err, post) {
        if (err || !post) { res.render('nn_admin/index', { posts: posts, err: err }); return; }
        var themes = [];
        m.fs.readdirSync(view_path+'/custom').forEach(file => {
            if(file){
                themes.push(file.toString());
            }
        });
        
        res.render('nn_admin/post_edit', { post: post, themes: themes });
    });
});

r.post('/post/:id/edit', function (req, res) {
    var b = req.body;
    var update = {
        'title': b.post_title,
        'content': b.post_content,
        'md_content': b.md_content,
        'description': b.post_description,
        'slug': nn_f.slug(b.post_title),
        'tags': b.post_tags.split(','),
        'videos': b.post_videos.split(','),
        'page': (b.post_page) ? true : false,
        'structuredData': (b.structuredData) ? true : false,
        'active': (b.post_active) ? true : false,
        'featured': (b.post_featured) ? true : false,
        'featured_image': (b.post_featured_image) ? b.post_featured_image : null,
        'author_name': (b.post_author_name) ? b.post_author_name : null,
        'author_slug': (b.post_author_name) ? nn_f.slug(b.post_author_name) : null,
        'last_mod_date': nn_f.lastModDate(new Date())
    }
    if(b.theme) update.theme = b.theme;
    nn_model.nn_posts.update({ '_id': req.params.id }, update, function (err, post) {
        if (err || !post) { res.render('nn_admin/index', { posts: posts, err: err }); return; }
        res.redirect('/nn-admin/post/' + req.params.id + '/edit');
    });

});

r.post('/image/upload', function (req,res){
if(!req.body.uri || !req.body.img_name) return res.json({error:'data not exist'});

m.request.get({
            url: req.body.uri,
            encoding: 'binary'
            }, function(err, response, body) {
                if (err || !body) return res.json({error:err});
                m.fs.writeFile('client'+client_path+'/img/posts/'+nn_f.slug(req.body.img_name)+'.'+req.body.extension[0], body, 'binary', function(err) {
                    if (err) return res.json({error:err});
                        res.json({error:null,data:nn_f.slug(req.body.img_name),extension:req.body.extension[0] });
                });
            });
});

r.get('/posts/json', function (req, res) {
    nn_model.nn_posts.find({'active': true , page: false},function (err,posts){
        res.json({ posts: posts});
    });
});

module.exports = r;