let express = require('express');
let router = express.Router();
let fs = require('fs');

// home page
router.get('/', function(req, res, next) {
    res.render('index', {}, function(err, html) {
        
        // serve file locally
        res.send(html);

    	// // Flatfile build for current server setup
        fs.writeFile("./export/index.html", html, function(err) {
            if (err) {
                return console.log(`ERROR fs.writeFile `,err);
            }
        });

        // avoid race condition on fs stream
        setTimeout(()=>{ 
            fs.createReadStream("./www/scripts.js").pipe(fs.createWriteStream('./export/scripts.js'));
            fs.createReadStream("./www/style.css").pipe(fs.createWriteStream('./export/style.css'));
        },500);
    });

});

module.exports = router;