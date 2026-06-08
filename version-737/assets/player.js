import { H as Hls } from "./hls-vendor-dru42stk.js";

document.addEventListener("DOMContentLoaded", function () {
  Array.from(document.querySelectorAll(".player-shell")).forEach(function (shell) {
    var video = shell.querySelector("video");
    var button = shell.querySelector(".player-start");
    var source = shell.getAttribute("data-video-url");
    var ready = false;
    var hls = null;

    if (!video || !button || !source) {
      return;
    }

    function attach() {
      if (ready) {
        return Promise.resolve();
      }

      ready = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        return Promise.resolve();
      }

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });

        hls.loadSource(source);
        hls.attachMedia(video);

        return new Promise(function (resolve) {
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            resolve();
          });
          video.addEventListener("canplay", resolve, { once: true });
        });
      }

      video.src = source;
      return Promise.resolve();
    }

    function start() {
      button.classList.add("is-hidden");
      attach()
        .then(function () {
          return video.play();
        })
        .catch(function () {
          button.classList.remove("is-hidden");
        });
    }

    button.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
});
