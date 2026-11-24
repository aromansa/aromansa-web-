(function () {
    'use strict';

    var visual = document.querySelector('.hero-product-visual');
    var image = visual && visual.querySelector('img');
    var hero = document.querySelector('.hero-stunning');
    var nav = document.getElementById('nav');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var finePointer = window.matchMedia('(pointer: fine)');

    if (nav) {
        var updateNav = function () {
            nav.classList.toggle('header-scrolled', window.scrollY > 100);
        };

        updateNav();
        window.addEventListener('scroll', updateNav, { passive: true });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape' || !document.body.classList.contains('mobile-nav-active')) return;

        var toggle = document.getElementById('mobile-nav-toggle');
        if (toggle) {
            toggle.click();
            toggle.focus();
        }
    });

    if (!visual || !image || !hero || reducedMotion.matches || !finePointer.matches) return;

    var frame = 0;

    function resetParallax() {
        image.style.setProperty('--hero-parallax-x', '0px');
        image.style.setProperty('--hero-parallax-y', '0px');
    }

    hero.addEventListener('pointermove', function (event) {
        if (event.pointerType !== 'mouse' || reducedMotion.matches) return;

        if (frame) window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(function () {
            var bounds = hero.getBoundingClientRect();
            var offsetX = (event.clientX - bounds.left) / bounds.width - .5;
            var offsetY = (event.clientY - bounds.top) / bounds.height - .5;

            image.style.setProperty('--hero-parallax-x', (offsetX * 30).toFixed(1) + 'px');
            image.style.setProperty('--hero-parallax-y', (offsetY * 30).toFixed(1) + 'px');
        });
    });

    hero.addEventListener('pointerleave', resetParallax);
    reducedMotion.addEventListener('change', function (event) {
        if (event.matches) {
            if (frame) window.cancelAnimationFrame(frame);
            resetParallax();
        }
    });
}());
