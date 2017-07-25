const videoList = require('./videoList');

const theVideo = {
    player: document.getElementById('bg-video'),
    videoTokens: [], // Array of all available tokens
    videoPlaylist: [], // Array of remaining items to be played
    refs: {}, // Allows a plain text reference to a token's game
    gameList: [], // reference of all games
    filterMode: 'all',
    gameIndexes: [], // used to determine which games we want to filter on
    init() {
        // Makes fullscreen video clickable to toggle playstate
        this.player.addEventListener('click', () => {
            if (this.player.paused) {
                this.play();
            } else {
                this.pause();
            }
        });

        this.player.addEventListener('error', (e) => {
            let src = this.player.src.toString();

            if (src.indexOf('giant.gfycat') !== -1 && e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED) {
                console.log('Downgrading link from giant.gfycat to fat.gfycat');
                this.player.src = src.replace('giant.', 'fat.');
            } else {

                console.error('Video player encountered an error. Readystate ', this.player.readyState);

                switch (e.target.error.code) {
                    case e.target.error.MEDIA_ERR_ABORTED:
                        console.warn(e.target.error.code, 'You aborted the video playback.');
                        break;
                    case e.target.error.MEDIA_ERR_NETWORK:
                        console.warn(e.target.error.code, 'A network error caused the video download to fail part-way.');
                        break;
                    case e.target.error.MEDIA_ERR_DECODE:
                        console.warn(e.target.error.code, 'The video playback was aborted due to a corruption problem or because the video used features your browser did not support.');
                        break;
                    case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        console.warn(e.target.error.code, 'The video could not be loaded, either because the server or network failed or because the format is not supported.');
                        break;
                    default:
                        console.warn(e.target.error.code, 'An unknown error occurred.');
                        break;
                }

                this.randomVid();
            }
        });

        this.player.addEventListener('dblclick', () => {
            this.randomVid();
        });

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

        // Avoid trying to force video state while it's loading another
        document.getElementById('video-random').addEventListener("click", () => {
            if (this.player.readyState == 4) {
                this.randomVid();
            } else {
                console.error('Video not ready for randomVid(). Readystate', this.player.readyState);
                return false;
            }
        });

        // Toggle minHeight and width to control wether or not the video fits or zooms
        document.getElementById('video-aspect').addEventListener("click", () => {
            this.player.classList.toggle('unzoom');
        });

        document.getElementById('video-gameSelector').addEventListener("click", () => {
            let playlist = document.getElementById('video-playlist');
            let visible = playlist.style.display === 'block';

            playlist.style.display = (visible) ? 'none' : 'block';
        });

        // Lets not waste bandwidth while window is out of focus
        window.addEventListener('focus', () => {
            this.play();
        });

        window.addEventListener('blur', () => {
            this.pause();
        });

        this.buildReferences();
        this.buildGameSelector();
        this.buildPlaylist();
        this.randomVid();

        console.log('[bgplayer] init.', this.videoTokens.length, 'videos.', this.gameList.length, 'games.');
    },
    buildGameSelector() {
        let gameListUl = document.getElementById('video-playlist').querySelector('ul');
        gameListUl.innerHTML = '';
        let statusSpan = document.getElementById('video-playlist').querySelector('.header span');

        for (let index in videoList) {
            let ul = gameListUl;
            let li = document.createElement('li');
            li.setAttribute('data-cat', index);
            li.addEventListener('click', (e) => {
                if (this.filterMode === 'all') {
                    this.filterMode = 'select';
                    statusSpan.innerHTML = 'select';
                    this.gameIndexes = [];
                }

                if (e.currentTarget.className === "on") {
                    if (this.gameIndexes.length > 1) {
                        this.gameIndexes.remove(index);
                    } else {
                        this.filterMode = 'all';
                        statusSpan.innerHTML = 'all';
                        this.buildPlaylist();
                    }
                    e.currentTarget.className = '';
                } else {
                    this.gameIndexes.push(index);
                    e.currentTarget.className = 'on';
                }

                if (this.filterMode !== 'all') {
                    let len = this.gameIndexes.length;
                    statusSpan.innerHTML = len + ' game' + ((len > 1) ? 's' : '');
                }
                this.buildPlaylist();
                setTimeout(() => {
                    this.randomVid();
                }, 500);

            });
            let indexName = this.unCamelCaseString(index);
            // Show number of videos per game, filter removes nulls/blanks
            let span = document.createElement('span');
            span.innerHTML = videoList[index].filter((n) => { return n !== "" }).length;

            li.appendChild(document.createTextNode(indexName));
            li.appendChild(span);
            ul.appendChild(li);
        }

    },
    buildPlaylist() {
        this.videoPlaylist = [];
        for (let index in videoList) {
            if (this.filterMode === "all" || (this.filterMode === "select" && this.gameIndexes.contains(index))) {
                this.videoPlaylist = this.videoPlaylist.concat(videoList[index]);
            }
        }
        // filter out uniques and nulls
        this.videoPlaylist = [...new Set(this.videoPlaylist)];
        this.videoPlaylist = this.videoPlaylist.filter((n) => { return n !== "" });
    },
    buildReferences() {
        for (let index in videoList) {
            let sortedList = videoList[index].slice();
            sortedList = sortedList.filter((n) => { return n != "" });

            this.videoTokens = this.videoTokens.concat(sortedList);
            // store a reference table of object parent name to token

            let indexName = this.unCamelCaseString(index);
            this.gameList.push(indexName);
            if (this.filterMode === "all") {
                this.gameIndexes.push(index);
            }
            videoList[index].forEach((item, index) => {
                let tokenRef = item.split(':')[1];
                this.refs[tokenRef] = indexName;

            });
        }
    },
    unCamelCaseString(text) {
        let unCameler = text.replace(/([A-Z])/g, " $1").replace(/([0-9])/g, " $1").replace(/ Of /g, ' of ');
        unCameler = unCameler.charAt(0).toUpperCase() + unCameler.slice(1);
        return unCameler.toString();
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
        if (typeof this.videoPlaylist === "undefined" || this.videoPlaylist.length < 3) {
            this.buildPlaylist();
        }

        let random = Math.floor(Math.random() * this.videoPlaylist.length);
        let token = this.videoPlaylist[random];
        let smalltoken = token.split(':')[1];

        if (typeof token !== "undefined" && token !== "") {
            this.videoPlaylist.remove(token);
            this.loadVid(token);
        } else {
            console.error('Null token. this.videoPlaylist[' + random + '] length :', this.videoPlaylist.length);
            console.error(this.videoPlaylist);
            this.randomVid();
        }
    },
    loadVid(itoken) {
        let webm, mp4, poster, link;
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
                console.error('No valid type "' + type + '" found for this token : ', token);
                this.randomVid();
                return false;
        }
        this.player.poster = '';
        this.player.poster = poster;

        if (type == "imgur ") {
            link = 'https://imgur.com/' + token;
        }
        if (type === "gfycat") {
            link = 'https://gfycat.com/gifs/detail/' + token;
        }
        let linkMarkup = '<a href="' + link + '" target="_blank" rel="noopener noreferrer">' + type + '</a>';
        document.getElementById('video-channel').querySelector('span').innerHTML = this.refs[token] + ' - ' + linkMarkup;

        // Pause
        this.player.pause();
        this.player.src = '';

        // Changing Source tags
        if (type !== "imgur") { // imgur doesn't do webm it seems
            this.player.querySelector('source[type="video/webm"]').src = webm;
        }
        this.player.querySelector('source[type="video/mp4"]').src = mp4;

        // this is probably the more correct way to update source
        this.player.src = mp4;

        // Load and play
        this.player.load();
        // play event is handled by loadeddata event
    }
}

module.exports = theVideo;