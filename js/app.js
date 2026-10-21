/* ============================================================
   Chemia fizyczna — interaktywny przewodnik
   Logika aplikacji: routing, symulacje, obliczenia, test
   ============================================================ */
(function (global) {
  "use strict";

  const GUIDE = global.GUIDE;
  const CF = global.CF;

  if (!GUIDE || !CF) {
    document.body.innerHTML = '<main style="padding:2rem;font-family:system-ui"><h1>Nie udało się załadować przewodnika</h1><p>Sprawdź, czy pliki JavaScript są kompletne.</p></main>';
    return;
  }

  const $ = function (id) { return document.getElementById(id); };
  const pageMap = new Map(GUIDE.pages.map(function (page) { return [page.id, page]; }));

  const DEFAULT_STATE = {
    theme: null,
    completed: {},
    activity: { c: 0.05, gamma: 0.85, temp: 298 },
    nernst: { K: 3, vorg: 25, vaq: 35 },
    extraction: { mass: 100, K: 8, vaq: 100, vorg: 100, n: 1 },
    alpha: { c: 0.00245, ka: 0.0000646 },
    bioactivity: { logP: 2.5 },
    lab: {
      massA: "0.0300", massB: "0.1000",
      v1a: "", v2a: "", v1b: "", v2b: "",
      temp: "", appearance: "", notes: "", steps: {}
    },
    calc: {
      massA: "0.0300", massB: "0.1000", vA: "0.80", vB: "1.40",
      cNaOH: "0.0100", vWater: "35.0", vTol: "25.0",
      vAliquot: "10.0", molar: "122.12", ka: "0.0000646"
    },
    errors: {
      series: "36,95 36,60 36,75 36,59 36,80",
      resolution: "0.01",
      scriptMode: false
    },
    graph: {
      data: [
        { x: 0.00, y: 0.051 }, { x: 0.02, y: 0.162 }, { x: 0.04, y: 0.271 },
        { x: 0.06, y: 0.382 }, { x: 0.08, y: 0.491 }, { x: 0.10, y: 0.602 }
      ]
    },
    report: {
      name: "", field: "", group: "", date: "",
      topic: "Współczynnik podziału substancji",
      aim: "", discussion: "", conclusions: "", checks: {}
    },
    quiz: { best: null }
  };

  function cloneValue(value) {
    if (Array.isArray(value)) return value.map(cloneValue);
    if (value && typeof value === "object") {
      const result = {};
      Object.keys(value).forEach(function (key) {
        result[key] = cloneValue(value[key]);
      });
      return result;
    }
    return value;
  }

  function mergeDefaults(base, source) {
    if (source === undefined || source === null) return cloneValue(base);
    if (Array.isArray(base)) {
      if (!Array.isArray(source)) return cloneValue(base);
      return source.map(function (item) {
        return item && typeof item === "object" ? cloneValue(item) : item;
      });
    }
    if (base && typeof base === "object") {
      const result = cloneValue(base);
      if (source && typeof source === "object") {
        Object.keys(source).forEach(function (key) {
          if (base[key] && typeof base[key] === "object" && !Array.isArray(base[key]) &&
              source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
            result[key] = mergeDefaults(base[key], source[key]);
          } else if (Array.isArray(base[key]) && Array.isArray(source[key])) {
            result[key] = mergeDefaults(base[key], source[key]);
          } else {
            result[key] = source[key];
          }
        });
      }
      return result;
    }
    return source === undefined ? base : source;
  }

  let state = mergeDefaults(DEFAULT_STATE, CF.loadState());
  let currentPage = null;
  let saveTimer = null;
  let toastTimer = null;

  const pageEl = $("page");
  const navEl = $("nav");
  const sidebar = $("sidebar");
  const scrim = $("scrim");

  /* ============================================================
     POMOCNIKI
     ============================================================ */

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { CF.saveState(state); }, 160);
  }

  function toast(message, type) {
    const el = $("toast");
    if (!el) return;
    el.textContent = message;
    el.className = "toast is-visible" + (type ? " toast-" + type : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.className = "toast";
    }, 2800);
  }

  function num(value, decimals) {
    const parsed = typeof value === "number" ? value : parseFloat(value);
    if (!Number.isFinite(parsed)) return "—";
    return CF.fixed(parsed, decimals == null ? 3 : decimals);
  }

  function sig(value, digits) {
    const parsed = typeof value === "number" ? value : parseFloat(value);
    if (!Number.isFinite(parsed)) return "—";
    return CF.sig(parsed, digits == null ? 3 : digits);
  }

  function valueOf(id) {
    const el = $(id);
    if (!el) return NaN;
    if (el.type === "checkbox") return el.checked;
    return el.value;
  }

  function setValue(id, value) {
    const el = $(id);
    if (el) el.value = value == null ? "" : value;
  }

  function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
  }

  function setHTML(id, html) {
    const el = $(id);
    if (el) el.innerHTML = html;
  }

  function escapeText(text) {
    return CF.escape(text == null ? "" : String(text)).replace(/\n/g, "<br>");
  }

  function calcMean(values) {
    const valid = values.map(function (v) {
      const parsed = typeof v === "number" ? v : parseFloat(v);
      return Number.isFinite(parsed) ? parsed : NaN;
    }).filter(Number.isFinite);
    return valid.length ? CF.mean(valid) : NaN;
  }

  function readCalcInputs() {
    const c = state.calc;
    const common = {
      cNaOH: parseFloat(c.cNaOH),
      vAliquot: parseFloat(c.vAliquot),
      vWater: parseFloat(c.vWater),
      vToluene: parseFloat(c.vTol),
      molarMass: parseFloat(c.molar),
      Ka: parseFloat(c.ka)
    };
    return {
      c: c,
      common: common,
      a: CF.calcSample({
        mass: parseFloat(c.massA),
        vNaOH: parseFloat(c.vA),
        cNaOH: common.cNaOH,
        vAliquot: common.vAliquot,
        vWater: common.vWater,
        vToluene: common.vToluene,
        molarMass: common.molarMass,
        Ka: common.Ka
      }),
      b: CF.calcSample({
        mass: parseFloat(c.massB),
        vNaOH: parseFloat(c.vB),
        cNaOH: common.cNaOH,
        vAliquot: common.vAliquot,
        vWater: common.vWater,
        vToluene: common.vToluene,
        molarMass: common.molarMass,
        Ka: common.Ka
      })
    };
  }

  function labMean(key) {
    const first = state.lab[key === "a" ? "v1a" : "v1b"];
    const second = state.lab[key === "a" ? "v2a" : "v2b"];
    return calcMean([first, second]);
  }

  function meanDisplay(value) {
    return Number.isFinite(value) ? CF.fixed(value, 3) + " cm³" : "—";
  }

  /* ============================================================
     MOTYW, NAWIGACJA, POSTĘP
     ============================================================ */

  function setTheme(theme) {
    const chosen = theme || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", chosen);
    state.theme = chosen;
    save();
    setTimeout(function () { CF.redrawCharts(); }, 40);
  }

  function updateProgress() {
    const total = GUIDE.trackedIds.length;
    const done = GUIDE.trackedIds.filter(function (id) { return !!state.completed[id]; }).length;
    const percent = total ? Math.round((done / total) * 100) : 0;

    setText("progressText", done + "/" + total);
    setText("sidebarProgressText", done + " z " + total + " modułów");
    const topBar = $("progressBar");
    if (topBar) topBar.style.width = percent + "%";
    const sideBar = $("sidebarProgressBar");
    if (sideBar) sideBar.style.width = percent + "%";
    const ring = $("sidebarRing");
    if (ring) ring.style.setProperty("--progress", percent + "%");
  }

  function renderNav() {
    if (!navEl) return;
    navEl.innerHTML = GUIDE.nav.map(function (group) {
      return '<div class="nav-group">' +
        '<p class="nav-group-label">' + group.label + "</p>" +
        group.items.map(function (item) {
          const done = !!state.completed[item.id];
          return '<a class="nav-link" href="#' + item.id + '" data-nav="' + item.id + '">' +
            '<span class="nav-num">' + (item.num || "•") + "</span>" +
            '<span class="nav-title">' + item.short + "</span>" +
            '<span class="nav-check" ' + (done ? "" : "hidden") + ' aria-label="opanowane">✓</span>' +
            "</a>";
        }).join("") +
        "</div>";
    }).join("");
    updateNavActive();
  }

  function updateNavActive() {
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      const active = link.getAttribute("data-nav") === currentPage;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function openMenu() {
    sidebar.classList.add("is-open");
    scrim.classList.add("is-visible");
    const btn = $("menuBtn");
    if (btn) btn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    sidebar.classList.remove("is-open");
    scrim.classList.remove("is-visible");
    const btn = $("menuBtn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  /* ============================================================
     ROUTER
     ============================================================ */

  function hashPage() {
    return (location.hash || "").replace(/^#/, "") || "start";
  }

  function pageHeader(page) {
    if (page.id === "start") return "";
    return '<header class="page-header">' +
      '<p class="eyebrow">' + page.eyebrow + "</p>" +
      "<h1>" + page.title + "</h1>" +
      '<p class="page-lead">' + page.lead + "</p>" +
      "</header>";
  }

  function completionMarkup(page) {
    if (!GUIDE.trackedIds.includes(page.id)) return "";
    const done = !!state.completed[page.id];
    return '<section class="completion-card' + (done ? " is-done" : "") + '" id="completionCard">' +
      '<div class="completion-copy"><p class="eyebrow">Postęp</p>' +
      "<h2>" + (done ? "Moduł opanowany" : "Zamknij moduł") + "</h2>" +
      "<p>" + (page.id === "quiz"
        ? "Uzyskaj co najmniej 80 % w teście, aby moduł oznaczył się automatycznie. Możesz też oznaczyć go ręcznie."
        : "Oznacz moduł jako opanowany, gdy potrafisz wyjaśnić jego treść własnymi słowami.") + "</p></div>" +
      '<button type="button" class="btn ' + (done ? "btn-done" : "btn-primary") + '" id="completeBtn" data-complete="' + page.id + '">' +
      (done ? "Opanowane ✓" : "Oznacz jako opanowane") + "</button></section>";
  }

  function pageNavMarkup(page) {
    const index = GUIDE.pages.indexOf(page);
    const prev = GUIDE.pages[index - 1];
    const next = GUIDE.pages[index + 1];
    return '<nav class="page-nav" aria-label="Nawigacja między modułami">' +
      (prev
        ? '<a class="page-nav-link prev" href="#' + prev.id + '" data-page-link="' + prev.id + '"><span aria-hidden="true">←</span><div><small>Poprzedni</small><strong>' + prev.title + "</strong></div></a>"
        : '<span class="page-nav-spacer"></span>') +
      (next
        ? '<a class="page-nav-link next" href="#' + next.id + '" data-page-link="' + next.id + '"><div><small>Następny</small><strong>' + next.title + "</strong></div><span aria-hidden=\"true\">→</span></a>"
        : '<span class="page-nav-spacer"></span>') +
      "</nav>";
  }

  function pageShell(page) {
    return '<div class="page-wrap">' +
      pageHeader(page) +
      '<div class="page-body">' + page.body() + "</div>" +
      completionMarkup(page) +
      pageNavMarkup(page) +
      "</div>";
  }

  function showPage(id, options) {
    options = options || {};
    const page = pageMap.get(id) || pageMap.get("start");
    if (!page) return;
    if (currentPage === page.id && !options.force) return;
    closeModal();
    currentPage = page.id;
    CF.charts.length = 0;
    pageEl.innerHTML = pageShell(page);
    pageEl.classList.remove("page-enter");
    void pageEl.offsetWidth;
    pageEl.classList.add("page-enter");

    const initializer = initializers[page.id];
    if (initializer) initializer();

    initChecks();
    initDerivations();
    updateNavActive();
    updateProgress();
    updateCompletionUI();

    setText("topEyebrow", page.group);
    setText("topTitle", page.short || page.title);
    document.title = page.id === "start"
      ? "Współczynnik podziału — interaktywny przewodnik"
      : page.title + " — Współczynnik podziału";

    if (!options.keepScroll) window.scrollTo({ top: 0, behavior: "auto" });
    closeMenu();
  }

  function updateCompletionUI() {
    const page = pageMap.get(currentPage);
    if (!page) return;
    const card = $("completionCard");
    const btn = $("completeBtn");
    if (!card || !btn) return;
    const done = !!state.completed[page.id];
    card.classList.toggle("is-done", done);
    const heading = card.querySelector("h2");
    if (heading) heading.textContent = done ? "Moduł opanowany" : "Zamknij moduł";
    btn.className = "btn " + (done ? "btn-done" : "btn-primary");
    btn.textContent = done ? "Opanowane ✓" : "Oznacz jako opanowane";
  }

  /* ============================================================
     SPRAWDZENIA I WYPROWADZENIA
     ============================================================ */

  function initChecks() {
    document.querySelectorAll("[data-check]").forEach(function (card) {
      if (card.dataset.bound === "true") return;
      card.dataset.bound = "true";
      const button = card.querySelector(".check-submit");
      const feedback = card.querySelector(".check-feedback");
      const explanation = card.querySelector(".check-explanation");
      if (!button || !feedback) return;

      card.querySelectorAll('input[type="radio"]').forEach(function (radio) {
        radio.addEventListener("change", function () {
          card.classList.remove("is-correct", "is-wrong");
          feedback.textContent = "";
          if (explanation) explanation.hidden = true;
        });
      });

      button.addEventListener("click", function () {
        const selected = card.querySelector('input[type="radio"]:checked');
        if (!selected) {
          feedback.textContent = "Najpierw wybierz jedną odpowiedź.";
          card.classList.add("is-wrong");
          return;
        }
        if (selected.value === card.dataset.answer) {
          card.classList.add("is-correct");
          card.classList.remove("is-wrong");
          feedback.textContent = "Dobrze! To jest poprawna odpowiedź.";
          if (explanation) explanation.hidden = false;
        } else {
          card.classList.add("is-wrong");
          card.classList.remove("is-correct");
          feedback.textContent = "Jeszcze nie. Wróć do definicji i spróbuj ponownie.";
          if (explanation) explanation.hidden = true;
        }
      });
    });
  }

  function initDerivations() {
    document.querySelectorAll("[data-derivation]").forEach(function (box) {
      if (box.dataset.bound === "true") return;
      box.dataset.bound = "true";
      const steps = Array.from(box.querySelectorAll(".derivation-step"));
      const next = box.querySelector(".derivation-next");
      const reset = box.querySelector(".derivation-reset");
      if (!steps.length) return;
      let visible = 1;

      function render() {
        steps.forEach(function (step, index) {
          step.hidden = index >= visible;
          step.classList.toggle("is-new", index === visible - 1);
        });
        if (next) next.hidden = visible >= steps.length;
        if (reset) reset.hidden = visible <= 1;
      }

      if (next) {
        next.addEventListener("click", function () {
          if (visible < steps.length) visible += 1;
          render();
        });
      }
      if (reset) {
        reset.addEventListener("click", function () {
          visible = 1;
          render();
        });
      }
      render();
    });
  }

  /* ============================================================
     START
     ============================================================ */

  function initStart() {
    /* strona startowa nie wymaga dodatkowej logiki */
  }

  /* ============================================================
     01 — AKTYWNOŚĆ
     ============================================================ */

  function initActivity() {
    const c = $("act-c");
    const gamma = $("act-gamma");
    const temp = $("act-temp");
    if (!c || !gamma || !temp) return;

    c.value = state.activity.c;
    gamma.value = state.activity.gamma;
    temp.value = state.activity.temp;

    const outC = $("act-c-out");
    const outG = $("act-gamma-out");
    const outT = $("act-temp-out");

    function update() {
      const concentration = parseFloat(c.value);
      const coefficient = parseFloat(gamma.value);
      const temperature = parseFloat(temp.value);
      const activity = coefficient * concentration;
      const rt = 8.314 * temperature * Math.log(activity) / 1000;

      if (outC) outC.textContent = CF.fixed(concentration, 3);
      if (outG) outG.textContent = CF.fixed(coefficient, 2);
      if (outT) outT.textContent = CF.fixed(temperature, 0);
      setText("act-a", CF.sig(activity, 3));
      setText("act-rt", CF.fixed(rt, 2) + " kJ·mol⁻¹");
      setText("act-meter", "");
      const meter = $("act-meter");
      if (meter) meter.style.width = CF.clamp((coefficient - 0.1) / 1.1 * 100, 0, 100) + "%";

      let note;
      if (coefficient < 0.95) {
        note = "Oddziaływania międzycząsteczkowe obniżają efektywne stężenie. Aktywność jest mniejsza od stężenia.";
      } else if (coefficient > 1.05) {
        note = "Współczynnik aktywności większy od 1 oznacza dodatnie odchylenie od ideału — efektywne stężenie jest wyższe niż molowe.";
      } else {
        note = "Roztwór jest bliski ideałowi: γ ≈ 1, więc aktywność jest zbliżona do stężenia.";
      }
      setText("act-note", note);
      state.activity = { c: concentration, gamma: coefficient, temp: temperature };
      save();
    }

    [c, gamma, temp].forEach(function (el) { el.addEventListener("input", update); });
    update();
  }

  /* ============================================================
     02 — NERNST
     ============================================================ */

  function seeded(index, seed) {
    const value = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
    return value - Math.floor(value);
  }

  function renderParticles(container, count, seedOffset) {
    if (!container) return;
    container.innerHTML = "";
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i += 1) {
      const dot = document.createElement("span");
      dot.className = "particle";
      dot.style.left = (5 + seeded(i + seedOffset, 1) * 88).toFixed(2) + "%";
      dot.style.top = (8 + seeded(i + seedOffset, 2) * 80).toFixed(2) + "%";
      dot.style.width = dot.style.height = (4.5 + seeded(i + seedOffset, 3) * 4.5).toFixed(2) + "px";
      dot.style.animationDelay = (-seeded(i + seedOffset, 4) * 6).toFixed(2) + "s";
      fragment.appendChild(dot);
    }
    container.appendChild(fragment);
  }

  function initNernst() {
    const k = $("nernst-k");
    const vorg = $("nernst-vorg");
    const vaq = $("nernst-vaq");
    if (!k || !vorg || !vaq) return;

    k.value = state.nernst.K;
    vorg.value = state.nernst.vorg;
    vaq.value = state.nernst.vaq;

    const outK = $("nernst-k-out");
    const outOrg = $("nernst-vorg-out");
    const outAq = $("nernst-vaq-out");

    function update() {
      const K = parseFloat(k.value);
      const vOrg = parseFloat(vorg.value);
      const vAq = parseFloat(vaq.value);
      if (outK) outK.textContent = CF.fixed(K, 1);
      if (outOrg) outOrg.textContent = CF.fixed(vOrg, 0);
      if (outAq) outAq.textContent = CF.fixed(vAq, 0);

      const total = 1; // mmol
      const cAq = total / (vAq + K * vOrg); // mmol/cm3 = mol/dm3
      const cOrg = K * cAq;
      const mOrg = cOrg * vOrg;
      const mAq = cAq * vAq;
      const fOrg = mOrg / total;
      const fAq = mAq / total;

      setText("conc-organic", CF.sig(cOrg, 3) + " M");
      setText("conc-aqueous", CF.sig(cAq, 3) + " M");
      setText("nernst-corg", CF.sig(cOrg, 3) + " mol·dm⁻³");
      setText("nernst-caq", CF.sig(cAq, 3) + " mol·dm⁻³");
      setText("nernst-morg", CF.sig(mOrg, 3) + " mmol");
      setText("nernst-maq", CF.sig(mAq, 3) + " mmol");

      const stripOrg = $("strip-organic");
      const stripAq = $("strip-aqueous");
      const labelOrg = $("strip-organic-label");
      const labelAq = $("strip-aqueous-label");
      if (stripOrg) stripOrg.style.width = (fOrg * 100).toFixed(2) + "%";
      if (stripAq) stripAq.style.width = (fAq * 100).toFixed(2) + "%";
      if (labelOrg) labelOrg.textContent = fOrg > 0.12 ? CF.pct(fOrg, 1) : "";
      if (labelAq) labelAq.textContent = fAq > 0.12 ? CF.pct(fAq, 1) : "";

      const particlesOrg = Math.round(fOrg * 70);
      renderParticles($("particles-organic"), particlesOrg, 10);
      renderParticles($("particles-aqueous"), 70 - particlesOrg, 90);

      const note = K > 1
        ? "K = " + CF.fixed(K, 1) + " > 1, więc wyższe stężenie panuje w fazie organicznej. Do toluenu przechodzi " + CF.pct(fOrg, 1) + " masy substancji."
        : "K = " + CF.fixed(K, 1) + " < 1, więc wyższe stężenie panuje w fazie wodnej. W wodzie pozostaje " + CF.pct(fAq, 1) + " masy substancji.";
      setText("nernst-note", note);

      state.nernst = { K: K, vorg: vOrg, vaq: vAq };
      save();
    }

    [k, vorg, vaq].forEach(function (el) { el.addEventListener("input", update); });
    update();
  }

  /* ============================================================
     03 — STOPIEŃ DYSOCJACJI
     ============================================================ */

  function initAlpha() {
    const c = $("alpha-c");
    const ka = $("alpha-ka");
    if (!c || !ka) return;

    c.value = state.alpha.c;
    ka.value = state.alpha.ka;

    function update() {
      const concentration = parseFloat(c.value);
      const constant = parseFloat(ka.value);
      const exact = CF.alphaExact(concentration, constant);
      const approx = CF.alphaApprox(concentration, constant);
      const proton = concentration * exact;
      const pH = proton > 0 ? -Math.log10(proton) : NaN;

      setText("alpha-exact", Number.isFinite(exact) ? CF.pct(exact, 2) : "—");
      setText("alpha-approx", Number.isFinite(approx) ? CF.pct(approx, 2) : "—");
      setText("alpha-h", Number.isFinite(proton) ? CF.sci(proton, 2) + " mol·dm⁻³" : "—");
      setText("alpha-ph", Number.isFinite(pH) ? CF.fixed(pH, 2) : "—");

      let errorText = "—";
      if (Number.isFinite(exact) && exact > 0 && Number.isFinite(approx)) {
        const error = (approx - exact) / exact * 100;
        const direction = error >= 0 ? "zawyża" : "zaniża";
        errorText = "Przybliżenie " + direction + " α o " + CF.fixed(Math.abs(error), 1) + " % względem wyniku ścisłego.";
      }
      setText("alpha-error", errorText);

      const bar = $("alpha-bar-fill");
      const label = $("alpha-bar-label");
      if (bar) bar.style.width = CF.clamp((exact || 0) * 100, 0.5, 100) + "%";
      if (label) label.textContent = Number.isFinite(exact) ? CF.pct(exact, 2) : "—";

      state.alpha = { c: concentration, ka: constant };
      save();
    }

    [c, ka].forEach(function (el) { el.addEventListener("input", update); });
    update();
  }

  /* ============================================================
     04 — KREATOR WZORU
     ============================================================ */

  function initFormulaBuilder() {
    const diss = $("fx-diss");
    const assoc = $("fx-assoc");
    if (!diss || !assoc) return;

    function update() {
      const numerator = assoc.checked ? CF.sqrt('<span class="math">c<sub>t</sub></span>') : '<span class="math">c<sub>t</sub></span>';
      const denominator = diss.checked
        ? '<span class="math">c<sub>w</sub>(1 − α)</span>'
        : '<span class="math">c<sub>w</sub></span>';
      const stage = $("formula-live");
      if (stage) {
        stage.innerHTML = '<span class="math">K = </span>' + CF.frac(numerator, denominator);
        stage.classList.remove("formula-pulse");
        void stage.offsetWidth;
        stage.classList.add("formula-pulse");
      }
      setHTML("fc-num-value", assoc.checked ? CF.sqrt('<span class="math">c<sub>t</sub></span>') : '<span class="math">c<sub>t</sub></span>');
      setHTML("fc-den-value", diss.checked ? '<span class="math">c<sub>w</sub>(1 − α)</span>' : '<span class="math">c<sub>w</sub></span>');
      const numBox = $("fc-num");
      const denBox = $("fc-den");
      if (numBox) numBox.classList.toggle("is-active", assoc.checked);
      if (denBox) denBox.classList.toggle("is-active", diss.checked);

      let legend;
      if (!diss.checked && !assoc.checked) {
        legend = "Wzór podstawowy. Zakłada, że substancja nie dysocjuje w wodzie ani nie asocjuje w toluenie.";
      } else if (diss.checked && !assoc.checked) {
        legend = "Uwzględniono dysocjację w wodzie: w mianowniku pozostaje tylko forma niezdysocjowana c_w(1 − α).";
      } else if (!diss.checked && assoc.checked) {
        legend = "Uwzględniono dimeryzację w toluenie: w liczniku pozostaje monomer, proporcjonalny do √c_t.";
      } else {
        legend = "Pełny wzór roboczy z obu poprawek: monomer w toluenie i forma niezdysocjowana w wodzie.";
      }
      setText("formula-legend", legend);
    }

    diss.addEventListener("change", update);
    assoc.addEventListener("change", update);
    update();
  }

  /* ============================================================
     05 — EKSTRAKCJA
     ============================================================ */

  function initExtraction() {
    const mass = $("ex-mass");
    const k = $("ex-k");
    const vaq = $("ex-vaq");
    const vorg = $("ex-vorg");
    const portions = $("ex-n");
    if (!mass || !k || !vaq || !vorg || !portions) return;

    mass.value = state.extraction.mass;
    k.value = state.extraction.K;
    vaq.value = state.extraction.vaq;
    vorg.value = state.extraction.vorg;
    portions.value = state.extraction.n;

    function update() {
      const m0 = parseFloat(mass.value);
      const K = parseFloat(k.value);
      const vAq = parseFloat(vaq.value);
      const vOrg = parseFloat(vorg.value);
      const n = parseInt(portions.value, 10);
      setText("ex-n-out", String(n));

      if (!(m0 > 0 && K > 0 && vAq > 0 && vOrg > 0 && n >= 1)) {
        ["ex-vportion", "ex-q", "ex-remaining", "ex-efficiency"].forEach(function (id) {
          setText(id, "—");
        });
        setText("ex-compare", "Wpisz dodatnie wartości, aby zobaczyć wynik.");
        setHTML("ex-stage-bars", "");
        return;
      }

      const result = CF.extraction(m0, K, vAq, vOrg, n);
      setText("ex-vportion", CF.fixed(result.vPortion, 1) + " cm³");
      setText("ex-q", CF.fixed(result.q, 4));
      setText("ex-remaining", CF.fixed(result.remaining, 2) + " mg");
      setText("ex-efficiency", CF.pct(result.efficiency, 1));

      const single = result.singlePortionEfficiency;
      const gain = (result.efficiency - single) * 100;
      const portionWord = function (value) {
        if (value === 1) return "1 porcję";
        const mod10 = value % 10;
        const mod100 = value % 100;
        if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return value + " porcje";
        return value + " porcji";
      };
      const comparison = n === 1
        ? "To jedna porcja. Zwiększ liczbę porcji, zachowując tę samą całkowitą objętość — zobaczysz wzrost wydajności."
        : "Jedna porcja o objętości " + CF.fixed(vOrg, 0) + " cm³ dałaby " + CF.pct(single, 1) +
          " wydajności. Podział na " + portionWord(n) + " daje " + CF.pct(result.efficiency, 1) +
          " (zysk " + CF.fixed(gain, 1) + " p.p.).";
      setText("ex-compare", comparison);
      setText("ex-stage-caption", "po " + n + (n === 1 ? " porcji" : n < 5 ? " porcjach" : " porcjach"));

      const bars = $("ex-stage-bars");
      if (bars) {
        bars.innerHTML = result.stages.map(function (stage) {
          const percent = stage.remaining / m0 * 100;
          return '<div class="stage-row"><span class="stage-index">' + stage.step + '</span>' +
            '<div class="stage-track"><i style="width:' + CF.clamp(percent, 0, 100).toFixed(2) + '%"></i></div>' +
            '<span class="stage-value">' + CF.pct(stage.remaining / m0, 2) + '</span></div>';
        }).join("");
      }

      state.extraction = { mass: m0, K: K, vaq: vAq, vorg: vOrg, n: n };
      save();
    }

    [mass, k, vaq, vorg, portions].forEach(function (el) { el.addEventListener("input", update); });
    update();
  }

  /* ============================================================
     06 — AKTYWNOŚĆ BIOLOGICZNA
     ============================================================ */

  function initBioactivity() {
    const input = $("logp-range");
    if (!input) return;
    input.value = state.bioactivity.logP;

    function update() {
      const value = parseFloat(input.value);
      setText("logp-out", CF.fixed(value, 1));

      let category;
      let note;
      if (value < 0) {
        category = "wyraźnie hydrofilowa";
        note = "Substancja dobrze rozpuszcza się w wodzie, ale może słabo przenikać przez błony lipidowe. W organizmie bywa szybko wydalana.";
      } else if (value < 1) {
        category = "niskolipofilowa";
        note = "Rozpuszczalność w wodzie jest nadal dobra, a przenikanie przez błony może być ograniczone. Taki profil bywa korzystny, gdy lek działa w przestrzeni pozakomórkowej.";
      } else if (value <= 3) {
        category = "zakres zrównoważony";
        note = "Umiarkowana lipofilowość łączy rozpuszczalność w wodzie z możliwością przechodzenia przez błony. To często poszukiwany zakres w projektowaniu leków doustnych.";
      } else if (value <= 5) {
        category = "lipofilowa";
        note = "Substancja dobrze przenika przez błony, ale rośnie ryzyko kumulacji w tkance tłuszczowej i pogorszenia rozpuszczalności w wodzie. Warto sprawdzić wiązanie z białkami.";
      } else {
        category = "bardzo lipofilowa";
        note = "Bardzo wysokie logP sprzyja gromadzeniu się w tłuszczach i może utrudniać formulację oraz biodostępność. Taki wynik wymaga dalszej analizy właściwości fizykochemicznych.";
      }

      setText("logp-category", category);
      setText("logp-note", note);
      state.bioactivity = { logP: value };
      save();
    }

    input.addEventListener("input", update);
    update();
  }

  /* ============================================================
     07 — LABORATORIUM
     ============================================================ */

  function updateLabMeans() {
    const meanA = labMean("a");
    const meanB = labMean("b");
    setText("lab-mean-a", meanDisplay(meanA));
    setText("lab-mean-b", meanDisplay(meanB));
  }

  function updateLabProgress() {
    const total = 7;
    let done = 0;
    for (let i = 1; i <= total; i += 1) {
      if (state.lab.steps[i]) done += 1;
    }
    setText("lab-progress-label", done + " / " + total);
    const bar = $("lab-progress-bar");
    if (bar) bar.style.width = (done / total * 100) + "%";
  }

  function initLab() {
    const massA = $("lab-mass-a");
    const massB = $("lab-mass-b");
    const v1a = $("lab-v1a");
    const v2a = $("lab-v2a");
    const v1b = $("lab-v1b");
    const v2b = $("lab-v2b");
    const temp = $("lab-temp");
    const appearance = $("lab-appearance");
    const notes = $("lab-notes");

    if (massA) massA.value = state.lab.massA;
    if (massB) massB.value = state.lab.massB;
    if (v1a) v1a.value = state.lab.v1a;
    if (v2a) v2a.value = state.lab.v2a;
    if (v1b) v1b.value = state.lab.v1b;
    if (v2b) v2b.value = state.lab.v2b;
    if (temp) temp.value = state.lab.temp;
    if (appearance) appearance.value = state.lab.appearance;
    if (notes) notes.value = state.lab.notes;

    const fields = [
      ["massA", massA], ["massB", massB], ["v1a", v1a], ["v2a", v2a],
      ["v1b", v1b], ["v2b", v2b], ["temp", temp], ["appearance", appearance], ["notes", notes]
    ];
    fields.forEach(function (pair) {
      if (!pair[1]) return;
      pair[1].addEventListener("input", function () {
        state.lab[pair[0]] = pair[1].value;
        save();
        if (["v1a", "v2a", "v1b", "v2b"].includes(pair[0])) updateLabMeans();
      });
    });

    for (let i = 1; i <= 7; i += 1) {
      const checkbox = $("lab-step-" + i);
      if (!checkbox) continue;
      checkbox.checked = !!state.lab.steps[i];
      checkbox.addEventListener("change", function () {
        state.lab.steps[i] = checkbox.checked;
        save();
        updateLabProgress();
      });
    }

    updateLabMeans();
    updateLabProgress();
  }

  /* ============================================================
     08 — OBLICZENIA
     ============================================================ */

  const CALC_FIELDS = {
    massA: "calc-mass-a",
    massB: "calc-mass-b",
    vA: "calc-v-a",
    vB: "calc-v-b",
    cNaOH: "calc-cnaoh",
    vWater: "calc-vwater",
    vTol: "calc-vtol",
    vAliquot: "calc-valiquot",
    molar: "calc-molar",
    ka: "calc-ka"
  };

  function fillCalcInputs() {
    Object.keys(CALC_FIELDS).forEach(function (key) {
      setValue(CALC_FIELDS[key], state.calc[key]);
    });
  }

  function calcBadge() {
    const badge = $("calc-data-badge");
    if (!badge) return;
    const defaults = DEFAULT_STATE.calc;
    const changed = Object.keys(CALC_FIELDS).some(function (key) {
      return String(state.calc[key] || "") !== String(defaults[key]);
    });
    badge.textContent = changed ? "dane własne" : "dane przykładowe";
    badge.classList.toggle("is-custom", changed);
    setHTML("calc-data-note", changed
      ? "Wprowadzono <strong>dane własne</strong>. Możesz je zmienić lub przywrócić przykład."
      : "Domyślnie wpisano <strong>dane przykładowe</strong> (wyidealizowane; nie są wynikami rzeczywistego pomiaru). Zamień je na własne wyniki z karty.");
  }

  function renderCalcWork(data) {
    const c = data.c;
    function line(label, sample) {
      if (!sample || !Number.isFinite(sample.cw)) {
        return "<p><strong>" + label + ".</strong> Uzupełnij masę i objętość miareczkowania.</p>";
      }
      return "<p><strong>" + label + ".</strong> " +
        "n<sub>NaOH</sub> = " + CF.fixed(parseFloat(c.cNaOH), 4) + " · " + CF.fixed(sample.vNaOH, 2) + " = " + CF.sig(sample.nNaOH, 3) + " mmol; " +
        "c<sub>w</sub> = " + CF.sig(sample.nNaOH, 3) + " / " + CF.fixed(parseFloat(c.vAliquot), 1) + " = <strong>" + CF.sig(sample.cw, 3) + " mol·dm⁻³</strong>; " +
        "m<sub>w</sub> = " + CF.sig(sample.cw, 3) + " · " + CF.fixed(parseFloat(c.vWater) / 1000, 4) + " · " + CF.fixed(parseFloat(c.molar), 2) + " = <strong>" + CF.fixed(sample.mw, 5) + " g</strong>.</p>";
    }
    setHTML("calc-work-1", line("A", data.a) + line("B", data.b));

    function line2(label, sample) {
      if (!sample || !Number.isFinite(sample.ct)) {
        return "<p><strong>" + label + ".</strong> —</p>";
      }
      return "<p><strong>" + label + ".</strong> " +
        "m<sub>t</sub> = " + CF.fixed(sample.mass, 4) + " − " + CF.fixed(Math.max(sample.mw, 0), 5) + " = <strong>" + CF.fixed(sample.mt, 5) + " g</strong>; " +
        "c<sub>t</sub> = " + CF.fixed(sample.mt, 5) + " / (" + CF.fixed(parseFloat(c.vTol) / 1000, 4) + " · " + CF.fixed(parseFloat(c.molar), 2) + ") = <strong>" + CF.sig(sample.ct, 3) + " mol·dm⁻³</strong>.</p>";
    }
    setHTML("calc-work-2", line2("A", data.a) + line2("B", data.b));

    function line3(label, sample) {
      if (!sample || !Number.isFinite(sample.alpha)) {
        return "<p><strong>" + label + ".</strong> —</p>";
      }
      return "<p><strong>" + label + ".</strong> " +
        "α = [−" + CF.sci(parseFloat(c.ka), 2) + " + √((" + CF.sci(parseFloat(c.ka), 2) + ")<sup>2</sup> + 4·" + CF.sci(parseFloat(c.ka), 2) + "·" + CF.sig(sample.cw, 3) + ")] / (2·" + CF.sig(sample.cw, 3) + ") = <strong>" + CF.pct(sample.alpha, 2) + "</strong>; " +
        "[H⁺] = " + CF.sci(sample.proton, 2) + " mol·dm⁻³; pH = " + CF.fixed(sample.pH, 2) + ".</p>";
    }
    setHTML("calc-work-3", line3("A", data.a) + line3("B", data.b));
  }

  function renderCalc() {
    const data = readCalcInputs();
    const a = data.a;
    const b = data.b;
    const cell = function (value) { return "<td>" + value + "</td>"; };

    function sampleLabel(sample, name) {
      return "<td><strong>" + name + "</strong><br><small>m = " + CF.fixed(sample.mass, 4) + " g</small></td>";
    }

    setHTML("tbody-step1",
      "<tr>" + sampleLabel(a, "A") + cell(CF.fixed(a.vNaOH, 2)) + cell(CF.sig(a.nNaOH, 3)) + cell(CF.sig(a.cw, 3)) + cell(CF.fixed(a.mw, 5)) + "</tr>" +
      "<tr>" + sampleLabel(b, "B") + cell(CF.fixed(b.vNaOH, 2)) + cell(CF.sig(b.nNaOH, 3)) + cell(CF.sig(b.cw, 3)) + cell(CF.fixed(b.mw, 5)) + "</tr>"
    );

    setHTML("tbody-step2",
      "<tr>" + sampleLabel(a, "A") + cell(CF.fixed(a.mass, 4)) + cell(CF.fixed(a.mw, 5)) + cell(CF.fixed(a.mt, 5)) + cell(CF.sig(a.ct, 3)) + "</tr>" +
      "<tr>" + sampleLabel(b, "B") + cell(CF.fixed(b.mass, 4)) + cell(CF.fixed(b.mw, 5)) + cell(CF.fixed(b.mt, 5)) + cell(CF.sig(b.ct, 3)) + "</tr>"
    );

    setHTML("tbody-step3",
      "<tr>" + sampleLabel(a, "A") + cell(CF.sig(a.cw, 3)) + cell(CF.pct(a.alpha, 2)) + cell(CF.pct(a.alphaApprox, 2)) + cell(CF.sci(a.proton, 2)) + cell(CF.fixed(a.pH, 2)) + "</tr>" +
      "<tr>" + sampleLabel(b, "B") + cell(CF.sig(b.cw, 3)) + cell(CF.pct(b.alpha, 2)) + cell(CF.pct(b.alphaApprox, 2)) + cell(CF.sci(b.proton, 2)) + cell(CF.fixed(b.pH, 2)) + "</tr>"
    );

    setHTML("tbody-step4",
      "<tr>" + sampleLabel(a, "A") + cell(CF.sig(a.ct, 3)) + cell(CF.sig(a.cw, 3)) + cell(CF.sig(a.Ksimple, 3)) + cell(CF.sig(a.Kscript, 4)) + "</tr>" +
      "<tr>" + sampleLabel(b, "B") + cell(CF.sig(b.ct, 3)) + cell(CF.sig(b.cw, 3)) + cell(CF.sig(b.Ksimple, 3)) + cell(CF.sig(b.Kscript, 4)) + "</tr>"
    );

    setHTML("tbody-decomp",
      "<tr>" + sampleLabel(a, "A") + cell(CF.sig(a.Ksimple, 3)) + cell(CF.sig(a.Kdiss, 3)) + cell(CF.sig(a.Kassoc, 3)) + cell(CF.sig(a.Kscript, 4)) + "</tr>" +
      "<tr>" + sampleLabel(b, "B") + cell(CF.sig(b.Ksimple, 3)) + cell(CF.sig(b.Kdiss, 3)) + cell(CF.sig(b.Kassoc, 3)) + cell(CF.sig(b.Kscript, 4)) + "</tr>"
    );

    renderCalcWork(data);

    setText("calc-k2-a", CF.sig(a.Kscript, 4));
    setText("calc-k2-b", CF.sig(b.Kscript, 4));
    let diff = NaN;
    let ratio = NaN;
    if (Number.isFinite(a.Kscript) && Number.isFinite(b.Kscript)) {
      const mean = (a.Kscript + b.Kscript) / 2;
      if (mean !== 0) diff = Math.abs(a.Kscript - b.Kscript) / Math.abs(mean) * 100;
      if (a.Kscript !== 0) ratio = b.Kscript / a.Kscript;
    }
    setText("calc-k2-diff", Number.isFinite(diff) ? CF.fixed(diff, 1) + " %" : "—");
    setText("calc-k2-ratio", Number.isFinite(ratio) ? CF.fixed(ratio, 3) : "—");

    const problems = [];
    if (!(a.vNaOH > 0)) problems.push("Naważka A: brak poprawnej średniej objętości NaOH.");
    if (!(b.vNaOH > 0)) problems.push("Naważka B: brak poprawnej średniej objętości NaOH.");
    if (a.mt < 0) problems.push("Naważka A: masa w fazie wodnej przewyższa naważkę (m<sub>t</sub> < 0).");
    if (b.mt < 0) problems.push("Naważka B: masa w fazie wodnej przewyższa naważkę (m<sub>t</sub> < 0).");
    if (!(parseFloat(state.calc.vAliquot) > 0)) problems.push("Objętość próbki do miareczkowania musi być większa od zera.");
    if (!(parseFloat(state.calc.molar) > 0)) problems.push("Masa molowa musi być większa od zera.");

    const warning = $("calc-warning");
    if (warning) {
      warning.hidden = problems.length === 0;
      warning.innerHTML = problems.length
        ? "<strong>Sprawdź dane wejściowe.</strong><ul>" + problems.map(function (problem) { return "<li>" + problem + "</li>"; }).join("") + "</ul>"
        : "";
    }

    const comparison = $("calc-comparison");
    if (comparison) {
      if (!a.valid || !b.valid) {
        comparison.innerHTML = "<p>Uzupełnij poprawne dane dla obu naważek, aby porównać wyniki.</p>";
      } else {
        let verdict;
        let className;
        if (diff < 5) {
          verdict = "Wyniki są bardzo zbliżone";
          className = "good";
        } else if (diff < 15) {
          verdict = "Zgodność jest umiarkowana";
          className = "medium";
        } else {
          verdict = "Wyniki wyraźnie się różnią";
          className = "bad";
        }
        const diffK1 = (Number.isFinite(a.Ksimple) && Number.isFinite(b.Ksimple) && (a.Ksimple + b.Ksimple) !== 0)
          ? Math.abs(a.Ksimple - b.Ksimple) / Math.abs((a.Ksimple + b.Ksimple) / 2) * 100
          : NaN;
        const fitNote = Number.isFinite(diff) && diff < 2
          ? "Bardzo dobra zgodność K₂ wspiera stosowanie poprawek."
          : "Pozostała różnica między naważkami może wynikać z tego, że model zakłada dominację dimeru tylko w przybliżeniu.";
        comparison.innerHTML = '<div class="comparison-header"><span>Zgodność wyników</span><strong class="' + className + '">' + verdict + '</strong></div>' +
          "<p>Różnica względna K₂ między naważkami wynosi <strong>" + (Number.isFinite(diff) ? CF.fixed(diff, 1) + " %" : "—") + "</strong>. " +
          "Dla porównania K₁ zmienia się o " + (Number.isFinite(diffK1) ? CF.fixed(diffK1, 1) + " %" : "—") + " (A: " + CF.sig(a.Ksimple, 3) + ", B: " + CF.sig(b.Ksimple, 3) + "). " +
          "Dla naważki A α = " + CF.pct(a.alpha, 2) + ", dla B α = " + CF.pct(b.alpha, 2) + ". " +
          "Wzrost stężenia kwasu w wodzie zwiększa dysocjację, więc poprawka (1 − α) odgrywa większą rolę w próbce B.</p>" +
          "<p class=\"small-note\">Porównuj przede wszystkim wartości otrzymane tym samym wzorem. Przy silnej dimeryzacji <span class=\"math\">K<sub>2</sub> = √(2K<sub>as</sub>)·K<sub>monomer</sub></span> — nie jest to czysty współczynnik podziału monomeru i ma wymiar <span class=\"math\">(mol·dm⁻³)<sup>−1/2</sup></span>. " + fitNote + "</p>";
      }
    }

    calcBadge();
  }

  function initCalculations() {
    fillCalcInputs();

    Object.keys(CALC_FIELDS).forEach(function (key) {
      const el = $(CALC_FIELDS[key]);
      if (!el) return;
      el.addEventListener("input", function () {
        state.calc[key] = el.value;
        save();
        renderCalc();
      });
    });

    const run = $("calc-run");
    if (run) run.addEventListener("click", function () {
      renderCalc();
      toast("Obliczenia zaktualizowane.", "success");
    });

    const loadLab = $("calc-load-lab");
    if (loadLab) loadLab.addEventListener("click", function () {
      const meanA = labMean("a");
      const meanB = labMean("b");
      if (!Number.isFinite(meanA) && !Number.isFinite(meanB)) {
        toast("Najpierw wpisz objętości miareczkowania w karcie wyników (moduł 07).", "warning");
        return;
      }
      if (state.lab.massA) state.calc.massA = state.lab.massA;
      if (state.lab.massB) state.calc.massB = state.lab.massB;
      if (Number.isFinite(meanA)) state.calc.vA = meanA.toFixed(3);
      if (Number.isFinite(meanB)) state.calc.vB = meanB.toFixed(3);
      save();
      fillCalcInputs();
      renderCalc();
      toast("Wczytano dane z karty wyników.", "success");
    });

    const reset = $("calc-reset");
    if (reset) reset.addEventListener("click", function () {
      state.calc = mergeDefaults(DEFAULT_STATE.calc, {});
      save();
      fillCalcInputs();
      renderCalc();
      toast("Przywrócono dane przykładowe.", "info");
    });

    const clear = $("calc-clear");
    if (clear) clear.addEventListener("click", function () {
      ["massA", "massB", "vA", "vB"].forEach(function (key) {
        state.calc[key] = "";
        setValue(CALC_FIELDS[key], "");
      });
      save();
      renderCalc();
      toast("Wyczyszczono masy i objętości. Stałe pozostały bez zmian.", "info");
    });

    const copy = $("calc-copy");
    if (copy) copy.addEventListener("click", function () {
      const data = readCalcInputs();
      const text = "WYNIKI — WSPÓŁCZYNNIK PODZIAŁU\n" +
        "Naważka A: m = " + CF.fixed(data.a.mass, 4) + " g, V(NaOH) = " + CF.fixed(data.a.vNaOH, 2) + " cm3, c_w = " + CF.sig(data.a.cw, 3) + " M, c_t = " + CF.sig(data.a.ct, 3) + " M, alpha = " + CF.pct(data.a.alpha, 2) + ", K1 = " + CF.sig(data.a.Ksimple, 3) + ", K2 = " + CF.sig(data.a.Kscript, 4) + "\n" +
        "Naważka B: m = " + CF.fixed(data.b.mass, 4) + " g, V(NaOH) = " + CF.fixed(data.b.vNaOH, 2) + " cm3, c_w = " + CF.sig(data.b.cw, 3) + " M, c_t = " + CF.sig(data.b.ct, 3) + " M, alpha = " + CF.pct(data.b.alpha, 2) + ", K1 = " + CF.sig(data.b.Ksimple, 3) + ", K2 = " + CF.sig(data.b.Kscript, 4);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          toast("Wyniki skopiowane do schowka.", "success");
        }).catch(function () {
          toast("Nie udało się skopiować wyników.", "warning");
        });
      } else {
        CF.download("wyniki-wspolczynnik-podzialu.txt", text);
        toast("Wyniki zapisano w pliku.", "success");
      }
    });

    const toReport = $("calc-to-report");
    if (toReport) toReport.addEventListener("click", function () {
      save();
      if (location.hash === "#report") showPage("report", { force: true });
      else location.hash = "report";
      toast("Wyniki są dostępne w szkicu sprawozdania.", "success");
    });

    renderCalc();
  }

  /* ============================================================
     09 — NIEPEWNOŚĆ
     ============================================================ */

  function initErrors() {
    const series = $("err-series");
    const resolution = $("err-resolution");
    const scriptMode = $("err-script-mode");
    if (!series || !resolution || !scriptMode) return;

    series.value = state.errors.series;
    resolution.value = state.errors.resolution;
    scriptMode.checked = !!state.errors.scriptMode;

    function update() {
      const values = CF.parseNumbers(series.value);
      const delta = parseFloat(resolution.value);
      const n = values.length;
      const mean = CF.mean(values);
      const sd = CF.sd(values);
      const useScript = scriptMode.checked;
      const t = n >= 2 ? ((useScript && n >= 10) ? 1 : CF.tValue(n - 1)) : NaN;
      const ua = n >= 2 ? t * sd / Math.sqrt(n) : NaN;
      const ub = Number.isFinite(delta) && delta > 0 ? delta / Math.sqrt(3) : 0;
      const uc = Math.sqrt(Math.pow(ua || 0, 2) + Math.pow(ub, 2));
      const relative = Number.isFinite(mean) && mean !== 0 ? uc / Math.abs(mean) : NaN;

      setText("err-n", String(n));
      setText("err-mean", n >= 1 ? CF.sig(mean, 5) : "—");
      setText("err-sd", n >= 2 ? CF.sig(sd, 3) : "—");
      setText("err-ua", n >= 2 ? CF.sig(ua, 3) : "—");
      setText("err-t", n >= 2 ? CF.fixed(t, 4) : "—");
      setText("err-ub", CF.sig(ub, 3));
      setText("err-uc", n >= 2 ? CF.sig(uc, 3) : "—");
      setText("err-rel", Number.isFinite(relative) ? CF.pct(relative, 2) : "—");
      setText("err-format", n >= 2 ? CF.formatUncertainty(mean, uc) : "—");

      if (n >= 2) {
        const stepHtml = "<p><strong>Średnia:</strong> x̄ = (" + values.map(function (value) { return CF.sig(value, 6); }).join(" + ") + ") / " + n + " = <strong>" + CF.sig(mean, 6) + "</strong>.</p>" +
          "<p><strong>Odchylenie standardowe:</strong> s = √[Σ(x<sub>i</sub> − x̄)<sup>2</sup>/(n − 1)] = <strong>" + CF.sig(sd, 4) + "</strong>.</p>" +
          "<p class=\"small-note\">s to odchylenie standardowe próbki; odchylenie standardowe średniej s<sub>x̄</sub> = s/√n = " + CF.sig(sd / Math.sqrt(n), 4) + ".</p>" +
          "<p><strong>Niepewność typu A:</strong> u<sub>A</sub> = t·s/√n = " + CF.fixed(t, 4) + " · " + CF.sig(sd, 4) + " / √" + n + " = <strong>" + CF.sig(ua, 4) + "</strong>.</p>" +
          "<p><strong>Niepewność typu B:</strong> u<sub>B</sub> = ΔX/√3 = " + CF.fixed(delta, 4) + " / 1,732 = <strong>" + CF.sig(ub, 4) + "</strong>.</p>" +
          "<p><strong>Niepewność całkowita:</strong> u<sub>c</sub> = √(u<sub>A</sub><sup>2</sup> + u<sub>B</sub><sup>2</sup>) = <strong>" + CF.sig(uc, 4) + "</strong>.</p>" +
          "<p><strong>Niepewność względna całkowita:</strong> u<sub>c</sub>/|x̄| = <strong>" + (Number.isFinite(relative) ? CF.pct(relative, 2) : "—") + "</strong>.</p>" +
          (useScript && n >= 10 ? "<p class=\"small-note\">Tryb skryptu: dla n ≥ 10 przyjęto t = 1, zgodnie z uproszczeniem w skrypcie.</p>" : "") +
          "<p class=\"small-note\">Skrypt oznacza przez ε stosunek s<sub>x̄</sub>/x̄ (tylko typ A, wzór 9). Powyżej podano u<sub>c</sub>/|x̄|, ponieważ uwzględniono także typ B.</p>";
        setHTML("err-steps", stepHtml);
      } else {
        setHTML("err-steps", "<p>Wpisz co najmniej dwa wyniki pomiarów, aby obliczyć odchylenie standardowe i niepewność typu A.</p>");
      }

      state.errors = {
        series: series.value,
        resolution: resolution.value,
        scriptMode: scriptMode.checked
      };
      save();
    }

    [series, resolution, scriptMode].forEach(function (el) { el.addEventListener("input", update); });
    update();
  }

  /* ============================================================
     10 — REGRESJA
     ============================================================ */

  function initGraphs() {
    const tbody = $("graph-table");
    const canvas = $("regression-canvas");
    if (!tbody || !canvas) return;

    function drawGraph() {
      const currentCanvas = $("regression-canvas");
      if (!currentCanvas) return;
      const reg = CF.regression(state.graph.data);
      CF.drawScatter(currentCanvas, state.graph.data, reg, {
        height: 340,
        xlabel: "x",
        ylabel: "y",
        labelPoints: true,
        includeZeroX: false,
        includeZeroY: false
      });
    }

    function updateRegression() {
      const reg = CF.regression(state.graph.data);
      setText("reg-n", String(reg.n || 0));
      if (reg.valid) {
        setText("reg-slope", CF.sig(reg.slope, 4));
        setText("reg-intercept", CF.sig(reg.intercept, 4));
        setText("reg-r2", CF.fixed(reg.r2, 4));
        setText("reg-se-slope", CF.sig(reg.seSlope, 3));
        setText("reg-se-intercept", CF.sig(reg.seIntercept, 3));
        const sign = reg.intercept >= 0 ? "+" : "−";
        setText("reg-equation", "y = " + CF.sig(reg.slope, 4) + "·x " + sign + " " + CF.sig(Math.abs(reg.intercept), 4));
      } else {
        ["reg-slope", "reg-intercept", "reg-r2", "reg-se-slope", "reg-se-intercept", "reg-equation"].forEach(function (id) {
          setText(id, "—");
        });
      }
      drawGraph();
    }

    function renderTable() {
      if (!state.graph.data.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-cell">Brak punktów. Dodaj punkt lub wczytaj przykład.</td></tr>';
        updateRegression();
        return;
      }
      tbody.innerHTML = state.graph.data.map(function (point, index) {
        return "<tr>" +
          "<td>" + (index + 1) + "</td>" +
          '<td><input class="input table-input" type="number" step="any" data-graph-x="' + index + '" value="' + (point.x == null ? "" : point.x) + '" aria-label="x punktu ' + (index + 1) + '"></td>' +
          '<td><input class="input table-input" type="number" step="any" data-graph-y="' + index + '" value="' + (point.y == null ? "" : point.y) + '" aria-label="y punktu ' + (index + 1) + '"></td>' +
          '<td><button type="button" class="icon-btn remove-row" data-remove-graph="' + index + '" aria-label="Usuń punkt ' + (index + 1) + '">×</button></td>' +
          "</tr>";
      }).join("");
      updateRegression();
    }

    tbody.addEventListener("input", function (event) {
      const xInput = event.target.closest("[data-graph-x]");
      const yInput = event.target.closest("[data-graph-y]");
      if (!xInput && !yInput) return;
      const index = parseInt((xInput || yInput).dataset[xInput ? "graphX" : "graphY"], 10);
      if (!state.graph.data[index]) return;
      const raw = event.target.value.trim();
      const value = raw === "" ? null : Number(raw);
      if (xInput) state.graph.data[index].x = Number.isFinite(value) ? value : null;
      if (yInput) state.graph.data[index].y = Number.isFinite(value) ? value : null;
      save();
      updateRegression();
    });

    tbody.addEventListener("click", function (event) {
      const button = event.target.closest("[data-remove-graph]");
      if (!button) return;
      const index = parseInt(button.dataset.removeGraph, 10);
      state.graph.data.splice(index, 1);
      save();
      renderTable();
    });

    const add = $("graph-add");
    if (add) add.addEventListener("click", function () {
      state.graph.data.push({ x: null, y: null });
      save();
      renderTable();
      const inputs = tbody.querySelectorAll("[data-graph-x]");
      if (inputs.length) inputs[inputs.length - 1].focus();
    });

    const example = $("graph-example");
    if (example) example.addEventListener("click", function () {
      state.graph.data = DEFAULT_STATE.graph.data.map(function (point) { return Object.assign({}, point); });
      save();
      renderTable();
    });

    const clear = $("graph-clear");
    if (clear) clear.addEventListener("click", function () {
      state.graph.data = [];
      save();
      renderTable();
    });

    renderTable();
    CF.registerChart(drawGraph);
  }

  /* ============================================================
     11 — SPRAWOZDANIE
     ============================================================ */

  function updateReportChecklist() {
    const boxes = Array.from(document.querySelectorAll("[data-report-check]"));
    const done = boxes.filter(function (box) { return box.checked; }).length;
    setText("report-check-label", done + " / " + boxes.length);
    const fill = $("report-check-fill");
    if (fill) fill.style.width = (boxes.length ? done / boxes.length * 100 : 0) + "%";
  }

  function updateReportPreview() {
    const data = readCalcInputs();
    const a = data.a;
    const b = data.b;
    const valid = a.valid && b.valid;
    const preview = $("report-results-preview");
    if (!preview) return;
    if (!valid) {
      preview.innerHTML = "<p>Uzupełnij arkusz obliczeń (moduł 08), aby zobaczyć tabelę wyników gotową do przeniesienia.</p>";
      return;
    }
    preview.innerHTML = (Object.keys(CALC_FIELDS).every(function (key) {
      return String(state.calc[key] || "") === String(DEFAULT_STATE.calc[key]);
    }) ? '<p class="small-note"><strong>Uwaga:</strong> w arkuszu nadal są dane przykładowe — wpisz własne wyniki przed oddaniem sprawozdania.</p>' : "") +
      '<p class="preview-label">Wyniki z arkusza obliczeń</p><div class="table-wrap"><table class="data-table compact-table"><thead><tr><th>Naważka</th><th>c<sub>w</sub> [M]</th><th>c<sub>t</sub> [M]</th><th>α [%]</th><th>K₁</th><th>K₂</th></tr></thead><tbody>' +
      "<tr><td>A (" + CF.fixed(a.mass, 4) + " g)</td><td>" + CF.sig(a.cw, 3) + "</td><td>" + CF.sig(a.ct, 3) + "</td><td>" + CF.pct(a.alpha, 2) + "</td><td>" + CF.sig(a.Ksimple, 3) + "</td><td>" + CF.sig(a.Kscript, 4) + "</td></tr>" +
      "<tr><td>B (" + CF.fixed(b.mass, 4) + " g)</td><td>" + CF.sig(b.cw, 3) + "</td><td>" + CF.sig(b.ct, 3) + "</td><td>" + CF.pct(b.alpha, 2) + "</td><td>" + CF.sig(b.Ksimple, 3) + "</td><td>" + CF.sig(b.Kscript, 4) + "</td></tr>" +
      "</tbody></table></div>";
  }

  function reportDraftHTML() {
    const data = readCalcInputs();
    const a = data.a;
    const b = data.b;
    const r = state.report;
    const name = r.name ? escapeText(r.name) : "…………………………………………";
    const group = r.group ? escapeText(r.group) : "…………";
    const field = r.field ? escapeText(r.field) : "……………………";
    const date = r.date ? escapeText(r.date) : "……………………";
    const aim = r.aim ? escapeText(r.aim) : "[Uzupełnij cel ćwiczenia własnymi słowami.]";
    const discussion = r.discussion ? escapeText(r.discussion) : "[Uzupełnij dyskusję: zgodność wyników, błędy, przyczyny odchyleń, ograniczenia metody.]";
    const conclusions = r.conclusions ? escapeText(r.conclusions) : "[Uzupełnij wnioski — odpowiedz na cel ćwiczenia.]";

    const labParts = [];
    if (state.lab.massA || state.lab.massB) {
      labParts.push("Masy naważek: A = " + escapeText(state.lab.massA || "—") + " g, B = " + escapeText(state.lab.massB || "—") + " g.");
    }
    if (state.lab.v1a || state.lab.v2a || state.lab.v1b || state.lab.v2b) {
      labParts.push("Objętości NaOH: A — V₁ = " + escapeText(state.lab.v1a || "—") + " cm³, V₂ = " + escapeText(state.lab.v2a || "—") + " cm³; B — V₁ = " + escapeText(state.lab.v1b || "—") + " cm³, V₂ = " + escapeText(state.lab.v2b || "—") + " cm³.");
    }
    if (state.lab.temp) labParts.push("Temperatura: " + escapeText(state.lab.temp) + " °C.");
    if (state.lab.appearance) labParts.push("Wygląd fazy wodnej: " + escapeText(state.lab.appearance) + ".");
    if (state.lab.notes) labParts.push("Obserwacje: " + escapeText(state.lab.notes));
    const labBlock = labParts.length
      ? "<p><strong>Dane z karty laboratoryjnej:</strong> " + labParts.join(" ") + "</p>"
      : "<p>[Uzupełnij rzeczywiste masy, objętości, czas, temperaturę i obserwacje.]</p>";
    const usingExampleData = Object.keys(CALC_FIELDS).every(function (key) {
      return String(state.calc[key] || "") === String(DEFAULT_STATE.calc[key]);
    });
    const exampleWarning = usingExampleData
      ? '<p class="draft-warning">Uwaga: arkusz obliczeń nadal zawiera dane przykładowe. Przed oddaniem sprawozdania wpisz własne wyniki.</p>'
      : "";

    const results = (a.valid && b.valid)
      ? '<div class="table-wrap"><table class="data-table compact-table"><thead><tr><th>Naważka</th><th>m [g]</th><th>V(NaOH) [cm³]</th><th>c<sub>w</sub> [M]</th><th>c<sub>t</sub> [M]</th><th>α [%]</th><th>K₁</th><th>K₂</th></tr></thead><tbody>' +
        "<tr><td>A</td><td>" + CF.fixed(a.mass, 4) + "</td><td>" + CF.fixed(a.vNaOH, 2) + "</td><td>" + CF.sig(a.cw, 3) + "</td><td>" + CF.sig(a.ct, 3) + "</td><td>" + CF.pct(a.alpha, 2) + "</td><td>" + CF.sig(a.Ksimple, 3) + "</td><td>" + CF.sig(a.Kscript, 4) + "</td></tr>" +
        "<tr><td>B</td><td>" + CF.fixed(b.mass, 4) + "</td><td>" + CF.fixed(b.vNaOH, 2) + "</td><td>" + CF.sig(b.cw, 3) + "</td><td>" + CF.sig(b.ct, 3) + "</td><td>" + CF.pct(b.alpha, 2) + "</td><td>" + CF.sig(b.Ksimple, 3) + "</td><td>" + CF.sig(b.Kscript, 4) + "</td></tr>" +
        "</tbody></table></div>"
      : "<p>[Uzupełnij arkusz obliczeń, aby wstawić tabelę wyników.]</p>";

    return '<article class="report-draft">' +
      '<div class="draft-warning">Szkic pomocniczy — sprawozdanie należy napisać odręcznie, własnymi słowami, zgodnie z wymaganiami prowadzącego.</div>' +
      exampleWarning +
      '<div class="draft-cover"><p>Ćwiczenia laboratoryjne z chemii fizycznej</p><h1>Temat: ' + escapeText(r.topic || "Współczynnik podziału substancji") + "</h1>" +
      "<p><strong>Imię i nazwisko:</strong> " + name + "</p><p><strong>Kierunek:</strong> " + field + " &nbsp; <strong>Grupa:</strong> " + group + "</p>" +
      "<p><strong>Data wykonania:</strong> " + date + "</p></div>" +
      "<h2>1. Cel ćwiczenia</h2><p>" + aim + "</p>" +
      "<h2>2. Wstęp teoretyczny — punkty do opracowania</h2>" +
      "<ul><li>potencjał chemiczny, aktywność i współczynnik aktywności,</li><li>prawo podziału Nernsta i warunki jego stosowalności,</li><li>dysocjacja kwasu benzoesowego i pełne prawo Ostwalda,</li><li>asocjacja (dimeryzacja) w toluenie i poprawka √c<sub>t</sub>,</li><li>ekstrakcja jednostopniowa i wielostopniowa,</li><li>znaczenie współczynnika podziału dla aktywności biologicznej.</li></ul>" +
      "<h2>3. Wykonanie ćwiczenia — szkielet opisu</h2>" +
      "<p>Odważono dwie naważki kwasu benzoesowego, przeniesiono je ilościowo do butelek z toluenem i rozpuszczono. Dodano wodę destylowaną, a następnie wytrząsano mieszaniny do osiągnięcia równowagi. Po rozdzieleniu faz pobrano próbki fazy wodnej i miareczkowano roztworem NaOH wobec fenoloftaleiny. Fazę organiczną usunięto do pojemnika na odpady organiczne.</p>" +
      labBlock +
      "<h2>4. Opracowanie wyników</h2>" +
      "<p>Stężenie kwasu w fazie wodnej obliczono z wyników miareczkowania, a masę w fazie organicznej — z bilansu masy. Stopień dysocjacji wyznaczono z pełnego prawa Ostwalda. Współczynnik podziału obliczono ze wzorów K₁ = c<sub>t</sub>/c<sub>w</sub> oraz K₂ = √c<sub>t</sub>/[c<sub>w</sub>(1 − α)].</p>" +
      results +
      '<p class="small-note">[Wstaw obliczenia pośrednie, jednostki i niepewności. Dodaj numer tabeli i odwołanie w tekście.]</p>' +
      "<h2>5. Dyskusja</h2><p>" + discussion + "</p>" +
      "<h2>6. Wnioski</h2><p>" + conclusions + "</p>" +
      "<h2>Bibliografia</h2><ol><li>Danek A. <em>Równowagi fazowe</em>. W: <em>Chemia fizyczna. Podręcznik dla studentów farmacji</em>. PZWL, Warszawa 1972, s. 94–164.</li><li>Malesiński W. <em>Układy wieloskładnikowe, wielofazowe</em>. W: <em>Chemia fizyczna</em>. PWN, Warszawa 1963, s. 435–474.</li><li>Szymura-Oleksiak J. <em>Równowagi w roztworach elektrolitów</em>. W: <em>Farmacja fizyczna</em>. PZWL, Warszawa 1999, s. 184–246.</li></ol>" +
      "</article>";
  }

  function reportDraftText() {
    const data = readCalcInputs();
    const a = data.a;
    const b = data.b;
    const r = state.report;
    const labBits = [];
    if (state.lab.massA || state.lab.massB) labBits.push("Masy naważek: A = " + (state.lab.massA || "—") + " g, B = " + (state.lab.massB || "—") + " g.");
    if (state.lab.v1a || state.lab.v2a || state.lab.v1b || state.lab.v2b) labBits.push("Objętości NaOH: A — V1 = " + (state.lab.v1a || "—") + " cm3, V2 = " + (state.lab.v2a || "—") + " cm3; B — V1 = " + (state.lab.v1b || "—") + " cm3, V2 = " + (state.lab.v2b || "—") + " cm3.");
    if (state.lab.temp) labBits.push("Temperatura: " + state.lab.temp + " °C.");
    if (state.lab.appearance) labBits.push("Wygląd fazy wodnej: " + state.lab.appearance + ".");
    if (state.lab.notes) labBits.push("Obserwacje: " + state.lab.notes);
    const usingExampleData = Object.keys(CALC_FIELDS).every(function (key) {
      return String(state.calc[key] || "") === String(DEFAULT_STATE.calc[key]);
    });
    return [
      "ĆWICZENIA LABORATORYJNE Z CHEMII FIZYCZNEJ",
      "Temat: " + (r.topic || "Współczynnik podziału substancji"),
      "Imię i nazwisko: " + (r.name || "……………………"),
      "Kierunek: " + (r.field || "……………………") + "    Grupa: " + (r.group || "…………"),
      "Data wykonania: " + (r.date || "……………………"),
      usingExampleData ? "UWAGA: arkusz obliczeń nadal zawiera dane przykładowe. Przed oddaniem sprawozdania wpisz własne wyniki." : "",
      "",
      "1. CEL ĆWICZENIA",
      r.aim || "[Uzupełnij cel.]",
      "",
      "2. WSTĘP TEORETYCZNY — PUNKTY DO OPRACOWANIA",
      "- potencjał chemiczny, aktywność, współczynnik aktywności",
      "- prawo podziału Nernsta i warunki stosowalności",
      "- dysocjacja i pełne prawo Ostwalda",
      "- asocjacja w toluenie i poprawka √ct",
      "- ekstrakcja jednostopniowa i wielostopniowa",
      "- znaczenie biologiczne współczynnika podziału",
      "",
      "3. WYKONANIE ĆWICZENIA — SZKIELET",
      "Odważono dwie naważki kwasu benzoesowego, przeniesiono ilościowo do butelek z toluenem, dodano wodę i wytrząsano. Po rozdzieleniu faz miareczkowano próbki fazy wodnej roztworem NaOH wobec fenoloftaleiny.",
      labBits.length ? "Dane z karty: " + labBits.join(" ") : "[Uzupełnij rzeczywiste masy, objętości, czas, temperaturę i obserwacje.]",
      "",
      "4. OPRACOWANIE WYNIKÓW",
      a.valid && b.valid
        ? "Naważka A: c_w = " + CF.sig(a.cw, 3) + " M; c_t = " + CF.sig(a.ct, 3) + " M; alpha = " + CF.pct(a.alpha, 2) + "; K1 = " + CF.sig(a.Ksimple, 3) + "; K2 = " + CF.sig(a.Kscript, 4) + "\n" +
          "Naważka B: c_w = " + CF.sig(b.cw, 3) + " M; c_t = " + CF.sig(b.ct, 3) + " M; alpha = " + CF.pct(b.alpha, 2) + "; K1 = " + CF.sig(b.Ksimple, 3) + "; K2 = " + CF.sig(b.Kscript, 4)
        : "[Uzupełnij arkusz obliczeń.]",
      "",
      "5. DYSKUSJA",
      r.discussion || "[Uzupełnij dyskusję.]",
      "",
      "6. WNIOSKI",
      r.conclusions || "[Uzupełnij wnioski.]",
      "",
      "BIBLIOGRAFIA",
      "1. Danek A. Równowagi fazowe. W: Chemia fizyczna. Podręcznik dla studentów farmacji. PZWL, Warszawa 1972, s. 94–164.",
      "2. Malesiński W. Układy wieloskładnikowe, wielofazowe. W: Chemia fizyczna. PWN, Warszawa 1963, s. 435–474.",
      "3. Szymura-Oleksiak J. Równowagi w roztworach elektrolitów. W: Farmacja fizyczna. PZWL, Warszawa 1999, s. 184–246.",
      "",
      "SZKIC POMOCNICZY — sprawozdanie należy napisać odręcznie, własnymi słowami."
    ].join("\n");
  }

  function openReportDraft() {
    const footer = '<button type="button" class="btn btn-primary" data-print-modal>Drukuj / zapisz PDF</button>' +
      '<button type="button" class="btn btn-ghost" data-close-modal>Zamknij</button>';
    openModal(reportDraftHTML(), { title: "Szkic sprawozdania", footer: footer, className: "report-modal" });
  }

  function initReport() {
    const mapping = {
      "report-name": "name",
      "report-field": "field",
      "report-group": "group",
      "report-date": "date",
      "report-topic": "topic",
      "report-aim": "aim",
      "report-discussion": "discussion",
      "report-conclusions": "conclusions"
    };

    Object.keys(mapping).forEach(function (id) {
      const el = $(id);
      if (!el) return;
      el.value = state.report[mapping[id]] || "";
      el.addEventListener("input", function () {
        state.report[mapping[id]] = el.value;
        save();
        if (id === "report-topic") updateReportPreview();
      });
    });

    document.querySelectorAll("[data-report-check]").forEach(function (box) {
      const key = box.dataset.reportCheck;
      box.checked = !!state.report.checks[key];
      box.addEventListener("change", function () {
        state.report.checks[key] = box.checked;
        save();
        updateReportChecklist();
      });
    });

    updateReportChecklist();
    updateReportPreview();

    const generate = $("report-generate");
    if (generate) generate.addEventListener("click", openReportDraft);

    const download = $("report-download");
    if (download) download.addEventListener("click", function () {
      CF.download("szkic-sprawozdania.txt", reportDraftText(), "text/plain;charset=utf-8");
      toast("Szkic sprawozdania pobrany.", "success");
    });

    const print = $("report-print");
    if (print) print.addEventListener("click", openReportDraft);
  }

  /* ============================================================
     12 — TEST
     ============================================================ */

  function updateQuizProgress() {
    const total = GUIDE.quiz.length;
    const answered = GUIDE.quiz.filter(function (item) {
      return !!document.querySelector('input[name="' + item.id + '"]:checked');
    }).length;
    setText("quiz-progress-text", "Odpowiedziano: " + answered + " / " + total);
    const fill = $("quiz-progress-fill");
    if (fill) fill.style.width = (answered / total * 100) + "%";
  }

  function updateBestScore() {
    const best = state.quiz.best;
    setText("quiz-best", best ? best.score + "/" + best.total + " (" + CF.fixed(best.percent, 0) + "%)" : "—");
  }

  function initQuiz() {
    const form = $("quiz-form");
    if (!form) return;
    updateBestScore();
    updateQuizProgress();

    form.addEventListener("change", function (event) {
      if (event.target.matches('input[type="radio"]')) {
        const question = event.target.closest(".quiz-question");
        if (question) question.classList.remove("unanswered");
        updateQuizProgress();
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const questions = Array.from(form.querySelectorAll(".quiz-question"));
      const unanswered = [];
      let score = 0;

      questions.forEach(function (question) {
        const selected = question.querySelector('input[type="radio"]:checked');
        if (!selected) {
          unanswered.push(question);
          question.classList.add("unanswered");
          return;
        }
        const correct = parseInt(question.dataset.correct, 10);
        const chosen = parseInt(selected.value, 10);
        const options = question.querySelectorAll(".quiz-option");
        const feedback = question.querySelector(".quiz-feedback");
        question.classList.remove("is-correct", "is-wrong", "unanswered");

        options.forEach(function (option, index) {
          option.classList.toggle("correct-option", index === correct);
          option.classList.toggle("wrong-option", index === chosen && chosen !== correct);
        });

        const item = GUIDE.quiz.find(function (entry) {
          return entry.id === question.dataset.quizId;
        });
        const explanation = item ? item.explain : "";

        if (chosen === correct) {
          score += 1;
          question.classList.add("is-correct");
          if (feedback) feedback.innerHTML = "<strong>Dobrze.</strong> " + explanation;
        } else {
          question.classList.add("is-wrong");
          if (feedback) feedback.innerHTML = "<strong>Poprawna odpowiedź: " + String.fromCharCode(65 + correct) + ".</strong> " + explanation;
        }
      });

      if (unanswered.length) {
        toast("Odpowiedz na wszystkie pytania. Brakuje " + unanswered.length + ".", "warning");
        unanswered[0].scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      const total = questions.length;
      const percent = score / total * 100;
      const result = $("quiz-result");
      if (result) result.hidden = false;
      setText("quiz-score", String(score));
      const ring = $("score-ring");
      if (ring) ring.style.setProperty("--score-angle", (percent * 3.6).toFixed(1) + "deg");

      let verdict;
      let summary;
      if (percent >= 90) {
        verdict = "Świetnie opanowany materiał";
        summary = "Potrafisz połączyć teorię z obliczeniami. Wróć do pytań, które sprawiły trudność, i dopracuj szczegóły.";
      } else if (percent >= 80) {
        verdict = "Test zaliczony";
        summary = "Masz solidne podstawy. Przeczytaj wyjaśnienia błędnych odpowiedzi i uzupełnij luki przed sprawozdaniem.";
      } else if (percent >= 60) {
        verdict = "Blisko celu";
        summary = "Część materiału wymaga powtórki. Wróć do modułów wskazanych przez błędne odpowiedzi i spróbuj ponownie.";
      } else {
        verdict = "Warto powtórzyć teorię";
        summary = "Przejdź jeszcze raz przez moduły 01–06, a potem wróć do testu. Skorzystaj z arkusza obliczeń i symulatorów.";
      }
      setText("quiz-verdict", verdict);
      setText("quiz-summary", "Poprawnie: " + score + " z " + total + " (" + CF.fixed(percent, 1) + " %). " + summary);

      if (!state.quiz.best || percent > state.quiz.best.percent) {
        state.quiz.best = { score: score, total: total, percent: percent, date: new Date().toISOString() };
      }
      if (percent >= 80) {
        state.completed.quiz = true;
      }
      save();
      updateBestScore();
      updateProgress();
      renderNav();
      updateCompletionUI();

      questions.forEach(function (question) {
        question.querySelectorAll('input[type="radio"]').forEach(function (radio) { radio.disabled = true; });
      });

      if (result) result.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    const reset = $("quiz-reset");
    if (reset) reset.addEventListener("click", function () {
      form.reset();
      form.querySelectorAll(".quiz-question").forEach(function (question) {
        question.classList.remove("is-correct", "is-wrong", "unanswered");
        question.querySelectorAll('input[type="radio"]').forEach(function (radio) { radio.disabled = false; });
        const options = question.querySelectorAll(".quiz-option");
        options.forEach(function (option) {
          option.classList.remove("correct-option", "wrong-option");
        });
        const feedback = question.querySelector(".quiz-feedback");
        if (feedback) feedback.textContent = "";
      });
      const result = $("quiz-result");
      if (result) result.hidden = true;
      updateQuizProgress();
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    const review = $("quiz-review");
    if (review) review.addEventListener("click", function () {
      const firstWrong = form.querySelector(".quiz-question.is-wrong");
      if (firstWrong) firstWrong.scrollIntoView({ behavior: "smooth", block: "center" });
      else toast("Brak błędnych odpowiedzi — świetnie!", "success");
    });
  }

  /* ============================================================
     13 — ŚCIĄGAWKA
     ============================================================ */

  function initCheatsheet() {
    const print = $("cheatsheet-print");
    if (print) print.addEventListener("click", function () { window.print(); });
  }

  /* ============================================================
     MODAL
     ============================================================ */

  function openModal(content, options) {
    options = options || {};
    const root = $("modalRoot");
    root.innerHTML = '<div class="modal-backdrop"><div class="modal ' + (options.className || "") + '" role="dialog" aria-modal="true" aria-labelledby="modalTitle">' +
      '<header class="modal-head"><h2 id="modalTitle">' + (options.title || "") + '</h2><button type="button" class="icon-btn modal-close" aria-label="Zamknij okno">×</button></header>' +
      '<div class="modal-body">' + content + "</div>" +
      '<footer class="modal-foot">' + (options.footer || '<button type="button" class="btn btn-ghost" data-close-modal>Zamknij</button>') + "</footer>" +
      "</div></div>";
    document.body.classList.add("modal-open");
    const backdrop = root.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", function (event) {
        if (event.target === backdrop) closeModal();
      });
    }
    root.querySelectorAll("[data-close-modal], .modal-close").forEach(function (button) {
      button.addEventListener("click", closeModal);
    });
    const close = root.querySelector(".modal-close");
    if (close) close.focus();
  }

  function closeModal() {
    const root = $("modalRoot");
    if (root) root.innerHTML = "";
    document.body.classList.remove("modal-open", "print-modal");
  }

  /* ============================================================
     INICJALIZATORY STRON
     ============================================================ */

  const initializers = {
    start: initStart,
    potential: initActivity,
    nernst: initNernst,
    equilibria: initAlpha,
    formula: initFormulaBuilder,
    extraction: initExtraction,
    bioactivity: initBioactivity,
    lab: initLab,
    calculations: initCalculations,
    errors: initErrors,
    graphs: initGraphs,
    report: initReport,
    quiz: initQuiz,
    cheatsheet: initCheatsheet
  };

  /* ============================================================
     ZDARZENIA GLOBALNE
     ============================================================ */

  document.addEventListener("click", function (event) {
    const link = event.target.closest("[data-page-link]");
    if (link) {
      const id = link.dataset.pageLink;
      if (!pageMap.has(id)) return;
      event.preventDefault();
      closeMenu();
      if (hashPage() === id) showPage(id, { force: true });
      else location.hash = id;
      return;
    }

    const closeButton = event.target.closest("[data-close-modal]");
    if (closeButton) {
      closeModal();
      return;
    }

    const printButton = event.target.closest("[data-print-modal]");
    if (printButton) {
      document.body.classList.add("print-modal");
      window.print();
      return;
    }

    const complete = event.target.closest("[data-complete]");
    if (complete) {
      const id = complete.dataset.complete;
      state.completed[id] = !state.completed[id];
      save();
      renderNav();
      updateProgress();
      updateCompletionUI();
      toast(state.completed[id] ? "Moduł oznaczono jako opanowany." : "Oznaczenie usunięte.", state.completed[id] ? "success" : "info");
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
      closeModal();
    }
  });

  const menuBtn = $("menuBtn");
  if (menuBtn) menuBtn.addEventListener("click", function () {
    if (sidebar.classList.contains("is-open")) closeMenu();
    else openMenu();
  });
  if (scrim) scrim.addEventListener("click", closeMenu);

  const themeBtn = $("themeBtn");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  const resetState = $("resetState");
  if (resetState) resetState.addEventListener("click", function () {
    const confirmed = window.confirm("Usunąć cały postęp, wpisane wyniki i szkic sprawozdania? Tej operacji nie można cofnąć.");
    if (!confirmed) return;
    const theme = document.documentElement.getAttribute("data-theme") || "light";
    CF.clearState();
    state = mergeDefaults(DEFAULT_STATE, {});
    state.theme = theme;
    save();
    renderNav();
    updateProgress();
    showPage(currentPage || "start", { force: true });
    toast("Postęp i dane zostały wyczyszczone.", "success");
  });

  window.addEventListener("hashchange", function () {
    showPage(hashPage());
  });

  let resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth >= 1024) closeMenu();
      CF.redrawCharts();
    }, 160);
  });

  window.addEventListener("afterprint", function () {
    document.body.classList.remove("print-modal");
  });

  window.addEventListener("beforeunload", function () {
    CF.saveState(state);
  });

  /* ============================================================
     START APLIKACJI
     ============================================================ */

  renderNav();
  setTheme(state.theme || null);
  const initial = hashPage();
  showPage(pageMap.has(initial) ? initial : "start");
})(window);
