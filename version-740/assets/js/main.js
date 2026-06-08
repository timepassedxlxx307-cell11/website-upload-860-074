(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var opened = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", opened ? "true" : "false");
      });
    }

    document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      function start() {
        if (timer || slides.length < 2) {
          return;
        }
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5000);
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
          if (timer) {
            window.clearInterval(timer);
            timer = null;
          }
          start();
        });
      });

      show(0);
      start();
    });

    document.querySelectorAll("[data-filter-form]").forEach(function (form) {
      var targetSelector = form.getAttribute("data-target");
      var target = document.querySelector(targetSelector);
      var result = form.parentElement ? form.parentElement.querySelector("[data-result-count]") : null;

      if (!target) {
        return;
      }

      var cards = Array.prototype.slice.call(target.querySelectorAll(".filter-card"));
      var keywordInput = form.querySelector("input[name='keyword']");
      var yearSelect = form.querySelector("select[name='year']");
      var resetButton = form.querySelector("[data-reset-filter]");

      function normalize(value) {
        return String(value || "").trim().toLowerCase();
      }

      function applyFilter() {
        var keyword = normalize(keywordInput ? keywordInput.value : "");
        var year = yearSelect ? yearSelect.value : "";
        var visible = 0;

        cards.forEach(function (card) {
          var text = normalize([
            card.dataset.title,
            card.dataset.tags,
            card.dataset.genre,
            card.dataset.region
          ].join(" "));
          var cardYear = card.dataset.year || "";
          var keywordMatched = !keyword || text.indexOf(keyword) !== -1;
          var yearMatched = !year || cardYear === year;
          var matched = keywordMatched && yearMatched;

          card.classList.toggle("is-hidden", !matched);
          if (matched) {
            visible += 1;
          }
        });

        if (result) {
          result.textContent = "当前显示 " + visible + " 部影片";
        }
      }

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        applyFilter();
      });

      if (keywordInput) {
        keywordInput.addEventListener("input", applyFilter);
      }

      if (yearSelect) {
        yearSelect.addEventListener("change", applyFilter);
      }

      if (resetButton) {
        resetButton.addEventListener("click", function () {
          if (keywordInput) {
            keywordInput.value = "";
          }
          if (yearSelect) {
            yearSelect.value = "";
          }
          applyFilter();
        });
      }
    });
  });
})();
