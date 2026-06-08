(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        mobileNav.classList.toggle("open");
      });
    }

    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[name='q'], input[type='search']");
        var target = form.getAttribute("data-target") || "./search.html";
        var query = input ? input.value.trim() : "";
        var next = query ? target + "?q=" + encodeURIComponent(query) : target;
        window.location.href = next;
      });
    });

    var params = new URLSearchParams(window.location.search);
    var q = params.get("q") || "";
    var searchInput = document.querySelector("[data-site-search]");
    if (searchInput && q) {
      searchInput.value = q;
    }

    var filterInput = document.querySelector("[data-card-filter]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var empty = document.querySelector("[data-empty-state]");
    var selectedCategory = "all";

    function applyCardFilter() {
      if (!cards.length) {
        return;
      }

      var term = normalize(filterInput ? filterInput.value : "");
      var visible = 0;

      cards.forEach(function (card) {
        var searchable = normalize(card.getAttribute("data-search"));
        var category = card.getAttribute("data-category") || "";
        var matchesTerm = !term || searchable.indexOf(term) !== -1;
        var matchesCategory = selectedCategory === "all" || category === selectedCategory;
        var show = matchesTerm && matchesCategory;
        card.style.display = show ? "" : "none";
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? "none" : "block";
      }
    }

    if (filterInput) {
      filterInput.addEventListener("input", applyCardFilter);
      if (q) {
        applyCardFilter();
      }
    }

    document.querySelectorAll("[data-filter-category]").forEach(function (button) {
      button.addEventListener("click", function () {
        selectedCategory = button.getAttribute("data-filter-category") || "all";
        document.querySelectorAll("[data-filter-category]").forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        applyCardFilter();
      });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;

      function showSlide(nextIndex) {
        if (!slides.length) {
          return;
        }

        index = (nextIndex + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("active", slideIndex === index);
        });

        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === index);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          showSlide(index + 1);
        }, 5600);
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          showSlide(dotIndex);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          showSlide(index - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          showSlide(index + 1);
          restart();
        });
      }

      restart();
    }
  });
})();
