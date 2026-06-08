(function () {
    var data = window.MOVIE_SEARCH_DATA || [];
    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');
    var summary = document.getElementById('searchSummary');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function card(movie) {
        return '<a class="movie-card" href="' + escapeHtml(movie.url) + '">' +
            '<span class="poster-frame">' +
                '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
                '<span class="poster-shade"></span>' +
                '<span class="duration-badge">' + escapeHtml(movie.duration) + '</span>' +
                '<span class="play-badge">▶</span>' +
            '</span>' +
            '<span class="movie-card-body">' +
                '<span class="category-badge">' + escapeHtml(movie.category) + '</span>' +
                '<strong>' + escapeHtml(movie.title) + '</strong>' +
                '<span class="movie-desc">' + escapeHtml(movie.description) + '</span>' +
                '<span class="movie-meta">' +
                    '<span>' + escapeHtml(movie.year) + '</span>' +
                    '<span>' + escapeHtml(movie.region) + '</span>' +
                    '<span>' + escapeHtml(movie.type) + '</span>' +
                '</span>' +
            '</span>' +
        '</a>';
    }

    function runSearch(query) {
        var keyword = normalize(query);
        var matched;

        if (!keyword) {
            matched = data.slice(0, 60);
            summary.textContent = '推荐展示 60 部影片，可输入关键词继续检索。';
        } else {
            matched = data.filter(function (movie) {
                return normalize([
                    movie.title,
                    movie.description,
                    movie.category,
                    movie.genre,
                    movie.region,
                    movie.type,
                    movie.year,
                    movie.tags
                ].join(' ')).indexOf(keyword) !== -1;
            });
            summary.textContent = '关键词“' + query + '”找到 ' + matched.length + ' 个结果。';
        }

        results.innerHTML = matched.slice(0, 240).map(card).join('');
    }

    if (input) {
        input.value = initialQuery;
        input.addEventListener('input', function () {
            runSearch(input.value);
        });
    }

    if (results && summary) {
        runSearch(initialQuery);
    }
}());
