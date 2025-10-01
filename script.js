// script.js — DB Code Explorer mobile nav (iPhone-safe)
(function () {
    // Prevent double-initialization
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
        var TOGGLE_GUARD_MS = 400;

        function isOpen() {
            return nav.classList.contains("show");
        }

        function setOpen(open) {
            if (open) {
                nav.classList.add("show");
            } else {
                nav.classList.remove("show");
            }
            btn.setAttribute("aria-expanded", String(open));
            // Optional: prevent background scroll when open (mobile UX)
            document.documentElement.classList.toggle("overflow-hidden", open);
            document.body.classList.toggle("overflow-hidden", open);
        }

        function toggle() {
            setOpen(!isOpen());
        }

        function toggleWithStamp() {
            toggle();
            lastToggleAt = Date.now();
        }

        // Choose best tap event for iPhone & modern browsers
        var tapEvent =
            "onpointerup" in window
                ? "pointerup"
                : "ontouchend" in window
                    ? "touchend"
                    : "click";

        function handleTap(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleWithStamp();
        }

        // Bind the primary tap handler
        if (tapEvent === "click") {
            // No pointer/touch support: click is the real event
            btn.addEventListener("click", handleTap);
        } else {
            // pointerup/touchend does the real toggle
            btn.addEventListener(tapEvent, handleTap, { passive: false });

            // iOS fires a synthetic click right after pointer/touch — swallow it
            btn.addEventListener(
                "click",
                function (e) {
                    if (Date.now() - lastToggleAt < TOGGLE_GUARD_MS) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                },
                { passive: false }
            );
        }

        // Close when clicking outside the menu (ignore immediate follow-up events)
        document.addEventListener("click", function (e) {
            if (Date.now() - lastToggleAt < TOGGLE_GUARD_MS) return;
            if (!isOpen()) return;
            if (e.target.closest("#nav-links") || e.target.closest("#menu-toggle"))
                return;
            setOpen(false);
        });

        // Close on Escape
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && isOpen()) setOpen(false);
        });

        // Close after tapping a nav link
        Array.prototype.forEach.call(
            nav.querySelectorAll("a"),
            function (link) {
                link.addEventListener("click", function () {
                    if (isOpen()) setOpen(false);
                });
            }
        );

        // If the window becomes desktop size, ensure menu is reset
        var mq = window.matchMedia("(min-width: 769px)");
        function handleMQ(ev) {
            if (ev.matches) {
                // Desktop — ensure clean state
                setOpen(false);
            }
        }
        if (mq.addEventListener) mq.addEventListener("change", handleMQ);
        else mq.addListener(handleMQ); // older Safari

        // Initialize ARIA state
        btn.setAttribute("aria-controls", "nav-links");
        btn.setAttribute("aria-expanded", "false");
    });
})();
