let express = require('express');
let router = express.Router();
let fs = require('fs');

// home page
router.get('/', function(req, res, next) {
    res.render('index', {});
});

router.get('/about/:section?', function(req, res, next) {
    let section = req.params.section;
    res.render('about', { section });
});

// router.get('/pano', function(req, res, next) {
//     res.render('panorama', {});
// });

module.exports = router;