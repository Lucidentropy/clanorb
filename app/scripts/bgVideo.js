const videoList = require('./videoList');

const theVideo = {
    player: document.getElementById('bg-video'),
    videoTokens: [], // Array of all available tokens
    videoPlaylist: [], // Array of remaining items to be played
    refs: {}, // Allows a plain text reference to a token's game
    gameList: [],
    filterMode: 'all',
    gameIndexes: [],
    init() {
        // Makes fullscreen video clickable to toggle playstate
        this.player.addEventListener('click', () => {
            if (this.player.paused) {
                this.play();
            } else {
                this.pause();
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
            let styles = window.getComputedStyle(this.player);
            let getHeight = styles.getPropertyValue('min-height');

            if (getHeight === "100%") {
                this.player.style.minHeight = "auto";
                this.player.style.width = "100%";
            } else {
                this.player.style.minHeight = "100%";
                this.player.style.width = "auto";
            }
        });

        document.getElementById('video-gameSelector').addEventListener("click", () => {
            let playlist = document.getElementById('video-playlist');
            let visible = playlist.style.display === 'block';
            
            if ( visible ) {
                playlist.style.display = 'none';
            } else {
                playlist.style.display = 'block';
            }

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
                    statusSpan.innerHTML = len + ' game' + ((len > 1) ? 's' :'');
                }
                this.buildPlaylist();
                this.randomVid();

            });
            let unCamel = index.replace(/([A-Z])/g, " $1").replace(/([0-9])/g, " $1").replace(/ Of /g, ' of ');
            let indexName = unCamel.charAt(0).toUpperCase() + unCamel.slice(1);
            let span = document.createElement('span');
            span.innerHTML = videoList[index].length;

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
        // filter out uniques
        this.videoPlaylist = [...new Set(this.videoPlaylist)];
    },
    buildReferences() {
        for (let index in videoList) {
            this.videoTokens = this.videoTokens.concat(videoList[index]);
            // store a reference table of object parent name to token
            let unCamel = index.replace(/([A-Z])/g, " $1").replace(/([0-9])/g, " $1").replace(/ Of /g, ' of ');
            let indexName = unCamel.charAt(0).toUpperCase() + unCamel.slice(1);

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
        if (typeof this.videoPlaylist === "undefined" || this.videoPlaylist.length < 1) {
            this.buildPlaylist();
        }

        let random = Math.floor(Math.random() * this.videoPlaylist.length);
        let token = this.videoPlaylist[random];
        let smalltoken = token.split(':')[1];

        this.videoPlaylist.remove(token);

        if (typeof token !== "undefined" && token !== "") {
            this.loadVid(token);
        } else {
            console.error('Error with token : [' + token + ']', this.videoPlaylist.length, random, this.refs[smalltoken]);
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

        // Change Source
        if (type !== "imgur") { // imgur doesn't do webm it seems
            this.player.querySelector('source[type="video/webm"]').src = webm;
        }
        this.player.querySelector('source[type="video/mp4"]').src = mp4;

        this.player.src = mp4;

        // Re-load and play
        this.player.load();
        // play event is handled by loadeddata event
    }
}

module.exports = theVideo;