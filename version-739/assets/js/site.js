(function () {
    var navButton = document.querySelector('[data-nav-toggle]');
    var navMenu = document.querySelector('[data-nav-menu]');

    if (navButton && navMenu) {
        navButton.addEventListener('click', function () {
            navMenu.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var index = 0;
        var timer = null;

        function show(next) {
            if (!slides.length) {
                return;
            }

            index = (next + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function run() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                run();
            });
        });

        show(0);
        run();
    }

    var input = document.querySelector('[data-search-input]');
    var clear = document.querySelector('[data-search-clear]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card-list] .movie-card'));
    var result = document.querySelector('[data-result-count]');

    function filterCards() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var visible = 0;

        cards.forEach(function (card) {
            var text = [
                card.getAttribute('data-title') || '',
                card.getAttribute('data-meta') || '',
                card.getAttribute('data-tags') || '',
                card.textContent || ''
            ].join(' ').toLowerCase();
            var match = !keyword || text.indexOf(keyword) !== -1;

            card.classList.toggle('is-hidden', !match);

            if (match) {
                visible += 1;
            }
        });

        if (result) {
            result.textContent = visible + ' 部';
        }
    }

    if (input) {
        input.addEventListener('input', filterCards);
    }

    if (clear && input) {
        clear.addEventListener('click', function () {
            input.value = '';
            filterCards();
            input.focus();
        });
    }
})();
