const videoList = require('./videoList');

const getParams = query => {
    if (!query) {
        return {};
    }

    return (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
            let [key, value] = param.split('=');
            params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
            return params;
        }, {});
};

const theVideo = {
    player: document.getElementById('bg-video'),
    videoTokens: [], // Array of all available video tokens
    videoPlaylist: [], // Array of remaining videos to be played
    refs: {}, // Object with token references in plain text
    gameList: [], // Array of the different games
    filterMode: 'all',
    gameIndexes: [], // Array of applicable games for the filter
    hashInUse: false, // used to determine if we should try to update the hash
    init() {

        // Makes fullscreen video clickable to toggle playstate
        this.player.addEventListener('click', () => {
            if (this.player.paused) {
                this.play();
            } else {
                this.pause();
            }
        });

        // Since we're juggling lots of external video resources, best to have a good error handler
        this.player.addEventListener('error', e => {
            let src = this.player.src.toString();

            if (src.indexOf('giant.gfycat') !== -1 && e.target.error.code === 4) {
                this.player.src = src.replace('giant.', 'fat.');
                console.log('Trying smaller gfycat size.', this.player.src);
            } else {
                let errorCode = e.target.error.code;
                console.error('Video player encountered error code ' + errorCode + '. Readystate ', this.player.readyState);
                switch (errorCode) {
                    case e.target.error.MEDIA_ERR_ABORTED:
                        console.warn('You aborted the video playback.');
                        break;
                    case e.target.error.MEDIA_ERR_NETWORK:
                        console.warn('A network error caused the video download to fail part-way.');
                        break;
                    case e.target.error.MEDIA_ERR_DECODE:
                        console.warn('The video playback was aborted due to a corruption problem or because the video used features your browser did not support.');
                        break;
                    case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        console.warn('The video could not be loaded, either because the server or network failed or because the format is not supported.');
                        break;
                    default:
                        console.warn('An unknown error occurred.');
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

        document.querySelector('#playlists .close').addEventListener("click", () => {
            document.getElementById('playlists').classList.remove('open');
        });

        document.querySelector('#intro .close').addEventListener("click", () => {
            document.getElementById('intro').classList.remove('show');
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

        // Toggle css to control wether or not the video fits or zooms
        // document.getElementById('video-aspect').addEventListener("click", () => {
        //     this.player.classList.toggle('unzoom');
        // });

        document.getElementById('video-gameSelector').addEventListener("click", () => {
            let playlist = document.getElementById('playlists');
            playlist.classList.toggle('open');
            // let visible = playlist.style.display === 'flex';

            // playlist.style.display = visible ? 'none' : 'flex';
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

        for (let index in videoList) {
            let ul = gameListUl;
            let li = document.createElement('li');
            li.setAttribute('data-cat', index);
            li.addEventListener('click', e => {
                if (this.filterMode === 'all') {
                    this.filterMode = 'select';
                    this.gameIndexes = [];
                }

                if (e.currentTarget.className === "on") {
                    if (this.gameIndexes.length > 1) {
                        this.gameIndexes.remove(index);
                    } else {
                        this.filterMode = 'all';
                        this.buildPlaylist();
                        document.getElementById('image-playlist').style.display = 'none';
                    }
                    e.currentTarget.className = '';
                } else {
                    this.gameIndexes.push(index);
                    e.currentTarget.className = 'on';
                }

                if (this.filterMode !== 'all') {
                    let len = this.gameIndexes.length;
                    document.getElementById('image-playlist').style.display = 'block';
                }
                this.buildPlaylist();
                setTimeout(() => {
                    this.randomVid();
                }, 500);

            });
            let indexName = this.unCamelCaseString(index);
            // Show number of videos per game, filter removes nulls/blanks
            let span = document.createElement('span');
            let listLength = videoList[index].filter(n => { return n !== "" }).length;
            if (listLength > 5) {
                span.innerHTML = listLength;

                li.appendChild(document.createTextNode(indexName));
                li.appendChild(span);
                ul.appendChild(li);
            }

        }
        let prams = new getParams();
        let hash = getParams('game');
        
        if (this.gameIndexes.contains(hash)) {
            setTimeout(() => {
                hash.split(',').forEach(game => {
                    document.querySelector('#game-selector [data-cat=' + game + ']').click();
                });
            }, 500);
            this.hashInUse = true;
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

        if (this.hashInUse && this.gameIndexes.length !== 0 && this.gameIndexes.length < 6) {
            window.location.hash = this.gameIndexes.join(',');
        }       
        this.buildImageList();
    },
    buildImageList() {
        let imageListUl = document.getElementById('image-playlist').querySelector('ul');
        let max = 99;
        imageListUl.innerHTML = '';
        this.videoPlaylist.slice(0,max).forEach(index => {
            let li = document.createElement('li');
            let [service, token] = index.split(':');

            li.setAttribute('data-token', token);
            let img;
            if ( service === "gfycat" ) {
                img = '<img src="https://thumbs.gfycat.com/' + token + '-thumb100.jpg"/>';
                li.innerHTML = img;
            }
            if ( service === "imgur" ) {
                img = '<img src="https://i.imgur.com/' + token + 's.jpg"/>';
                li.innerHTML = img;   
            }

            li.addEventListener('click', e => {
                this.loadVid(index);
                document.getElementById('playlists').classList.remove('open');
            });

            imageListUl.appendChild(li);
        });
    },
    buildReferences() {
        for (let index in videoList) {
            let sortedList = videoList[index].slice().filter((n) => { return n != "" });

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
        let unCameler = text.replace(/([A-Z0-9])/g, " $1").replace(/ Of /g, ' of ').replace(/_/g, ': ');
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
        let linkMarkup = '<a href="' + link + '" target="_blank" rel="noopener noreferrer" title="View original on ' + type + '">source</a>';
        document.getElementById('video-channel').innerHTML = this.refs[token] + linkMarkup;

        // Pause
        this.player.pause();
        this.player.src = '';

        // Changing Source tags
        if (type !== "imgur") { // imgur doesn't do webm it seems
            this.player.querySelector('source[type="video/webm"]').src = webm;
        }
        this.player.querySelector('source[type="video/mp4"]').src = mp4;
        this.player.src = mp4; // this is probably the more correct way to update source

        // Load and play
        this.player.load();
        // play event is handled by loadeddata event

        [].forEach.call(document.querySelectorAll('#image-playlist [data-token].on'), function(el) {
            el.classList.remove("on");
        });

        let highlight = document.querySelector('#image-playlist [data-token="' + token + '"]');
        if ( highlight ) highlight.classList.add('on');
    }
}

Array.prototype.remove = function() {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Array.prototype.contains = function(v) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        if (!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
}

module.exports = theVideo;