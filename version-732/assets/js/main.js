(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }

    document.addEventListener("DOMContentLoaded", callback);
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-nav]");

    if (!toggle || !menu) {
      return;
    }

    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var carousel = document.querySelector("[data-hero-carousel]");

    if (!carousel) {
      return;
    }

    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
    var prev = carousel.querySelector("[data-hero-prev]");
    var next = carousel.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupSearch() {
    var input = document.querySelector("[data-filter-input]");
    var grid = document.querySelector("[data-filter-grid]");
    var empty = document.querySelector("[data-empty-result]");

    if (!input || !grid) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var initialValue = params.get("q") || "";
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));

    function filter(value) {
      var keyword = value.trim().toLowerCase();
      var visible = 0;

      cards.forEach(function (card) {
        var source = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-tags") || "",
          card.getAttribute("data-region") || "",
          card.getAttribute("data-year") || "",
          card.textContent || ""
        ].join(" ").toLowerCase();
        var matched = !keyword || source.indexOf(keyword) !== -1;

        card.style.display = matched ? "" : "none";

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    input.value = initialValue;
    input.addEventListener("input", function () {
      filter(input.value);
    });
    filter(initialValue);
  }

  function setPlayerMessage(message) {
    var element = document.querySelector("[data-player-message]");

    if (!element) {
      return;
    }

    element.textContent = message;
    element.classList.add("is-visible");
  }

  window.initMoviePlayer = function (streamUrl) {
    ready(function () {
      var video = document.getElementById("movie-player");
      var cover = document.getElementById("player-cover");

      if (!video || !streamUrl) {
        return;
      }

      function bindSource() {
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false
          });

          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setPlayerMessage("视频暂时无法加载，请稍后重试");
            }
          });
          return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = streamUrl;
          return;
        }

        setPlayerMessage("当前环境暂时无法播放，请稍后重试");
      }

      function playVideo() {
        if (cover) {
          cover.classList.add("is-hidden");
        }

        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            setPlayerMessage("点击播放按钮即可继续观看");
          });
        }
      }

      bindSource();

      if (cover) {
        cover.addEventListener("click", playVideo);
      }

      video.addEventListener("click", function () {
        if (video.paused) {
          playVideo();
        }
      });

      video.addEventListener("play", function () {
        if (cover) {
          cover.classList.add("is-hidden");
        }
      });
    });
  };

  ready(function () {
    setupMenu();
    setupHero();
    setupSearch();
  });
}());
