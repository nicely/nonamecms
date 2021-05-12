require(__dirname+"./../../globals");

var nn_model = require('../models')

var turndown = require('turndown');
var turndownService = new turndown()

global.isConsole = true;

//Database Configuration
m.mongoose.connect(config.databaseIp + config.database, {
    user: config.dbUser
    ,password: config.dbPass
});


m.mongoose.connection.on("open", function () {

    //Blog URL
    let url = 'https://www.noname.com/sm_posts.json';
    m.request(url,{json:true},function(err,res,posts){
        if(err) return console.log(err);
    console.log('veri: ',posts.length)
    m.async.eachSeries(posts,function(post,next_post){

        let p = post;

        var update = {
            'title': p.title.rendered,
            'content': p.content.rendered,
            'md_content': turndownService.turndown(p.content.rendered),
            'description': p.content.rendered.slice(0,160),
            'slug': p.slug,
            'tags': [],
            'videos': [],
            'page': false,
            'active': false,
            'featured': false,
            'last_mod_date': nn_f.lastModDate(new Date()),
            'theme': 'default.html'
        }

        nn_model.nn_posts.update({ 'slug': p.slug }, update,{upsert:true}, function (err, post) {
            if (err || !post)  return next_post();  
            console.log('+ ',p.slug);
            next_post();
        });

    },function(async_err){
        if(async_err) return console.log(async_err);

        console.log('All posts saved')

    })


    });


});
