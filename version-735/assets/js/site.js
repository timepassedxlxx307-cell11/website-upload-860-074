(function () {
    var menuButton = document.querySelector('.nav-toggle');
    var mobileMenu = document.querySelector('.mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            var isOpen = mobileMenu.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', String(isOpen));
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        var showSlide = function (index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        };

        var startAuto = function () {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5000);
        };

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                window.clearInterval(timer);
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                startAuto();
            });
        });

        showSlide(0);
        startAuto();
    }

    document.querySelectorAll('[data-scroll-left], [data-scroll-right]').forEach(function (button) {
        button.addEventListener('click', function () {
            var targetId = button.getAttribute('data-scroll-left') || button.getAttribute('data-scroll-right');
            var target = document.getElementById(targetId);
            var direction = button.hasAttribute('data-scroll-left') ? -1 : 1;

            if (target) {
                target.scrollBy({
                    left: direction * 420,
                    behavior: 'smooth'
                });
            }
        });
    });

    var filterInput = document.querySelector('[data-filter-input]');
    var filterList = document.querySelector('[data-filter-list]');
    var resultLine = document.querySelector('[data-result-line]');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));

    if (filterInput && filterList) {
        var cards = Array.prototype.slice.call(filterList.querySelectorAll('[data-search]'));
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';

        filterInput.value = initialQuery;

        var applyFilter = function (value) {
            var query = (value || '').trim().toLowerCase();
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = (card.getAttribute('data-search') || '').toLowerCase();
                var matched = !query || haystack.indexOf(query) !== -1;

                card.classList.toggle('is-hidden-by-filter', !matched);

                if (matched) {
                    visible += 1;
                }
            });

            if (resultLine) {
                resultLine.textContent = query ? '正在展示 “' + query + '” 的匹配结果' : '正在展示匹配结果';
            }
        };

        filterInput.addEventListener('input', function () {
            applyFilter(filterInput.value);
        });

        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                filterButtons.forEach(function (item) {
                    item.classList.remove('is-active');
                });

                button.classList.add('is-active');
                filterInput.value = button.getAttribute('data-filter-value') || '';
                applyFilter(filterInput.value);
            });
        });

        applyFilter(initialQuery);
    }

    document.querySelectorAll('[data-player]').forEach(function (player) {
        var video = player.querySelector('video');
        var startButton = player.querySelector('[data-start-player]');
        var source = player.getAttribute('data-source');
        var hlsInstance = null;
        var hasStarted = false;

        var playVideo = function () {
            if (!video || !source) {
                return;
            }

            if (startButton) {
                startButton.classList.add('is-hidden');
            }

            video.controls = true;

            if (hasStarted) {
                video.play().catch(function () {});
                return;
            }

            hasStarted = true;

            if (video.canPlayType('application/vnd.apple.mpegurl') || video.canPlayType('application/x-mpegURL')) {
                video.src = source;
                video.play().catch(function () {});
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });

                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
                return;
            }

            video.src = source;
            video.play().catch(function () {});
        };

        if (startButton) {
            startButton.addEventListener('click', function (event) {
                event.preventDefault();
                playVideo();
            });
        }

        video.addEventListener('click', function () {
            if (!hasStarted) {
                playVideo();
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
})();
