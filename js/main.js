/* KIM HEUNGSEOP — actor portfolio interactions */
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

  /* ---------- background music ---------- */
  var bgm = document.getElementById("bgm");
  var bgmBtn = document.getElementById("bgmToggle");
  var BGM_VOL = 0.5;
  var wantMusic = false; // user's intent
  var fadeTimer = null;

  function fadeTo(target, ms, thenPause) {
    if (!bgm) return;
    if (fadeTimer) clearInterval(fadeTimer);
    var start = bgm.volume;
    var steps = Math.max(1, Math.round(ms / 40));
    var i = 0;
    fadeTimer = setInterval(function () {
      i++;
      bgm.volume = Math.min(1, Math.max(0, start + (target - start) * (i / steps)));
      if (i >= steps) {
        clearInterval(fadeTimer);
        fadeTimer = null;
        if (thenPause) bgm.pause();
      }
    }, 40);
  }

  function startMusic() {
    if (!bgm) return;
    bgm.volume = 0;
    var p = bgm.play();
    if (p && p.catch) p.catch(function () {});
    fadeTo(BGM_VOL, 900);
    bgmBtn.classList.add("is-playing");
    bgmBtn.setAttribute("aria-pressed", "true");
  }
  function stopMusic() {
    fadeTo(0, 500, true);
    bgmBtn.classList.remove("is-playing");
    bgmBtn.setAttribute("aria-pressed", "false");
  }

  if (bgmBtn) {
    bgmBtn.addEventListener("click", function () {
      wantMusic = !wantMusic;
      if (wantMusic) startMusic();
      else stopMusic();
    });
  }

  // Duck the music while the acting reel plays so the monologue stays clear.
  function duck() { if (wantMusic && bgm && !bgm.paused) fadeTo(0.08, 400); }
  function unduck() { if (wantMusic && bgm) { if (bgm.paused) bgm.play().catch(function(){}); fadeTo(BGM_VOL, 700); } }

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

  // reel audio vs. BGM: duck while the video plays, restore when it stops
  if (video) {
    video.addEventListener("play", duck);
    video.addEventListener("pause", unduck);
    video.addEventListener("ended", unduck);
  }

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
