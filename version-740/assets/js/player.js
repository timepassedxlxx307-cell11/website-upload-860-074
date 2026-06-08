function initMoviePlayer(source) {
  var video = document.getElementById("movie-player");
  var button = document.getElementById("movie-play-button");
  var attached = false;
  var hls = null;

  if (!video || !button || !source) {
    return;
  }

  function attachSource() {
    if (attached) {
      return;
    }

    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function playVideo() {
    attachSource();
    button.classList.add("is-hidden");

    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        button.classList.remove("is-hidden");
      });
    }
  }

  button.addEventListener("click", playVideo);

  video.addEventListener("click", function () {
    if (video.paused) {
      playVideo();
    }
  });

  video.addEventListener("play", function () {
    button.classList.add("is-hidden");
  });

  window.addEventListener("beforeunload", function () {
    if (hls) {
      hls.destroy();
    }
  });
}
