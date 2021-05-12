var r = require('express').Router();
var nn_model = require('../models')

r.get('/', function (req, res) {
    var xml;
    nn_model.nn_posts.find({active:true}).sort('-_id').exec(function (err, posts) {
        if (err) { res.render('nn_admin/index', { posts: posts, err: err }); return; }

        xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

        xml = xml + '\n<url><loc>'+nn_config.website_address+'</loc><lastmod>'+nn_config.front_page.last_mod_date+'</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>';

        if(nn_config.blog_page){
            xml = xml + '\n<url><loc>'+nn_config.website_address+'blog</loc><lastmod>'+posts[0].last_mod_date+'</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>';
            xml = xml + '\n<url><loc>'+nn_config.website_address+'archives</loc><lastmod>'+posts[0].last_mod_date+'</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>';
        }

        for (var index = 0; index < posts.length; index++) {
             xml = xml + '\n<url><loc>'+nn_config.website_address+posts[index].slug+'</loc><lastmod>'+posts[index].last_mod_date+'</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>';
        }
        xml = xml + '</urlset> ';
        res.set('Content-Type', 'text/xml');
        res.send(xml);
    });
});

module.exports = r;