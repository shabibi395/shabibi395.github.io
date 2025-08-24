// script.js
(function () {
    // Prevent double-binding if script is included twice
    if (window.__navInitDone) return;
    window.__navInitDone = true;

    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function () {
        var btn = document.getElementById('menu-toggle');
        var nav = document.getElementById('nav-links');
        if (!btn || !nav) return;

        function setOpen(open) {
            nav.classList.toggle('show', open);
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
        function toggle() { setOpen(!nav.classList.contains('show')); }

        // iPhone-safe: listen to both touch and click
        btn.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation(); toggle();
        }, { passive: false });
        btn.addEventListener('click', function (e) {
            e.preventDefault(); e.stopPropagation(); toggle();
        });

        // Close when tapping outside
        document.addEventListener('click', function (e) {
            if (!nav.classList.contains('show')) return;
            if (e.target.closest('#nav-links') || e.target.closest('#menu-toggle')) return;
            setOpen(false);
        });

        // Close with ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setOpen(false);
        });
    });
})();

