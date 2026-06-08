import { H as Hls } from "./hls-vendor-dru42stk.js";

export function initMoviePlayer(source) {
    var video = document.getElementById("movie-player");
    var cover = document.getElementById("play-cover");
    var hls = null;
    var isReady = false;

    if (!video || !source) {
        return;
    }

    function attachSource() {
        if (isReady) {
            return;
        }

        isReady = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            return;
        }

        if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            return;
        }

        video.src = source;
    }

    function hideCover() {
        if (cover) {
            cover.classList.add("is-hidden");
        }
    }

    function showCover() {
        if (cover) {
            cover.classList.remove("is-hidden");
        }
    }

    function playVideo() {
        attachSource();
        hideCover();
        video.setAttribute("controls", "controls");

        var promise = video.play();

        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {
                showCover();
            });
        }
    }

    if (cover) {
        cover.addEventListener("click", playVideo);
    }

    video.addEventListener("click", function () {
        if (video.paused) {
            playVideo();
        }
    });

    video.addEventListener("play", hideCover);
    video.addEventListener("pause", function () {
        if (video.currentTime === 0 || video.ended) {
            showCover();
        }
    });

    window.addEventListener("pagehide", function () {
        if (hls) {
            hls.destroy();
            hls = null;
        }
    });
}
