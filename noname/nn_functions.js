var object = {};

/** Modify texts for slug */
object.slug = function (text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

/** Redirects correct render view file according to choice of themes in config.js */
object.render_path = function (post) {
    if (post.page) {
        if (post.theme != 'default.html') {
            return 'nn_themes/' + nn_config.theme + '/custom/' + post.theme;
        } else {
            return 'nn_themes/' + nn_config.theme + '/page';
        }
    } else {
        if (post.theme != 'default.html') {
            return 'nn_themes/' + nn_config.theme + '/custom/' + post.theme;
        } else {
            return 'nn_themes/' + nn_config.theme + '/post';
        }
    }
}

/** Basic session control for blog admin panel */
object.check_session = function (req, res, next) {
    if (req.session.nn_logged) {
        next();
    } else {
        res.render('nn_admin/signin', {});
    }
}

/** Date formatter generates human readeable dates */
object.formatDate = function (date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

/** Generates last articles modification date suitable for sitemap.xml */
object.lastModDate = function (date) {
    function pad(n) { return n < 10 ? '0' + n : n }
    return date.getUTCFullYear() + '-'
        + pad(date.getUTCMonth() + 1) + '-'
        + pad(date.getUTCDate())
}

module.exports = object;