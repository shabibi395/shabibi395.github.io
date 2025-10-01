// script.js — DB Code Explorer mobile nav (iPhone-safe, v13)
(function () {
    if (window.__dbcxNavInit) return;
    window.__dbcxNavInit = true;

    function ready(fn) {
        if (document.readyState !== "loading") fn();
        else document.addEventListener("DOMContentLoaded", fn, { once: true });
    }

    ready(function () {
        var btn = document.getElementById("menu-toggle");
        var nav = document.getElementById("nav-links");
        if (!btn || !nav) return;

        var lastToggleAt = 0;
        var GUARD = 800; // ms; protects against iOS follow-up clicks

        function isOpen() { return nav.classList.contains("show"); }

        function setOpen(open) {
            nav.classList.toggle("show", open);
            btn.setAttribute("aria-expanded", String(open));
            document.documentElement.classList.toggle("overflow-hidden", open);
            document.body.classList.toggle("overflow-hidden", open);
        }

        function toggle() { setOpen(!isOpen()); }
        function toggleWithStamp() { toggle(); lastToggleAt = Date.now(); }

        // Minimal .closest() fallback
        function within(el, selector) {
            for (var n = el; n && n !== document; n = n.parentElement) {
                if (n.matches && n.matches(selector)) return true;
            }
            return false;
        }

        // Prefer touch on iOS; else pointer; else click
        var tapEvent = ("ontouchend" in window) ? "touchend"
            : ("onpointerup" in window) ? "pointerup"
                : "click";

        btn.addEventListener(tapEvent, function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleWithStamp();
        }, { passive: false });

        // iOS fires a synthetic click after touch/pointer — swallow it
        btn.addEventListener("click", function (e) {
            if (Date.now() - lastToggleAt < GUARD) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, { passive: false });

        // Close when tapping/clicking outside (capture early)
        var outsideEvent = ("onpointerdown" in window) ? "pointerdown" : "touchstart";
        document.addEventListener(outsideEvent, function (e) {
            if (!isOpen()) return;
            if (Date.now() - lastToggleAt < GUARD) return;
            var t = e.target;
            if (t === btn || within(t, "#menu-toggle") || within(t, "#nav-links")) return;
            setOpen(false);
        }, true);

        // Fallback close on document click (if above didn’t fire)
        document.addEventListener("click", function (e) {
            if (!isOpen()) return;
            if (Date.now() - lastToggleAt < GUARD) return;
            if (within(e.target, "#menu-toggle") || within(e.target, "#nav-links")) return;
            setOpen(false);
        });

        // Close on Escape
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && isOpen()) setOpen(false);
        });

        // Close after tapping a nav link
        Array.prototype.forEach.call(nav.querySelectorAll("a"), function (a) {
            a.addEventListener("click", function () { if (isOpen()) setOpen(false); });
            a.addEventListener("touchend", function () { if (isOpen()) setOpen(false); }, { passive: true });
        });

        // Reset if switching to desktop
        var mq = window.matchMedia("(min-width: 769px)");
        function onMQ(e) { if (e.matches) setOpen(false); }
        if (mq.addEventListener) mq.addEventListener("change", onMQ);
        else mq.addListener(onMQ);

        btn.setAttribute("aria-controls", "nav-links");
        btn.setAttribute("aria-expanded", "false");
    });
})();
