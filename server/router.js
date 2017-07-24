let express = require('express');
let router = express.Router();
let fs = require('fs');

// home page
router.get('/', function(req, res, next) {
    res.render('index', {});
});

router.get('/export', function(req, res, next) {
    res.render('index', {}, function(err, html) {
        setTimeout(()=>{ 
         // // Flatfile build for current server setup
            fs.writeFile("./export/index.html", html, function(err) {
                if (err) {
                    return console.log(`ERROR fs.writeFile `,err);
                }
            });

            fs.createReadStream("./www/scripts.js").pipe(fs.createWriteStream('./export/scripts.js'));
            fs.createReadStream("./www/style.css").pipe(fs.createWriteStream('./export/style.css'));
        },1000);
        let timestamp = new Date().toUTCString();
        res.send('Export successful. <br> ' + timestamp);
    });
});


module.exports = router;