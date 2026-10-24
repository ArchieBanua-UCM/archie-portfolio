(function () {
  "use strict";

  /* ===== EDIT: quiz questions (answer = index of correct option) ===== */
  var QUESTIONS = [
    { q: "What is Archie studying?", opts: ["BSIT", "Nursing", "Culinary Arts"], answer: 0,
      ok: "Correct! Archie is a BSIT student.", no: "Not quite. Archie is a BSIT student." },
    { q: "Which mobile game does Archie enjoy?", opts: ["Arena Breakout Mobile", "Farm Simulator", "Chess Puzzles"], answer: 0,
      ok: "Correct! Tactical games are his thing.", no: "Not quite. It's Arena Breakout Mobile." },
    { q: "What is the AI assistant Archie wants to build called?", opts: ["Mark One", "Mark Five", "Mark Ten"], answer: 1,
      ok: "Correct! Mark Five is the goal.", no: "Not quite. The name is Mark Five." }
  ];

  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===== Mobile navigation ===== */
  var toggle = $("navToggle"), links = $("navLinks");
  function setMenu(open) {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { setMenu(false); toggle.focus(); }
  });

  /* ===== Profile photo fallback ===== */
  var img = $("profileImg"), fb = $("photoFallback");
  function showFallback() { img.hidden = true; fb.hidden = false; }
  img.addEventListener("error", showFallback);
  if (img.complete && img.naturalWidth === 0) showFallback();

  /* ===== Reveal on scroll ===== */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ===== Interest cards ===== */
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("click", function () {
      var open = card.getAttribute("aria-expanded") === "true";
      card.setAttribute("aria-expanded", String(!open));
      card.querySelector(".more").hidden = open;
    });
  });

  /* ===== Mini-challenge quiz ===== */
  var idx = 0, score = 0;
  var qCount = $("quizCount"), qText = $("quizQ"), qOpts = $("quizOpts"),
      qFb = $("quizFb"), qNext = $("quizNext");

  function renderQuestion() {
    var item = QUESTIONS[idx];
    qCount.textContent = "Question " + (idx + 1) + " of " + QUESTIONS.length;
    qText.textContent = item.q;
    qOpts.innerHTML = "";
    qFb.textContent = "";
    qNext.hidden = true;
    item.opts.forEach(function (text, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "opt";
      b.textContent = text;
      b.addEventListener("click", function () { answer(i); });
      qOpts.appendChild(b);
    });
  }

  function answer(i) {
    var item = QUESTIONS[idx];
    var buttons = qOpts.querySelectorAll(".opt");
    buttons.forEach(function (b, n) {
      b.disabled = true;
      if (n === item.answer) b.classList.add("correct");
    });
    if (i === item.answer) { score++; qFb.textContent = "✔ " + item.ok; }
    else { buttons[i].classList.add("wrong"); qFb.textContent = "✖ " + item.no; }
    qNext.textContent = idx === QUESTIONS.length - 1 ? "See result" : "Next";
    qNext.hidden = false;
    qNext.focus();
  }

  qNext.addEventListener("click", function () {
    if (qNext.dataset.mode === "restart") {
      idx = 0; score = 0; qNext.dataset.mode = "";
      renderQuestion();
      return;
    }
    idx++;
    if (idx < QUESTIONS.length) { renderQuestion(); return; }
    qCount.textContent = "Done!";
    qText.textContent = "You scored " + score + " out of " + QUESTIONS.length + ".";
    qOpts.innerHTML = "";
    qFb.textContent = score === QUESTIONS.length ? "Perfect. You really know Archie!" : "Nice try. Want another round?";
    qNext.textContent = "Play again";
    qNext.dataset.mode = "restart";
  });
  renderQuestion();

  /* ===== Back-to-top button ===== */
  var topBtn = $("toTop");
  window.addEventListener("scroll", function () {
    topBtn.hidden = window.scrollY < 500;
  }, { passive: true });
  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    $("home").setAttribute("tabindex", "-1");
    $("home").focus({ preventScroll: true });
  });

  /* ===== Footer year ===== */
  $("year").textContent = new Date().getFullYear();
})();