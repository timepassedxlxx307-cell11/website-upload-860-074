(function () {
    function all(selector, context) {
        return Array.prototype.slice.call((context || document).querySelectorAll(selector));
    }

    function setupMenu() {
        var button = document.querySelector('.menu-button');
        var nav = document.querySelector('.mobile-nav');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            var isOpen = nav.classList.toggle('open');
            button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    function setupHero() {
        var hero = document.querySelector('.hero');
        if (!hero) {
            return;
        }
        var slides = all('.hero-slide', hero);
        var dots = all('.hero-dot', hero);
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                start();
            });
        });
        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupFilters() {
        all('.filter-panel').forEach(function (panel) {
            var section = panel.parentElement;
            var input = panel.querySelector('.site-search-input');
            var selects = all('.filter-select', panel);
            var empty = panel.querySelector('.empty-state');
            var cards = all('.movie-card', section);

            function normalize(value) {
                return String(value || '').toLowerCase().trim();
            }

            function apply() {
                var keyword = normalize(input ? input.value : '');
                var visible = 0;
                var filters = selects.map(function (select) {
                    return {
                        key: select.getAttribute('data-filter'),
                        value: normalize(select.value)
                    };
                });

                cards.forEach(function (card) {
                    var text = normalize([
                        card.getAttribute('data-title'),
                        card.getAttribute('data-tags'),
                        card.getAttribute('data-region'),
                        card.getAttribute('data-type'),
                        card.getAttribute('data-year')
                    ].join(' '));
                    var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
                    var matchedFilters = filters.every(function (filter) {
                        if (!filter.value) {
                            return true;
                        }
                        return normalize(card.getAttribute('data-' + filter.key)).indexOf(filter.value) !== -1;
                    });
                    var matched = matchedKeyword && matchedFilters;
                    card.classList.toggle('hidden-by-filter', !matched);
                    if (matched) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }

            if (input) {
                input.addEventListener('input', apply);
            }
            selects.forEach(function (select) {
                select.addEventListener('change', apply);
            });
            apply();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();
