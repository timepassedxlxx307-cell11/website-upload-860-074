(function () {
    window.initVideoPlayer = function (videoId, sourceUrl) {
        var video = document.getElementById(videoId);
        if (!video || !sourceUrl) {
            return;
        }
        var shell = video.closest('.player-shell');
        var overlay = shell ? shell.querySelector('.player-overlay') : null;
        var playButton = overlay ? overlay.querySelector('.big-play') : null;
        var loaded = false;
        var hlsInstance = null;

        function load() {
            if (loaded) {
                return;
            }
            loaded = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = sourceUrl;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(sourceUrl);
                hlsInstance.attachMedia(video);
                return;
            }
            video.src = sourceUrl;
        }

        function start(event) {
            if (event) {
                event.preventDefault();
            }
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            load();
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener('click', start);
        }
        if (playButton) {
            playButton.addEventListener('click', start);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
})();
