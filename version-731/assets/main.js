(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupNavigation() {
    var toggle = document.querySelector(".mobile-toggle");
    var panel = document.querySelector(".mobile-panel");

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        var opened = panel.hasAttribute("hidden");
        if (opened) {
          panel.removeAttribute("hidden");
          toggle.setAttribute("aria-expanded", "true");
          toggle.textContent = "×";
        } else {
          panel.setAttribute("hidden", "");
          toggle.setAttribute("aria-expanded", "false");
          toggle.textContent = "☰";
        }
      });
    }

    document.querySelectorAll(".js-global-search-form").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector(".js-global-search");
        var value = input ? input.value.trim() : "";
        var target = "./index.html";
        if (value) {
          target += "?search=" + encodeURIComponent(value);
        }
        window.location.href = target;
      });
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var prev = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    var current = 0;
    var timer = null;

    if (!slides.length) {
      return;
    }

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5800);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide")) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        start();
      });
    }

    start();
  }

  function setupFiltering() {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get("search") || params.get("q") || "").trim();
    var globalInputs = Array.prototype.slice.call(document.querySelectorAll(".js-global-search"));
    var localInputs = Array.prototype.slice.call(document.querySelectorAll(".js-card-search"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .ranking-item"));
    var empty = document.querySelector("[data-empty]");
    var activeFilter = "all";

    globalInputs.forEach(function (input) {
      if (query) {
        input.value = query;
      }
    });

    localInputs.forEach(function (input) {
      if (query) {
        input.value = query;
      }
      input.addEventListener("input", apply);
    });

    document.querySelectorAll(".js-filter-chip").forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.getAttribute("data-filter-value") || "all";
        document.querySelectorAll(".js-filter-chip").forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });
        apply();
      });
    });

    function currentSearchText() {
      var values = localInputs.map(function (input) {
        return input.value.trim();
      }).filter(Boolean);
      if (!values.length && query) {
        values.push(query);
      }
      return values.join(" ").toLowerCase();
    }

    function apply() {
      if (!cards.length) {
        return;
      }

      var words = currentSearchText().split(/\s+/).filter(Boolean);
      var visible = 0;

      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || "").toLowerCase();
        var matchesSearch = words.every(function (word) {
          return text.indexOf(word) !== -1;
        });
        var matchesFilter = activeFilter === "all" || text.indexOf(activeFilter.toLowerCase()) !== -1;
        var show = matchesSearch && matchesFilter;
        card.hidden = !show;
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    apply();
  }

  window.initMoviePlayer = function (source) {
    var video = document.getElementById("movieVideo");
    var trigger = document.getElementById("playTrigger");
    var box = document.getElementById("playerBox");
    var status = document.getElementById("playerStatus");

    if (!video || !source) {
      return;
    }

    function setStatus(message) {
      if (status) {
        status.textContent = message || "";
      }
    }

    function bindSource() {
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setStatus("播放暂时不可用，请稍后重试");
          }
        });
        video._hls = hls;
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        return;
      }

      video.src = source;
    }

    function startPlayback() {
      setStatus("");
      video.controls = true;
      if (trigger) {
        trigger.classList.add("is-hidden");
      }
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {
          if (trigger) {
            trigger.classList.remove("is-hidden");
          }
        });
      }
    }

    bindSource();

    if (trigger) {
      trigger.addEventListener("click", startPlayback);
    }

    if (box) {
      box.addEventListener("click", function (event) {
        if (event.target === box) {
          startPlayback();
        }
      });
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener("play", function () {
      if (trigger) {
        trigger.classList.add("is-hidden");
      }
    });
  };

  ready(function () {
    setupNavigation();
    setupHero();
    setupFiltering();
  });
})();
