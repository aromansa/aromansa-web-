(function () {
    'use strict';

    function initCarousels() {
        var buttons = document.querySelectorAll('[data-carousel-target]');
        buttons.forEach(function (button) {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                var targetSelector = button.getAttribute('data-carousel-target');
                var track = document.querySelector(targetSelector);
                if (!track) return;

                var direction = Number(button.getAttribute('data-direction')) || 1;
                var cards = track.querySelectorAll('.bestseller-card, .testimonial-card-stunning, .category-card-stunning');
                var cardWidth = 340;
                if (cards.length > 0) {
                    var rect = cards[0].getBoundingClientRect();
                    cardWidth = rect.width + 20;
                }

                var scrollAmount = cardWidth * direction;
                var maxScroll = track.scrollWidth - track.clientWidth;
                var currentScroll = track.scrollLeft;

                // Circular wrap around for smooth continuous browsing
                if (direction > 0 && currentScroll >= maxScroll - 25) {
                    track.scrollTo({ left: 0, behavior: 'smooth' });
                } else if (direction < 0 && currentScroll <= 25) {
                    track.scrollTo({ left: maxScroll, behavior: 'smooth' });
                } else {
                    track.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousels);
    } else {
        initCarousels();
    }
})();
