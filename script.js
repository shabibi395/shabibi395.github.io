// Mobile nav toggle + accessibility + safety
(function () {
    const btn = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav-links');
    if (!btn || !nav) return;

    // Start hidden on mobile
    nav.classList.remove('show');

    const syncAria = () =>
        btn.setAttribute('aria-expanded', nav.classList.contains('show') ? 'true' : 'false');

    btn.addEventListener('click', () => {
        nav.classList.toggle('show');
        syncAria();
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.classList.contains('show')) return;
        if (!nav.contains(e.target) && !btn.contains(e.target)) {
            nav.classList.remove('show');
            syncAria();
        }
    });

    // Close menu when resizing to desktop
    const mq = window.matchMedia('(min-width: 769px)');
    const handleResize = () => {
        if (mq.matches) {
            nav.classList.remove('show');
            syncAria();
        }
    };
    mq.addEventListener('change', handleResize);
    syncAria();
})();
