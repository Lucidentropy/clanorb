const videoList = require('./videoList');

const theVideo = {
    player: document.getElementById('bg-video'),
    videoTokens: [],
    refs: {},
    init() {
        this.player.addEventListener('loadeddata', () => {
            this.play();
        });
        this.player.addEventListener('ended', () => {
            this.randomVid();
        });

        document.getElementById('video-pause').addEventListener("click", () => {
            this.pause();
        });

        document.getElementById('video-play').addEventListener("click", () => {
            this.play();
        });

        // merge children
        for (var index in videoList) {
            this.videoTokens = this.videoTokens.concat(videoList[index]);

            // store a reference table of object parent name to token
            let unCamel = index.replace(/([A-Z])/g, " $1").replace(/([0-9])/g, " $1").replace(/ Of /g, ' of ');
            let indexName = unCamel.charAt(0).toUpperCase() + unCamel.slice(1);

            videoList[index].forEach((item, index) => {
                let tokenRef = item.split(':')[1];
                this.refs[tokenRef] = indexName;
            });
        }

        // filter out uniques
        this.videoTokens = [...new Set(this.videoTokens)];

        this.randomVid();
    },
    play() {
        this.player.play();
        document.getElementById('video-play').style.display = 'none';
        document.getElementById('video-pause').style.display = 'block';
    },
    pause() {
        this.player.pause();
        document.getElementById('video-play').style.display = 'block';
        document.getElementById('video-pause').style.display = 'none';
    },
    randomVid() {

        let token = this.videoTokens[Math.floor(Math.random() * this.videoTokens.length)];

        if (typeof token !== "undefined" && token !== "") {
            this.loadVid(token);
        } else {
            console.error(this.videoTokens, token);
        }
    },
    loadVid(itoken) {
        let webm, mp4, poster;
        let type = itoken.split(':')[0];
        let token = itoken.split(':')[1];

        switch (type) {
            case "gfycat":
                webm = 'http://giant.gfycat.com/' + token + '.webm';
                mp4 = 'http://giant.gfycat.com/' + token + '.mp4';
                poster = 'http://thumbs.gfycat.com/' + token + '-poster.jpg';
                break;
            case "imgur":
                webm = 'http://i.imgur.com/' + token + '.webm';
                mp4 = 'http://i.imgur.com/' + token + '.mp4';
                poster = 'http://i.imgur.com/' + token + '.jpg';
                break;
            default:
                console.error('No valid type "' +type+ '" found for this token : ', token);
                this.randomVid();
                return false;
        }

        this.player.querySelector('source[type="video/webm"]').setAttribute('src', webm);
        this.player.querySelector('source[type="video/mp4"]').setAttribute('src', mp4);
        this.player.setAttribute('poster', poster);

        document.getElementById('video-channel').querySelector('span').innerHTML = this.refs[token];

        this.player.load();
    }
}

module.exports = theVideo;