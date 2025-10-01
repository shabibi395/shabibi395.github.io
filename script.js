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

        // iPhone-safe: prefer pointer, fall back to click
        const tapEvent = ('onpointerup' in window) ? 'pointerup' : 'click';
        btn.addEventListener(tapEvent, function (e) {
            e.preventDefault(); e.stopPropagation(); toggle();
        }, { passive: false });

        // Optional: also listen to click only if we didn't already use click above
        if (tapEvent !== 'click') {
            btn.addEventListener('click', function (e) {
                e.preventDefault(); e.stopPropagation(); toggle();
            });
        }

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

