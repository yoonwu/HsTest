/* SONG HANSIK — actor portfolio interactions */
(function () {
  "use strict";

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var panels = {
    profile: document.getElementById("panel-profile"),
    daily: document.getElementById("panel-daily"),
    reel: document.getElementById("panel-reel"),
    stills: document.getElementById("panel-stills"),
  };
  var tabbar = document.getElementById("tabbar");
  var video = document.getElementById("reelVideo");

  function activate(name, scroll) {
    if (!panels[name]) return;
    tabs.forEach(function (t) {
      var on = t.dataset.tab === name;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    Object.keys(panels).forEach(function (key) {
      var on = key === name;
      panels[key].classList.toggle("is-active", on);
      panels[key].hidden = !on;
    });
    if (name !== "reel" && video && !video.paused) video.pause();
    if (scroll) {
      var y = tabbar.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    if (history.replaceState) history.replaceState(null, "", "#" + name);
  }

  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      activate(t.dataset.tab, true);
    });
  });

  // hero buttons & brand link
  document.querySelectorAll("[data-goto]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      var target = el.dataset.goto;
      if (target === "home") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (panels[target]) {
        e.preventDefault();
        activate(target, true);
      }
    });
  });

  // deep link: #profile / #daily / #reel / #stills
  var initial = location.hash.replace("#", "");
  if (panels[initial]) activate(initial, false);

  /* ---------- stills → jump into the reel ---------- */
  document.querySelectorAll(".card.still").forEach(function (card) {
    card.addEventListener("click", function () {
      var t = parseFloat(card.dataset.time || "0");
      activate("reel", true);
      if (!video) return;
      var play = function () {
        video.currentTime = t;
        video.play();
      };
      if (video.readyState >= 1) play();
      else video.addEventListener("loadedmetadata", play, { once: true });
    });
  });

  /* ---------- lightbox for photo cards ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var gallery = [];
  var index = 0;

  function openLightbox(items, i) {
    gallery = items;
    index = i;
    lightboxImg.src = gallery[index].dataset.full;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }
  function step(dir) {
    index = (index + dir + gallery.length) % gallery.length;
    lightboxImg.src = gallery[index].dataset.full;
  }

  Object.keys(panels).forEach(function (key) {
    var cards = Array.prototype.slice.call(
      panels[key].querySelectorAll(".card:not(.still)")
    );
    cards.forEach(function (card, i) {
      card.addEventListener("click", function () {
        openLightbox(cards, i);
      });
    });
  });

  lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lb-prev").addEventListener("click", function (e) {
    e.stopPropagation();
    step(-1);
  });
  lightbox.querySelector(".lb-next").addEventListener("click", function (e) {
    e.stopPropagation();
    step(1);
  });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
})();
