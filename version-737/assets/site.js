document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.querySelector(".menu-button");
  var mobilePanel = document.querySelector(".mobile-panel");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      var expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", expanded ? "false" : "true");
      mobilePanel.classList.toggle("is-open", !expanded);
      menuButton.textContent = expanded ? "☰" : "×";
    });
  }

  var slides = Array.from(document.querySelectorAll(".hero-slide"));
  var dots = Array.from(document.querySelectorAll(".hero-dot"));
  var current = 0;

  function setSlide(index) {
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

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      setSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      setSlide(current + 1);
    }, 5000);
  }

  var localFilter = document.querySelector("[data-local-filter]");
  var localCards = Array.from(document.querySelectorAll("[data-title][data-genre]"));
  var emptyMessage = document.querySelector(".empty-message");

  if (localFilter && localCards.length) {
    localFilter.addEventListener("input", function () {
      var query = localFilter.value.trim().toLowerCase();
      var visible = 0;

      localCards.forEach(function (card) {
        var text = [
          card.dataset.title,
          card.dataset.genre,
          card.dataset.region,
          card.dataset.year,
          card.dataset.type
        ].join(" ").toLowerCase();
        var matched = !query || text.indexOf(query) !== -1;
        card.style.display = matched ? "" : "none";

        if (matched) {
          visible += 1;
        }
      });

      if (emptyMessage) {
        emptyMessage.classList.toggle("is-visible", visible === 0);
      }
    });
  }

  var searchPage = document.querySelector("[data-search-page]");

  if (searchPage) {
    var params = new URLSearchParams(window.location.search);
    var input = searchPage.querySelector("input[name='q']");
    var resultGrid = searchPage.querySelector(".search-results .grid");
    var searchEmpty = searchPage.querySelector(".empty-message");
    var q = params.get("q") || "";

    if (input) {
      input.value = q;
    }

    function renderResults(query, items) {
      if (!resultGrid) {
        return;
      }

      var normalized = query.trim().toLowerCase();
      var matches = items.filter(function (item) {
        if (!normalized) {
          return false;
        }

        return [item.title, item.genre, item.region, item.year, item.type, item.tags].join(" ").toLowerCase().indexOf(normalized) !== -1;
      }).slice(0, 120);

      resultGrid.innerHTML = matches.map(function (item) {
        return "<article class="movie-card" data-title="" + escapeHtml(item.title) + "" data-genre="" + escapeHtml(item.genre) + "" data-region="" + escapeHtml(item.region) + "" data-year="" + escapeHtml(item.year) + "" data-type="" + escapeHtml(item.type) + ""><a class="movie-card-link" href="./" + item.file + ""><span class="movie-cover"><img src="" + item.image + "" alt="" + escapeHtml(item.title) + "" loading="lazy"><span class="movie-badge">" + escapeHtml(item.genre) + "</span><span class="movie-play">▶</span></span><span class="movie-card-body"><span class="movie-meta-line">" + escapeHtml(item.region) + " · " + escapeHtml(item.year) + " · " + escapeHtml(item.type) + "</span><strong>" + escapeHtml(item.title) + "</strong><span class="movie-desc">" + escapeHtml(item.desc) + "</span><span class="movie-views">" + escapeHtml(item.views) + " 次观看</span></span></a></article>";
      }).join("");

      if (searchEmpty) {
        searchEmpty.classList.toggle("is-visible", matches.length === 0);
      }
    }

    fetch("./assets/search-index.json")
      .then(function (response) {
        return response.json();
      })
      .then(function (items) {
        renderResults(q, items);
      });
  }
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
