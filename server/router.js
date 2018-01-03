let express = require('express');
let router = express.Router();
let fs = require('fs');

// home page
router.get('/', function(req, res, next) {
    res.render('index', {});
});
router.get('/pano', function(req, res, next) {
    res.render('panorama', {});
});

router.get('/export/:view', function(req, res, next) {
    const view = req.params.view || "index";
    res.render(view, {}, function(err, html) {
        setTimeout(()=>{ 
         // // Flatfile build for current server setup
            fs.writeFile("./export/" +view+ ".html", html, function(err) {
                if (err) {
                    return console.log(`ERROR fs.writeFile `,err);
                }
            });
            if ( view === "index" ) {
                fs.createReadStream("./www/scripts.js").pipe(fs.createWriteStream('./export/scripts.js'));
                fs.createReadStream("./www/style.css").pipe(fs.createWriteStream('./export/style.css'));
            }
        },1000);
        let timestamp = new Date().toUTCString();
        res.send('Export successful on view : ' + view + '. <br> ' + timestamp);
    });
});


module.exports = router;