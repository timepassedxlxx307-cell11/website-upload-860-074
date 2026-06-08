(function () {
    var shells = Array.prototype.slice.call(document.querySelectorAll('.video-shell'));

    shells.forEach(function (shell) {
        var video = shell.querySelector('video');
        var button = shell.querySelector('.video-start');

        if (!video || !button) {
            return;
        }

        var stream = video.getAttribute('data-stream');
        var hls = null;
        var loaded = false;

        function playVideo() {
            var request = video.play();

            if (request && typeof request.catch === 'function') {
                request.catch(function () {
                    video.controls = true;
                });
            }
        }

        function start() {
            if (!stream) {
                return;
            }

            shell.classList.add('is-playing');
            video.controls = true;

            if (loaded) {
                playVideo();
                return;
            }

            loaded = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                video.addEventListener('loadedmetadata', playVideo, { once: true });
                video.load();
                playVideo();
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MEDIA_ATTACHED, function () {
                    hls.loadSource(stream);
                });
                hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
                return;
            }

            video.src = stream;
            video.load();
            playVideo();
        }

        button.addEventListener('click', start);

        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });

        video.addEventListener('play', function () {
            shell.classList.add('is-playing');
        });

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
