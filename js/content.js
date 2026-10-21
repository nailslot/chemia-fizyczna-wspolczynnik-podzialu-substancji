/* ============================================================
   Treść przewodnika — część 1: nawigacja, start, teoria
   ============================================================ */
(function (global) {
  "use strict";

  const GUIDE = global.GUIDE || {};
  GUIDE.pages = GUIDE.pages || [];
  GUIDE.quiz = GUIDE.quiz || [];
  GUIDE.scope = GUIDE.scope || [];

  GUIDE.nav = [
    {
      label: "Wprowadzenie",
      items: [{ id: "start", num: "", title: "Start", short: "Start" }]
    },
    {
      label: "Teoria",
      items: [
        { id: "potential", num: "01", title: "Potencjał i aktywność", short: "Potencjał chemiczny" },
        { id: "nernst", num: "02", title: "Prawo podziału Nernsta", short: "Prawo Nernsta" },
        { id: "equilibria", num: "03", title: "Dysocjacja i asocjacja", short: "Dysocjacja i asocjacja" },
        { id: "formula", num: "04", title: "Wzór roboczy", short: "Wzór roboczy" },
        { id: "extraction", num: "05", title: "Ekstrakcja", short: "Ekstrakcja" },
        { id: "bioactivity", num: "06", title: "Aktywność biologiczna", short: "Aktywność biologiczna" }
      ]
    },
    {
      label: "Laboratorium",
      items: [
        { id: "lab", num: "07", title: "Wykonanie ćwiczenia", short: "Wykonanie ćwiczenia" },
        { id: "calculations", num: "08", title: "Obliczenia krok po kroku", short: "Obliczenia" },
        { id: "errors", num: "09", title: "Błędy i niepewności", short: "Rachunek błędów" },
        { id: "graphs", num: "10", title: "Wykresy i regresja", short: "Wykresy i regresja" },
        { id: "report", num: "11", title: "Sprawozdanie", short: "Sprawozdanie" }
      ]
    },
    {
      label: "Utrwalenie",
      items: [
        { id: "quiz", num: "12", title: "Test końcowy", short: "Test końcowy" },
        { id: "cheatsheet", num: "13", title: "Ściągawka i zakres", short: "Ściągawka" }
      ]
    }
  ];

  GUIDE.trackedIds = [
    "potential", "nernst", "equilibria", "formula", "extraction", "bioactivity",
    "lab", "calculations", "errors", "graphs", "report", "quiz"
  ];

  GUIDE.page = function (page) {
    GUIDE.pages.push(page);
  };

  function goalList(items) {
    return '<ul class="goal-list">' + items.map(function (item) {
      return '<li><span class="goal-check" aria-hidden="true">✓</span><span>' + item + "</span></li>";
    }).join("") + "</ul>";
  }

  function check(id, question, options, answer, explanation) {
    const name = "check-" + id;
    return '<div class="check-card" data-check data-answer="' + answer + '">' +
      '<p class="check-kicker">Sprawdź rozumienie</p>' +
      '<p class="check-question">' + question + "</p>" +
      '<div class="check-options">' + options.map(function (option, index) {
        const letter = String.fromCharCode(97 + index);
        return '<label class="check-option"><input type="radio" name="' + name +
          '" value="' + letter + '"><span class="check-letter">' + letter.toUpperCase() +
          '</span><span>' + option + "</span></label>";
      }).join("") + "</div>" +
      '<button type="button" class="btn btn-small check-submit">Sprawdź odpowiedź</button>' +
      '<div class="check-feedback" aria-live="polite"></div>' +
      '<div class="check-explanation" hidden><strong>Dlaczego?</strong> ' + explanation + "</div>" +
      "</div>";
  }

  function callout(type, title, body) {
    return '<aside class="callout callout-' + type + '">' +
      '<div class="callout-icon" aria-hidden="true">' +
      (type === "warning" ? "!" : type === "tip" ? "★" : "i") +
      "</div><div><strong>" + title + "</strong><p>" + body + "</p></div></aside>";
  }

  /* ============================================================
     START
     ============================================================ */
  GUIDE.page({
    id: "start",
    num: "",
    group: "Wprowadzenie",
    title: "Start",
    short: "Start",
    eyebrow: "Chemia fizyczna · ćwiczenie laboratoryjne 3",
    lead: "Od potencjału chemicznego do gotowego sprawozdania — interaktywny przewodnik po prawie podziału Nernsta, z symulatorami, arkuszem obliczeń i testem końcowym.",
    body: function () {
      return `
        <section class="hero">
          <div class="hero-copy">
            <p class="eyebrow">Chemia fizyczna · ćwiczenie 3</p>
            <h1>Współczynnik<br><em>podziału</em> substancji</h1>
            <p class="hero-lead">Naucz się przewidywać, obliczać i interpretować rozdział substancji między dwie niemieszające się fazy. Ten przewodnik prowadzi od fundamentów teoretycznych przez laboratorium aż do dyskusji wyników.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#potential" data-page-link="potential">Zacznij od teorii <span aria-hidden="true">→</span></a>
              <a class="btn btn-ghost" href="#calculations" data-page-link="calculations">Przelicz swoje wyniki</a>
            </div>
            <div class="hero-meta" aria-label="Zawartość przewodnika">
              <span><strong>13</strong> modułów</span>
              <span><strong>12</strong> interaktywnych narzędzi</span>
              <span><strong>1</strong> kompletny tok ćwiczenia</span>
            </div>
          </div>
          <div class="hero-visual" aria-hidden="true">
            <svg viewBox="0 0 430 360" role="img">
              <defs>
                <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="var(--hero-glass-1, #ffffff)" stop-opacity=".72"/>
                  <stop offset="100%" stop-color="var(--hero-glass-2, #f0f0f0)" stop-opacity=".35"/>
                </linearGradient>
                <linearGradient id="organic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--hero-organic-1, #f0d9d5)" stop-opacity=".9"/>
                  <stop offset="100%" stop-color="var(--hero-organic-2, #e4b8b1)" stop-opacity=".95"/>
                </linearGradient>
                <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--hero-water-1, #efefef)" stop-opacity=".95"/>
                  <stop offset="100%" stop-color="var(--hero-water-2, #dcdcdc)" stop-opacity=".98"/>
                </linearGradient>
                <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="9"/>
                </filter>
              </defs>
              <ellipse cx="215" cy="320" rx="130" ry="18" fill="currentColor" opacity=".10" filter="url(#soft)"/>
              <path d="M126 52h178v188c0 34-28 60-62 60h-54c-34 0-62-26-62-60V52z" fill="url(#glass)" stroke="currentColor" stroke-width="2.5" opacity=".96"/>
              <path d="M130 160h170v80c0 33-27 58-59 58h-52c-32 0-59-25-59-58v-80z" fill="url(#water)"/>
              <path d="M130 110h170v50H130z" fill="url(#organic)"/>
              <path d="M130 159h170v4H130z" fill="currentColor" opacity=".18"/>
              <path d="M126 52h178v188c0 34-28 60-62 60h-54c-34 0-62-26-62-60V52z" fill="none" stroke="currentColor" stroke-width="2.5"/>
              <g class="svg-particles" fill="currentColor" opacity=".78">
                <circle cx="166" cy="132" r="5"/><circle cx="205" cy="122" r="4"/>
                <circle cx="247" cy="140" r="5.5"/><circle cx="278" cy="125" r="3.7"/>
                <circle cx="181" cy="193" r="4.5"/><circle cx="230" cy="214" r="5"/>
                <circle cx="267" cy="190" r="3.8"/><circle cx="198" cy="246" r="4.2"/>
                <circle cx="153" cy="230" r="3.5"/><circle cx="282" cy="235" r="4.7"/>
              </g>
              <g fill="currentColor" opacity=".42">
                <circle cx="175" cy="268" r="2.6"/><circle cx="248" cy="272" r="2.3"/>
                <circle cx="217" cy="296" r="2.8"/><circle cx="292" cy="262" r="2.2"/>
                <circle cx="142" cy="286" r="2.1"/><circle cx="263" cy="302" r="2"/>
              </g>
              <g font-family="system-ui, sans-serif" font-size="10.5" fill="currentColor" text-anchor="end">
                <text x="420" y="108">faza organiczna</text>
                <text x="420" y="123" opacity=".62">toluen</text>
                <text x="420" y="190">faza wodna</text>
                <text x="420" y="205" opacity=".62">woda</text>
              </g>
              <path d="M306 104h-22" stroke="currentColor" stroke-width="1.4" opacity=".35"/>
              <path d="M306 186h-22" stroke="currentColor" stroke-width="1.4" opacity=".35"/>
            </svg>
            <div class="hero-badge"><span>K</span><small>stała w danej<br>temperaturze</small></div>
          </div>
        </section>

        <section class="section-block">
          <div class="section-heading">
            <p class="eyebrow">Mapa wymagań</p>
            <h2>Co musisz opanować</h2>
            <p>Punkty z sekcji „Zakres wymaganych wiadomości” skryptu, rozłożone na konkretne moduły.</p>
          </div>
          <div class="requirement-grid">
            <a class="requirement-card" href="#potential" data-page-link="potential">
              <span class="requirement-num">01</span>
              <h3>Potencjał chemiczny</h3>
              <p>Aktywność, współczynnik aktywności i termodynamiczny warunek równowagi między fazami.</p>
              <span class="requirement-link">Moduł 01 <span aria-hidden="true">→</span></span>
            </a>
            <a class="requirement-card" href="#nernst" data-page-link="nernst">
              <span class="requirement-num">02</span>
              <h3>Prawo podziału Nernsta</h3>
              <p>Stała K, warunki stosowalności, różnica między K a współczynnikiem dystrybucji D.</p>
              <span class="requirement-link">Moduł 02 <span aria-hidden="true">→</span></span>
            </a>
            <a class="requirement-card" href="#equilibria" data-page-link="equilibria">
              <span class="requirement-num">03</span>
              <h3>Dysocjacja i asocjacja</h3>
              <p>Stopień i stała dysocjacji, pełne prawo Ostwalda, dimeryzacja kwasu benzoesowego.</p>
              <span class="requirement-link">Moduł 03 <span aria-hidden="true">→</span></span>
            </a>
            <a class="requirement-card" href="#extraction" data-page-link="extraction">
              <span class="requirement-num">04</span>
              <h3>Ekstrakcja</h3>
              <p>Ekstrakcja jednostopniowa i wielostopniowa, bilans masy, zastosowania praktyczne.</p>
              <span class="requirement-link">Moduł 05 <span aria-hidden="true">→</span></span>
            </a>
            <a class="requirement-card" href="#bioactivity" data-page-link="bioactivity">
              <span class="requirement-num">05</span>
              <h3>Aktywność biologiczna</h3>
              <p>Lipofilowość, logP, wpływ pH i jonizacji na przenikanie przez błony biologiczne.</p>
              <span class="requirement-link">Moduł 06 <span aria-hidden="true">→</span></span>
            </a>
          </div>
        </section>

        <section class="section-block">
          <div class="section-heading">
            <p class="eyebrow">Jak pracować</p>
            <h2>Cztery etapy, jedna historia</h2>
          </div>
          <div class="path-grid">
            <div class="path-step">
              <span class="path-index">1</span>
              <h3>Zrozum</h3>
              <p>Potencjał chemiczny wyjaśnia, dlaczego substancja dzieli się w stałym stosunku. Dopiero potem wzór Nernsta przestaje być magiczny.</p>
            </div>
            <div class="path-step">
              <span class="path-index">2</span>
              <h3>Policz</h3>
              <p>Prześledź wyprowadzenie wzoru roboczego i użyj arkusza obliczeń na własnych danych z miareczkowania.</p>
            </div>
            <div class="path-step">
              <span class="path-index">3</span>
              <h3>Oceń</h3>
              <p>Dodaj niepewność pomiaru, sprawdź wykres i krytycznie porównaj wyniki dla obu naważek.</p>
            </div>
            <div class="path-step">
              <span class="path-index">4</span>
              <h3>Opisz</h3>
              <p>Zbuduj sprawozdanie zgodne z wymaganiami: cel, teoria, wykonanie, wyniki, dyskusja i wnioski.</p>
            </div>
          </div>
        </section>

        <div class="two-col">
          <section class="card accent-card">
            <p class="eyebrow">Po co to robimy?</p>
            <h3>Współczynnik podziału łączy chemię fizyczną z farmacją</h3>
            <p>Ta sama wielkość, którą wyznaczasz w rozdzielaczu, opisuje wędrówkę leku między wodą a błoną lipidową. Uczy o wchłanianiu, dystrybucji, trwałości preparatu i ekstrakcji substancji czynnych.</p>
            <a class="text-link" href="#bioactivity" data-page-link="bioactivity">Zobacz zastosowania biologiczne <span aria-hidden="true">→</span></a>
          </section>
          <aside class="card note-card">
            <p class="eyebrow">Zanim zaczniesz</p>
            <h3>Jak działa ta aplikacja</h3>
            <ul class="plain-list">
              <li>Postęp i wpisane dane zapisują się lokalnie w przeglądarce.</li>
              <li>Dane w arkuszu obliczeń są przykładowe — podmienisz je własnymi.</li>
              <li>Każdy moduł kończy się krótkim sprawdzianem i przyciskiem „Opanowane”.</li>
            </ul>
          </aside>
        </div>

        <div class="source-strip">
          <span class="source-label">Źródło</span>
          <p>Opracowanie na podstawie skryptu <em>Chemia fizyczna — ćwiczenia laboratoryjne</em>: rozdz. 3 „Współczynnik podziału substancji” oraz rozdz. 14–16 (sprawozdanie, rachunek błędów, opracowanie graficzne).</p>
        </div>
      `;
    }
  });

  /* ============================================================
     01 — POTENCJAŁ CHEMICZNY
     ============================================================ */
  GUIDE.page({
    id: "potential",
    num: "01",
    group: "Teoria",
    title: "Potencjał chemiczny, aktywność i współczynnik aktywności",
    short: "Potencjał chemiczny",
    eyebrow: "Moduł 01 · Fundament termodynamiczny",
    lead: "Zanim napiszemy K = c₁/c₂, warto wiedzieć, co tak naprawdę się wyrównuje między fazami. Odpowiedź brzmi: potencjał chemiczny, a nie samo stężenie.",
    body: function () {
      return `
        <div class="module-intro">
          <div>
            <p class="eyebrow">Cele modułu</p>
            ${goalList([
              "zdefiniować potencjał chemiczny i wyjaśnić rolę stanu standardowego,",
              "obliczyć aktywność i współczynnik aktywności oraz interpretować odchylenia od jedności,",
              "wyprowadzić stały stosunek aktywności (a potem stężeń) w stanie równowagi."
            ])}
          </div>
          <aside class="formula-slip">
            <span class="formula-slip-label">Klucz</span>
            <div class="equation compact"><span class="math">μ<sub>i</sub> = μ<sub>i</sub><sup>°</sup> + RT ln a<sub>i</sub></span></div>
            <p>Równowaga fazowa to równość potencjałów chemicznych, nie równość stężeń.</p>
          </aside>
        </div>

        <section class="card">
          <h2>Potencjał chemiczny — energia na mol składnika</h2>
          <p>Potencjał chemiczny <span class="math">μ<sub>i</sub></span> opisuje, jak zmienia się energia swobodna Gibbsa układu, gdy dodamy do niego nieskończenie małą ilość składnika <span class="math">i</span>, przy stałej temperaturze, ciśnieniu i liczbie moli pozostałych składników. To „cena” wprowadzenia kolejnej porcji substancji do danej fazy.</p>
          <div class="equation-block">
            ${CF.eq('<span class="math">μ<sub>i</sub> = μ<sub>i</sub><sup>°</sup> + RT ln a<sub>i</sub></span>', "(1)")}
            <p class="equation-note"><span class="math">μ<sub>i</sub><sup>°</sup></span> — potencjał standardowy, <span class="math">R</span> = 8,314 J·mol⁻¹·K⁻¹, <span class="math">T</span> — temperatura w kelwinach, <span class="math">a<sub>i</sub></span> — aktywność (bezwymiarowa).</p>
          </div>
          <div class="definition-grid">
            <div class="definition">
              <span class="definition-term">Aktywność</span>
              <div class="equation compact"><span class="math">a<sub>i</sub> = γ<sub>i</sub> · c<sub>i</sub> / c<sup>°</sup></span></div>
              <p>„Efektywne stężenie” — uwzględnia oddziaływania między cząsteczkami. Dla substancji rozpuszczonej przyjmuje się zwykle <span class="math">c° = 1 mol·dm⁻³</span>.</p>
            </div>
            <div class="definition">
              <span class="definition-term">Współczynnik aktywności</span>
              <div class="equation compact"><span class="math">γ<sub>i</sub> → 1</span> gdy <span class="math">c<sub>i</sub> → 0</span></div>
              <p>W nieskończenie rozcieńczonym roztworze cząsteczki są daleko od siebie i zachowują się niemal idealnie. W roztworze stężonym <span class="math">γ</span> może być mniejsze lub większe od 1.</p>
            </div>
          </div>
          ${callout("info", "Dlaczego aktywność, a nie stężenie?", "W prawie podziału Nernsta wzór stężeniowy jest przybliżeniem. Ściśle równowagę opisuje stosunek aktywności. Możemy zastąpić aktywności stężeniami, gdy roztwory są rozcieńczone — wtedy <span class=\"math\">γ ≈ 1</span>.")}

          <details class="decomposition">
            <summary>Rozszerzenie: definicja formalna, stany standardowe i elektrolity</summary>
            <div class="extension-body">
              <p>Formalnie potencjał chemiczny to cząstkowa molowa energia Gibbsa:</p>
              <div class="equation-block compact-equation">
                ${CF.eq('<span class="math">μ<sub>i</sub> = (∂G/∂n<sub>i</sub>)<sub>T,p</sub></span>', "przy stałej liczbie moli pozostałych składników")}
                ${CF.eq('<span class="math">dG = −S dT + V dp + Σ μ<sub>i</sub> dn<sub>i</sub></span>', "różniczka")}
              </div>
              <div class="table-wrap">
                <table class="data-table compact-table">
                  <thead><tr><th>Składnik</th><th>Typowy stan standardowy</th><th>Aktywność</th></tr></thead>
                  <tbody>
                    <tr><td>Rozpuszczalnik</td><td>czysta ciecz (konwencja Raoulta)</td><td><span class="math">a<sub>i</sub> → x<sub>i</sub></span> dla roztworu bliskiego idealnemu</td></tr>
                    <tr><td>Substancja rozpuszczona</td><td>hipotetyczny roztwór 1 mol·dm⁻³ zachowujący się jak w nieskończonym rozcieńczeniu (konwencja Henry’ego)</td><td><span class="math">a<sub>i</sub> = γ<sub>i</sub>c<sub>i</sub>/c°</span></td></tr>
                  </tbody>
                </table>
              </div>
              <p>Dla jonów posługujemy się średnim współczynnikiem aktywności <span class="math">γ<sub>±</sub></span>. Przy małej mocy jonowej obowiązuje graniczne prawo Debye’a–Hückla:</p>
              <div class="equation-block compact-equation">
                ${CF.eq('<span class="math">lg γ<sub>±</sub> = −A |z<sub>+</sub>z<sub>−</sub>| √I</span>', "A ≈ 0,509 dla wody w 25 °C")}
                ${CF.eq('<span class="math">I = ½ Σ c<sub>i</sub> z<sub>i</sub><sup>2</sup></span>', "moc jonowa")}
              </div>
              <p>W fazie wodnej tego ćwiczenia stężenia jonów są rzędu 10⁻⁴–10⁻³ mol·dm⁻³, więc <span class="math">I</span> jest małe, a <span class="math">γ<sub>±</sub> ≈ 0,96–0,99</span>. Zastąpienie aktywności stężeniami wnosi błąd rzędu kilku procent — akceptowalny w tym ćwiczeniu, ale wart odnotowania w dyskusji.</p>
            </div>
          </details>
        </section>

        <section class="interactive-card" id="activity-tool">
          <div class="interactive-head">
            <div>
              <p class="eyebrow">Mini-lab</p>
              <h2>Aktywność pod kontrolą</h2>
              <p>Zmień stężenie, współczynnik aktywności i temperaturę. Zobacz, jak zmienia się aktywność oraz człon <span class="math">RT ln a</span>.</p>
            </div>
            <span class="live-badge"><i></i> oblicza na żywo</span>
          </div>
          <div class="tool-grid">
            <div class="tool-controls">
              <label class="field">
                <span class="field-label">Stężenie <span class="math">c</span> <small>[mol·dm⁻³]</small></span>
                <input type="range" id="act-c" min="0.001" max="1" step="0.001" value="0.05" data-output="act-c-out">
                <output id="act-c-out" class="range-output">0,050</output>
              </label>
              <label class="field">
                <span class="field-label">Współczynnik aktywności <span class="math">γ</span></span>
                <input type="range" id="act-gamma" min="0.10" max="1.20" step="0.01" value="0.85" data-output="act-gamma-out">
                <output id="act-gamma-out" class="range-output">0,85</output>
              </label>
              <label class="field">
                <span class="field-label">Temperatura <span class="math">T</span> <small>[K]</small></span>
                <input type="range" id="act-temp" min="273" max="373" step="1" value="298" data-output="act-temp-out">
                <output id="act-temp-out" class="range-output">298</output>
              </label>
            </div>
            <div class="tool-results">
              <div class="result-tile"><span>Aktywność <span class="math">a</span></span><strong id="act-a">0,0425</strong></div>
              <div class="result-tile"><span>Poprawka <span class="math">RT ln a</span></span><strong id="act-rt">−7,73 kJ·mol⁻¹</strong></div>
              <div class="result-tile wide"><span>Interpretacja</span><p id="act-note">Współczynnik aktywności obniża efektywne stężenie.</p></div>
            </div>
          </div>
          <div class="meter-wrap">
            <div class="meter-label"><span>idealnie</span><span>silne odchylenia</span></div>
            <div class="meter"><span id="act-meter" style="width:77%"></span></div>
          </div>
        </section>

        <section class="card">
          <h2>Skąd bierze się stały stosunek stężeń?</h2>
          <p>Substancja rozpuszczona w dwóch fazach dąży do takiego stanu, w którym jej potencjał chemiczny w obu fazach jest równy. Prześledź wyprowadzenie krok po kroku.</p>
          <div class="derivation" data-derivation>
            <div class="derivation-step">
              <span class="step-number">1</span>
              <div><strong>Warunek równowagi</strong><p>W stanie równowagi potencjały chemiczne składnika w fazie 1 i 2 są równe:</p><div class="equation compact"><span class="math">μ<sub>1</sub> = μ<sub>2</sub></span></div></div>
            </div>
            <div class="derivation-step">
              <span class="step-number">2</span>
              <div><strong>Wstaw definicję</strong><p>Każdy potencjał zastępujemy wyrażeniem ze stanem standardowym i aktywnością:</p><div class="equation compact"><span class="math">μ<sub>1</sub><sup>°</sup> + RT ln a<sub>1</sub> = μ<sub>2</sub><sup>°</sup> + RT ln a<sub>2</sub></span></div></div>
            </div>
            <div class="derivation-step">
              <span class="step-number">3</span>
              <div><strong>Grupujemy wyrazy</strong><p>Przenosimy stałe na jedną stronę i dzielimy przez <span class="math">RT</span>:</p><div class="equation compact"><span class="math">ln(a<sub>1</sub>/a<sub>2</sub>) = −(μ<sub>1</sub><sup>°</sup> − μ<sub>2</sub><sup>°</sup>) / RT</span></div></div>
            </div>
            <div class="derivation-step">
              <span class="step-number">4</span>
              <div><strong>Stała w danej temperaturze</strong><p>Prawa strona zależy tylko od temperatury i rodzaju faz. Dlatego stosunek aktywności jest stały:</p><div class="equation compact"><span class="math">a<sub>1</sub>/a<sub>2</sub> = K</span></div></div>
            </div>
            <div class="derivation-step">
              <span class="step-number">5</span>
              <div><strong>Przybliżenie rozcieńczonego roztworu</strong><p>Jeśli <span class="math">γ<sub>1</sub> ≈ γ<sub>2</sub> ≈ 1</span>, aktywności można zastąpić stężeniami:</p><div class="equation compact"><span class="math">K = c<sub>1</sub>/c<sub>2</sub></span></div></div>
            </div>
            <button type="button" class="btn btn-ghost derivation-next">Pokaż kolejny krok <span aria-hidden="true">↓</span></button>
            <button type="button" class="btn btn-small btn-quiet derivation-reset" hidden>Od początku</button>
          </div>
        </section>

        ${check("potential-1", "W stanie równowagi między dwiema fazami wyrównują się:", [
          "stężenia molowe składnika w obu fazach",
          "potencjały chemiczne składnika w obu fazach",
          "masy obu faz",
          "współczynniki aktywności w obu fazach"
        ], "b", "Równowaga termodynamiczna oznacza równość potencjałów chemicznych. Stężenia mogą być różne — właśnie dlatego powstaje współczynnik podziału.")}

        ${check("potential-2", "Współczynnik aktywności γ dąży do 1, gdy:", [
          "roztwór jest bardzo stężony",
          "temperatura dąży do 0 K",
          "stężenie substancji dąży do zera",
          "substancja jest elektrolitem mocnym"
        ], "c", "W nieskończenie rozcieńczonym roztworze oddziaływania między cząsteczkami substancji rozpuszczonej znikają, więc roztwór zachowuje się idealnie i γ → 1.")}

        ${callout("tip", "Zapamiętaj na egzamin", "Prawo podziału w postaci stężeniowej nie jest osobnym prawem przyrody — jest konsekwencją równości potencjałów chemicznych i przybliżenia <span class=\"math\">a ≈ c</span>.")}
      `;
    }
  });

  /* ============================================================
     02 — PRAWO PODZIAŁU NERNSTA
     ============================================================ */
  GUIDE.page({
    id: "nernst",
    num: "02",
    group: "Teoria",
    title: "Prawo podziału Nernsta",
    short: "Prawo Nernsta",
    eyebrow: "Moduł 02 · Rdzeń ćwiczenia",
    lead: "Trzeci składnik dodany do dwóch niemieszających się cieczy dzieli się między nie w stałym stosunku stężeń. Ten stosunek to współczynnik podziału K.",
    body: function () {
      return `
        <div class="module-intro">
          <div>
            <p class="eyebrow">Cele modułu</p>
            ${goalList([
              "sformułować prawo podziału Nernsta i podać warunki jego stosowalności,",
              "odróżnić współczynnik podziału K od współczynnika dystrybucji D,",
              "przewidzieć, która faza wzbogaca się w substancję, gdy K > 1 lub K < 1."
            ])}
          </div>
          <aside class="formula-slip">
            <span class="formula-slip-label">Prawo Nernsta</span>
            ${CF.eq(CF.frac('<span class="math">c<sub>1</sub></span>', '<span class="math">c<sub>2</sub></span>') + '<span class="math">= K(T)</span>')}
            <p>Stosunek stężeń w dwóch fazach jest stały w danej temperaturze.</p>
          </aside>
        </div>

        <section class="card">
          <h2>Treść prawa</h2>
          <p>Jeżeli do układu dwóch niemieszających się wzajemnie cieczy dodamy trzeci składnik, rozpuszczający się w obu cieczach, to w danej temperaturze stosunek jego stężeń w obu fazach pozostaje stały. Ten stosunek nazywamy <strong>współczynnikiem podziału Nernsta</strong> <span class="math">K</span>.</p>
          <div class="equation-block">
            ${CF.eq('<span class="math">K = ' + CF.frac('<span class="math">c<sub>1</sub></span>', '<span class="math">c<sub>2</sub></span>') + '</span>', "(1)")}
            <p class="equation-note"><span class="math">c<sub>1</sub>, c<sub>2</sub></span> — stężenia molowe substancji w poszczególnych fazach, zwykle w mol·dm⁻³. Umownie faza 1 to faza organiczna, a faza 2 — wodna.</p>
          </div>
          <div class="condition-grid">
            <div class="condition"><span class="condition-icon">T</span><h3>Stała temperatura</h3><p>K zależy od temperatury. Porównuj wyniki tylko dla tej samej temperatury.</p></div>
            <div class="condition"><span class="condition-icon">≈</span><h3>Rozcieńczone roztwory</h3><p>Wtedy aktywności można zastąpić stężeniami, czyli γ ≈ 1.</p></div>
            <div class="condition"><span class="condition-icon">1</span><h3>Ten sam stan cząsteczkowy</h3><p>Substancja nie może ulegać dysocjacji, asocjacji ani innym reakcjom w jednej fazie.</p></div>
            <div class="condition"><span class="condition-icon">⇌</span><h3>Osiągnięta równowaga</h3><p>Układ musi być dostatecznie długo wytrząsany i pozostawiony do rozdzielenia.</p></div>
          </div>
          ${callout("warning", "Uwaga na sformułowanie", "Warunek „nie zmienia stanu cząsteczkowego” nie oznacza, że substancja nie może być słabym kwasem. Oznacza, że w prostym wzorze (1) nie uwzględniamy dysocjacji ani asocjacji. Jeśli występują, trzeba zmodyfikować wzór — tym zajmiemy się w modułach 03 i 04.")}
        </section>

        <section class="interactive-card" id="nernst-tool">
          <div class="interactive-head">
            <div>
              <p class="eyebrow">Symulator równowagi</p>
              <h2>Rozdzielacz in silico</h2>
              <p>Ustaw współczynnik podziału i objętości faz. Zobacz, jak jedna milimol substancji rozkłada się między warstwy.</p>
            </div>
            <span class="live-badge"><i></i> model bilansu masy</span>
          </div>
          <div class="nernst-layout">
            <div class="nernst-controls">
              <label class="field">
                <span class="field-label">Współczynnik podziału <span class="math">K</span></span>
                <input type="range" id="nernst-k" min="0.1" max="20" step="0.1" value="3" data-output="nernst-k-out">
                <output id="nernst-k-out" class="range-output">3,0</output>
              </label>
              <label class="field">
                <span class="field-label">Objętość fazy organicznej <small>[cm³]</small></span>
                <input type="range" id="nernst-vorg" min="10" max="100" step="1" value="25" data-output="nernst-vorg-out">
                <output id="nernst-vorg-out" class="range-output">25</output>
              </label>
              <label class="field">
                <span class="field-label">Objętość fazy wodnej <small>[cm³]</small></span>
                <input type="range" id="nernst-vaq" min="10" max="100" step="1" value="35" data-output="nernst-vaq-out">
                <output id="nernst-vaq-out" class="range-output">35</output>
              </label>
              <p class="small-note">Model: <span class="math">n<sub>całk</sub> = 1,00 mmol</span>, <span class="math">c<sub>org</sub> = K·c<sub>aq</sub></span>, bilans masy bez dysocjacji i asocjacji.</p>
            </div>
            <div class="separator-visual" aria-label="Wizualizacja podziału substancji między fazy">
              <div class="separator-label">faza organiczna <span>toluen</span></div>
              <div class="layer layer-organic" id="layer-organic"><div class="layer-particles" id="particles-organic"></div><span class="layer-conc" id="conc-organic">—</span></div>
              <div class="layer-interface"><span></span></div>
              <div class="layer layer-aqueous" id="layer-aqueous"><div class="layer-particles" id="particles-aqueous"></div><span class="layer-conc" id="conc-aqueous">—</span></div>
              <div class="separator-label bottom">faza wodna <span>woda</span></div>
            </div>
          </div>
          <div class="distribution-strip" aria-label="Udział masy w fazach">
            <div class="strip-organic" id="strip-organic"><span id="strip-organic-label">—</span></div>
            <div class="strip-aqueous" id="strip-aqueous"><span id="strip-aqueous-label">—</span></div>
          </div>
          <div class="result-row">
            <div class="result-tile"><span>Stężenie w fazie organicznej</span><strong id="nernst-corg">—</strong></div>
            <div class="result-tile"><span>Stężenie w fazie wodnej</span><strong id="nernst-caq">—</strong></div>
            <div class="result-tile"><span>Masa w fazie organicznej</span><strong id="nernst-morg">—</strong></div>
            <div class="result-tile"><span>Masa w fazie wodnej</span><strong id="nernst-maq">—</strong></div>
          </div>
          <p class="interpretation" id="nernst-note">—</p>
        </section>

        <section class="card">
          <h2>K, D, logP i logD — cztery pokrewne pojęcia</h2>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Pojęcie</th><th>Definicja</th><th>Kiedy stosować</th></tr></thead>
              <tbody>
                <tr><td><strong>Współczynnik podziału <span class="math">K</span></strong></td><td>Stosunek stężeń <em>jednej, określonej formy</em> cząsteczki w dwóch fazach, np. <span class="math">[HA]<sub>org</sub>/[HA]<sub>aq</sub></span>.</td><td>Substancja nie dysocjuje ani nie asocjuje; roztwory rozcieńczone.</td></tr>
                <tr><td><strong>Współczynnik dystrybucji <span class="math">D</span></strong></td><td>Stosunek <em>całkowitych</em> stężeń analitycznych we wszystkich formach: <span class="math">D = c<sub>org,całk</sub>/c<sub>aq,całk</sub></span>.</td><td>Substancja jonizuje, tworzy kompleksy lub dimery; <span class="math">D</span> zależy m.in. od pH.</td></tr>
                <tr><td><strong>logP</strong></td><td><span class="math">log<sub>10</sub> K</span> dla układu oktanol–woda, najczęściej dla formy niejonowej.</td><td>Opis lipofilowości leków i związków biologicznie czynnych.</td></tr>
                <tr><td><strong>logD</strong></td><td><span class="math">log<sub>10</sub> D</span> dla układu oktanol–woda przy określonym pH; uwzględnia wszystkie formy, w tym zjonizowane.</td><td>Opis lipofilowości w warunkach fizjologicznych, np. przy pH 7,4.</td></tr>
              </tbody>
            </table>
          </div>
          ${callout("info", "W ćwiczeniu", "Dla kwasu benzoesowego mierzymy stężenie całkowite w wodzie, ale do wzoru Nernsta wstawiamy tylko formę niezdysocjowaną. W toluenie z kolei część cząsteczek tworzy dimery, więc bierzemy pod uwagę monomer. To prowadzi do wzoru roboczego z modułu 04.")}

          <details class="decomposition">
            <summary>Rozszerzenie: wyprowadzenie termodynamiczne, temperatura i reguła faz</summary>
            <div class="extension-body">
              <p>W równowadze potencjały chemiczne w obu fazach są równe. Po podstawieniu <span class="math">μ<sub>i</sub> = μ<sub>i</sub><sup>°</sup> + RT ln a<sub>i</sub></span> otrzymujemy termodynamiczny współczynnik podziału:</p>
              <div class="equation-block compact-equation">
                ${CF.eq('<span class="math">a<sub>1</sub>/a<sub>2</sub> = exp[−(μ<sub>1</sub><sup>°</sup> − μ<sub>2</sub><sup>°</sup>)/RT] = K<sub>th</sub></span>', "stała w danej temperaturze")}
                ${CF.eq('<span class="math">K = c<sub>1</sub>/c<sub>2</sub> = K<sub>th</sub> · (γ<sub>2</sub>/γ<sub>1</sub>) ≈ K<sub>th</sub></span>', "gdy γ<sub>1</sub> ≈ γ<sub>2</sub> ≈ 1")}
              </div>
              <p>Standardowa energia Gibbsa przeniesienia substancji z fazy 2 do fazy 1 wynosi <span class="math">ΔG<sub>przen.</sub><sup>°</sup> = −RT ln K<sub>th</sub></span>. Zależność od temperatury opisuje równanie van ’t Hoffa:</p>
              <div class="equation-block compact-equation">
                ${CF.eq('<span class="math">d ln K / d(1/T) = −ΔH<sub>przen.</sub><sup>°</sup>/R</span>', "równoważnie: d ln K/dT = ΔH°/RT²")}
              </div>
              <p>Dlatego <span class="math">K</span> podaje się zawsze z temperaturą, a obie próbki należy mierzyć w tych samych warunkach.</p>
              <p><strong>Reguła faz Gibbsa:</strong> <span class="math">F = C − P + 2</span>. Dla trzech składników (woda, toluen, kwas benzoesowy) i dwóch faz <span class="math">F = 3</span>. Po ustaleniu temperatury i ciśnienia pozostaje jeden stopień swobody opisujący składy — stężenie w jednej fazie wyznacza stężenie w drugiej i dlatego <span class="math">K</span> jest stałe.</p>
            </div>
          </details>
        </section>

        ${check("nernst-1", "K = 4, a objętości obu faz są równe. Po osiągnięciu równowagi:", [
          "w fazie organicznej jest 4 razy większe stężenie niż w wodnej",
          "w fazie wodnej jest 4 razy większe stężenie niż w organicznej",
          "stężenia są równe, bo objętości są równe",
          "wszystka substancja przechodzi do fazy organicznej"
        ], "a", "Z definicji K = c_org/c_aq. Gdy K = 4, stężenie w fazie organicznej jest czterokrotnie większe. Masy zależą dodatkowo od objętości faz.")}

        ${check("nernst-2", "Prawo podziału w prostej postaci K = c₁/c₂ przestaje wystarczać, gdy:", [
          "substancja jest barwna",
          "substancja dysocjuje lub asocjuje w jednej z faz",
          "objętości faz są różne",
          "stosujemy rozdzielacz zamiast kolby"
        ], "b", "Dysocjacja i asocjacja zmieniają stężenie formy, której dotyczy równowaga. Trzeba wtedy użyć stężenia formy niezdysocjowanej/niezasocjowanej albo współczynnika dystrybucji D.")}
      `;
    }
  });

  /* ============================================================
     03 — DYSOCJACJA I ASOCJACJA
     ============================================================ */
  GUIDE.page({
    id: "equilibria",
    num: "03",
    group: "Teoria",
    title: "Równowagi dysocjacji i asocjacji",
    short: "Dysocjacja i asocjacja",
    eyebrow: "Moduł 03 · Co komplikuje prosty wzór",
    lead: "Kwas benzoesowy w wodzie częściowo dysocjuje, a w toluenie tworzy dimery. Aby poprawnie opisać jego podział, musimy umieć policzyć stopień dysocjacji i uwzględnić asocjację.",
    body: function () {
      return `
        <div class="module-intro">
          <div>
            <p class="eyebrow">Cele modułu</p>
            ${goalList([
              "zapisać stałą dysocjacji i stopień dysocjacji oraz rozwiązać pełne prawo rozcieńczeń Ostwalda,",
              "ocenić, kiedy przybliżenie α ≈ √(Kₐ/c) jest dopuszczalne,",
              "wyjaśnić asocjację (dimeryzację) i sens poprawki √cₜ stosowanej w skrypcie."
            ])}
          </div>
          <aside class="formula-slip">
            <span class="formula-slip-label">Pełne prawo Ostwalda</span>
            ${CF.eq('<span class="math">K<sub>a</sub> = ' + CF.frac('<span class="math">c α<sup>2</sup></span>', '<span class="math">1 − α</span>') + '</span>')}
            <p>Rozwiązanie względem α wymaga równania kwadratowego.</p>
          </aside>
        </div>

        <section class="card">
          <h2>Dysocjacja słabego kwasu</h2>
          <p>Kwas benzoesowy (HA) w wodzie ulega równowadze:</p>
          <div class="equation-block">
            ${CF.eq('<span class="math">HA + H<sub>2</sub>O ⇌ H<sub>3</sub>O<sup>+</sup> + A<sup>−</sup></span>')}
            ${CF.eq('<span class="math">K<sub>a</sub> = ' + CF.frac('<span class="math">[H<sup>+</sup>][A<sup>−</sup>]</span>', '<span class="math">[HA]</span>') + '</span>', "(2)")}
          </div>
          <p class="small-note">W skrypcie stała dysocjacji jest oznaczana <span class="math">K<sub>d</sub></span>; w przewodniku używamy równoważnego, często spotykanego oznaczenia <span class="math">K<sub>a</sub></span>.</p>
          <p>Stopień dysocjacji <span class="math">α</span> to ułamek cząsteczek, które uległy dysocjacji:</p>
          <div class="equation-block">
            ${CF.eq('<span class="math">α = ' + CF.frac('<span class="math">[A<sup>−</sup>]</span>', '<span class="math">c<sub>0</sub></span>') + '</span>', "(3)")}
            <p class="equation-note"><span class="math">c<sub>0</sub></span> — całkowite (analityczne) stężenie kwasu, równe <span class="math">[HA] + [A<sup>−</sup>]</span>.</p>
          </div>
          <p>Po podstawieniu <span class="math">[A<sup>−</sup>] = c<sub>0</sub>α</span> oraz <span class="math">[HA] = c<sub>0</sub>(1 − α)</span> otrzymujemy <strong>pełne prawo rozcieńczeń Ostwalda</strong>:</p>
          <div class="equation-block emphasized">
            ${CF.eq('<span class="math">K<sub>a</sub> = ' + CF.frac('<span class="math">c<sub>0</sub> α<sup>2</sup></span>', '<span class="math">1 − α</span>') + '</span>', "(4)")}
          </div>
          <div class="two-col compact-gap">
            <div class="mini-card">
              <h3>Postać przybliżona</h3>
              <p>Gdy <span class="math">α ≪ 1</span> (typowo <span class="math">α < 0,05</span>), mianownik <span class="math">1 − α ≈ 1</span>, więc:</p>
              <div class="equation compact"><span class="math">α ≈ √(K<sub>a</sub>/c<sub>0</sub>)</span></div>
              <p class="small-note">Szybka ocena, ale w ćwiczeniu wymagana jest postać zupełna.</p>
            </div>
            <div class="mini-card">
              <h3>Rozwiązanie ścisłe</h3>
              <p>Po przekształceniu do równania kwadratowego:</p>
              <div class="equation compact"><span class="math">c<sub>0</sub>α<sup>2</sup> + K<sub>a</sub>α − K<sub>a</sub> = 0</span></div>
              ${CF.eq('<span class="math">α = ' + CF.frac('<span class="math">−K<sub>a</sub> + √(K<sub>a</sub><sup>2</sup> + 4K<sub>a</sub>c<sub>0</sub>)</span>', '<span class="math">2c<sub>0</sub></span>') + '</span>')}
            </div>
          </div>
          ${callout("warning", "Częsty błąd", "W mianowniku wzoru Ostwalda stoi <span class=\"math\">1 − α</span>, a nie <span class=\"math\">1</span>. Przy stężeniach rzędu 10⁻³–10⁻² mol·dm⁻³ i <span class=\"math\">K<sub>a</sub> = 6,46·10⁻⁵</span> stopień dysocjacji kwasu benzoesowego może być rzędu kilku–kilkunastu procent, więc przybliżenie bywa zauważalnie niedokładne.")}
        </section>

        <section class="interactive-card" id="alpha-tool">
          <div class="interactive-head">
            <div>
              <p class="eyebrow">Kalkulator</p>
              <h2>Stopień dysocjacji bez zgadywania</h2>
              <p>Porównaj wynik dokładny z przybliżeniem. Zobacz, kiedy uproszczenie zaczyna zawodzić.</p>
            </div>
            <span class="live-badge"><i></i> pełne Ostwald</span>
          </div>
          <div class="tool-grid">
            <div class="tool-controls">
              <label class="field">
                <span class="field-label">Stężenie całkowite kwasu <span class="math">c<sub>0</sub></span> <small>[mol·dm⁻³]</small></span>
                <input type="number" id="alpha-c" class="input" min="0.000001" step="0.0001" value="0.00245">
              </label>
              <label class="field">
                <span class="field-label">Stała dysocjacji <span class="math">K<sub>a</sub></span></span>
                <input type="number" id="alpha-ka" class="input" min="0.000000001" step="0.000001" value="0.0000646">
              </label>
              <p class="small-note">Dla kwasu benzoesowego w wodzie w temperaturze pokojowej skrypt podaje <span class="math">K<sub>a</sub> = 6,46·10⁻⁵</span>.</p>
            </div>
            <div class="tool-results">
              <div class="result-tile"><span>Stopień dysocjacji (ścisły)</span><strong id="alpha-exact">—</strong></div>
              <div class="result-tile"><span>Przybliżenie √(Kₐ/c₀)</span><strong id="alpha-approx">—</strong></div>
              <div class="result-tile"><span>Stężenie jonów H⁺</span><strong id="alpha-h">—</strong></div>
              <div class="result-tile"><span>pH roztworu</span><strong id="alpha-ph">—</strong></div>
              <div class="result-tile wide"><span>Błąd przybliżenia</span><p id="alpha-error">—</p></div>
            </div>
          </div>
          <div class="alpha-bar" aria-hidden="true"><span id="alpha-bar-fill"></span><b id="alpha-bar-label">—</b></div>
        </section>

        <section class="card">
          <h2>Asocjacja w fazie niepolarnej</h2>
          <p>W toluenie cząsteczki kwasu benzoesowego tworzą wiązania wodorowe i łączą się w dimery. Proces można zapisać ogólnie jako:</p>
          <div class="equation-block">
            ${CF.eq('<span class="math">n S ⇌ S<sub>n</sub></span>', "(5)")}
            ${CF.eq('<span class="math">K<sub>as</sub> = ' + CF.frac('<span class="math">[S<sub>n</sub>]</span>', '<span class="math">[S]<sup>n</sup></span>') + '</span>', "(6)")}
          </div>
          <p>W równowadze z fazą wodną uczestniczy przede wszystkim <strong>monomer</strong> <span class="math">S</span>, a nie dimer. Dlatego w liczniku prawa podziału nie można użyć całkowitego stężenia <span class="math">c<sub>t</sub></span> — trzeba oszacować stężenie monomeru.</p>
          <div class="association-visual" aria-hidden="true">
            <div class="monomer"><span class="atom">C</span><span class="bond"></span><span class="atom">O</span><span class="bond"></span><span class="atom">H</span></div>
            <span class="association-arrow">+</span>
            <div class="monomer"><span class="atom">H</span><span class="bond"></span><span class="atom">O</span><span class="bond"></span><span class="atom">C</span></div>
            <span class="association-arrow">⇌</span>
            <div class="dimer"><span class="atom">C</span><span class="bond"></span><span class="atom">O</span><span class="bond"></span><span class="atom">H</span><span class="dimer-bridge">⋯</span><span class="atom">H</span><span class="bond"></span><span class="atom">O</span><span class="bond"></span><span class="atom">C</span></div>
          </div>
          <p>Dla dimeru bilans stężenia w fazie organicznej można zapisać następująco:</p>
          <div class="equation-block emphasized">
            ${CF.eq('<span class="math">c<sub>t</sub> = [S] + 2[S<sub>2</sub>] ≈ 2K<sub>as</sub>[S]<sup>2</sup></span>', "gdy dimer dominuje")}
            ${CF.eq('<span class="math">[S] = ' + CF.sqrt(CF.frac('<span class="math">c<sub>t</sub></span>', '<span class="math">2K<sub>as</sub></span>')) + ' ∝ √c<sub>t</sub></span>')}
            ${CF.eq('<span class="math">K<sub>2</sub> = ' + CF.frac('<span class="math">√c<sub>t</sub></span>', '<span class="math">c<sub>w</sub>(1 − α)</span>') + ' = √(2K<sub>as</sub>) · K<sub>monomer</sub></span>', "przy silnej dimeryzacji")}
          </div>
          <p class="small-note">Przybliżenie jest tym lepsze, im silniejsza asocjacja, czyli im większe <span class="math">K<sub>as</sub>[S]</span>. <span class="math">K<sub>monomer</sub> = [S]<sub>toluen</sub>/[HA]<sub>woda</sub></span> jest „czystym” współczynnikiem podziału monomeru. <span class="math">c<sub>t</sub></span> jest tutaj całkowitym stężeniem przeliczonym na monomery (masa/M/V), dlatego dimer wnosi <span class="math">2[S<sub>2</sub>]</span>.</p>
          ${callout("info", "Co z tego wynika", "K₂ jest stałe w stałej temperaturze tylko wtedy, gdy dimer dominuje. Nie jest jednak czystym współczynnikiem podziału monomeru — jest iloczynem <span class=\"math\">K<sub>monomer</sub></span> i <span class=\"math\">√(2K<sub>as</sub>)</span>, dlatego ma wymiar <span class=\"math\">(mol·dm⁻³)<sup>−1/2</sup></span>. W ćwiczeniu porównujemy wartości dla obu naważek, zachowując ten sam model.")}
        </section>

        <section class="card">
          <h2>Kwas benzoesowy — podwójny problem</h2>
          <div class="two-col compact-gap">
            <div class="problem-card water-problem">
              <span class="problem-tag">faza wodna</span>
              <h3>Dysocjacja</h3>
              <p>HA ⇌ H⁺ + A⁻</p>
              <p>Do prawa podziału wstawiamy stężenie formy niezdysocjowanej:</p>
              <div class="equation compact"><span class="math">c<sub>w</sub>(1 − α)</span></div>
              <p class="small-note">α liczymy z pełnego prawa Ostwalda, znając <span class="math">K<sub>a</sub></span> i <span class="math">c<sub>w</sub></span>.</p>
            </div>
            <div class="problem-card organic-problem">
              <span class="problem-tag">faza organiczna</span>
              <h3>Dimeryzacja</h3>
              <p>2 HA ⇌ (HA)₂</p>
              <p>Do prawa podziału bierzemy stężenie monomeru, proporcjonalne do pierwiastka ze stężenia całkowitego:</p>
              <div class="equation compact"><span class="math">√c<sub>t</sub></span></div>
              <p class="small-note">To poprawka przyjęta w skrypcie; pełny wzór roboczy — moduł 04.</p>
            </div>
          </div>
          <p class="small-note table-note">Jak rozpoznać, co dzieje się z substancją?</p>
          <div class="table-wrap">
            <table class="data-table compact-table">
              <thead><tr><th>Obserwacja</th><th>Interpretacja</th></tr></thead>
              <tbody>
                <tr><td><span class="math">c<sub>t</sub>/c<sub>w</sub></span> jest stałe przy różnych stężeniach</td><td>Brak dysocjacji i asocjacji; obowiązuje prosta postać (1).</td></tr>
                <tr><td><span class="math">c<sub>t</sub>/c<sub>w</sub></span> rośnie ze stężeniem, a <span class="math">√c<sub>t</sub>/[c<sub>w</sub>(1 − α)]</span> jest w przybliżeniu stałe</td><td>Dimeryzacja w toluenie i dysocjacja w wodzie — nasz przypadek.</td></tr>
                <tr><td>Wykres <span class="math">log c<sub>t</sub></span> względem <span class="math">log[c<sub>w</sub>(1 − α)]</span> jest prostą o nachyleniu <span class="math">n</span></td><td><span class="math">n</span> to stopień asocjacji w fazie organicznej (<span class="math">n = 2</span> dla dimeru).</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        ${check("equilibria-1", "Dla słabego kwasu o Kₐ = 1·10⁻⁵ i c₀ = 0,01 mol·dm⁻³ przybliżenie α ≈ √(Kₐ/c₀) daje α ≈ 0,032. Dokładna wartość jest:", [
          "taka sama",
          "nieco mniejsza",
          "nieco większa",
          "zawsze równa 1"
        ], "b", "Pełne równanie ma mianownik 1 − α < 1, więc dla danego Ka iloczyn cα² musi być mniejszy. Dokładna α jest nieco mniejsza niż przybliżenie. Różnica rośnie wraz ze stężeniem i Ka.")}

        ${check("equilibria-2", "Dlaczego w liczniku wzoru roboczego dla kwasu benzoesowego pojawia się √cₜ?", [
          "Bo stężenie w toluenie jest zawsze mniejsze niż w wodzie",
          "Bo w toluenie kwas dimeryzuje i tylko monomer uczestniczy w podziale",
          "Bo toluen jest lżejszy od wody",
          "Bo kwas benzoesowy dysocjuje w toluenie"
        ], "b", "W niepolarnej fazie organicznej cząsteczki tworzą dimery. Równowaga z fazą wodną dotyczy monomeru, którego stężenie jest w przyjętym modelu proporcjonalne do pierwiastka z całkowitego stężenia w toluenie.")}
      `;
    }
  });

  /* ============================================================
     04 — WZÓR ROBOCZY
     ============================================================ */
  GUIDE.page({
    id: "formula",
    num: "04",
    group: "Teoria",
    title: "Wzór roboczy dla kwasu benzoesowego",
    short: "Wzór roboczy",
    eyebrow: "Moduł 04 · Synteza wzoru",
    lead: "Połącz prawo Nernsta z dwiema poprawkami: dysocjacją w wodzie i dimeryzacją w toluenie. Zobacz, jak z prostego stosunku stężeń powstaje wzór używany w obliczeniach.",
    body: function () {
      return `
        <div class="module-intro">
          <div>
            <p class="eyebrow">Cele modułu</p>
            ${goalList([
              "wyprowadzić wzór K = c<sub>t</sub>/c<sub>w</sub> oraz jego wersję z poprawkami,",
              "wyjaśnić rolę każdej poprawki w liczniku i mianowniku,",
              "świadomie wybrać wzór (1) lub (2) i zinterpretować otrzymaną wartość."
            ])}
          </div>
          <aside class="formula-slip">
            <span class="formula-slip-label">Wzór roboczy</span>
            ${CF.eq('<span class="math">K = ' + CF.frac('<span class="math">√c<sub>t</sub></span>', '<span class="math">c<sub>w</sub>(1 − α)</span>') + '</span>', "(2)")}
            <p>Licznik — monomer w toluenie; mianownik — niezdysocjowany kwas w wodzie.</p>
          </aside>
        </div>

        <section class="interactive-card" id="formula-builder">
          <div class="interactive-head">
            <div>
              <p class="eyebrow">Kreator wzoru</p>
              <h2>Złóż wzór z poprawek</h2>
              <p>Włączaj kolejne zjawiska. Zobacz, jak zmienia się postać wzoru i co dokładnie wchodzi do licznika oraz mianownika.</p>
            </div>
            <span class="live-badge"><i></i> interaktywny</span>
          </div>
          <div class="formula-builder-grid">
            <div class="formula-toggles">
              <label class="toggle-row">
                <input type="checkbox" id="fx-diss">
                <span class="toggle-ui"></span>
                <span><strong>Dysocjacja w wodzie</strong><small>uwzględnij stopień dysocjacji α</small></span>
              </label>
              <label class="toggle-row">
                <input type="checkbox" id="fx-assoc">
                <span class="toggle-ui"></span>
                <span><strong>Dimeryzacja w toluenie</strong><small>uwzględnij poprawkę √cₜ</small></span>
              </label>
              <label class="toggle-row">
                <input type="checkbox" id="fx-ideal" checked disabled>
                <span class="toggle-ui"></span>
                <span><strong>Rozcieńczony roztwór</strong><small>podstawa: K = c<sub>t</sub>/c<sub>w</sub></small></span>
              </label>
            </div>
            <div class="formula-stage">
              <div class="formula-live" id="formula-live">—</div>
              <div class="formula-legend" id="formula-legend">Wybierz poprawki, aby zobaczyć pełny wzór.</div>
            </div>
          </div>
          <div class="formula-component-grid">
            <div class="formula-component" id="fc-num"><span class="fc-label">licznik</span><strong id="fc-num-value">cₜ</strong><p>stężenie formy uczestniczącej w podziale w fazie organicznej</p></div>
            <div class="formula-component" id="fc-den"><span class="fc-label">mianownik</span><strong id="fc-den-value">c<sub>w</sub></strong><p>stężenie formy niezdysocjowanej w fazie wodnej</p></div>
          </div>
        </section>

        <section class="card">
          <h2>Wyprowadzenie krok po kroku</h2>
          <ol class="number-list">
            <li><strong>Startujemy od prawa Nernsta.</strong> Dla formy cząsteczkowej, która przechodzi między fazami: <span class="math">K = c<sub>org</sub>/c<sub>aq</sub></span>.</li>
            <li><strong>Faza organiczna.</strong> Kwas benzoesowy dimeryzuje, więc stężenie monomeru jest proporcjonalne do <span class="math">√c<sub>t</sub></span>. W liczniku pojawia się pierwiastek.</li>
            <li><strong>Faza wodna.</strong> Część kwasu dysocjuje. Stężenie formy niezdysocjowanej to <span class="math">c<sub>w</sub>(1 − α)</span>. W mianowniku pojawia się poprawka <span class="math">(1 − α)</span>.</li>
            <li><strong>Wzór końcowy.</strong> Po połączeniu obu poprawek otrzymujemy <span class="math">K = √c<sub>t</sub> / [c<sub>w</sub>(1 − α)]</span>.</li>
          </ol>
          <div class="equation-block emphasized">
            ${CF.eq('<span class="math">K<sub>prosty</sub> = ' + CF.frac('<span class="math">c<sub>t</sub></span>', '<span class="math">c<sub>w</sub></span>') + '</span>', "(1)")}
            ${CF.eq('<span class="math">K<sub>z poprawkami</sub> = ' + CF.frac('<span class="math">√c<sub>t</sub></span>', '<span class="math">c<sub>w</sub>(1 − α)</span>') + '</span>', "(2)")}
          </div>
          ${callout("warning", "Ważne: jednostki i interpretacja", "Przy silnej dimeryzacji można pokazać, że <span class=\"math\">K<sub>2</sub> = √(2K<sub>as</sub>) · K<sub>monomer</sub></span>. To wielkość stała w danej temperaturze, ale <strong>nie jest czystym współczynnikiem podziału monomeru</strong> — jest jego iloczynem z czynnikiem zależnym od stałej asocjacji. Dlatego ma wymiar <span class=\"math\">(mol·dm⁻³)<sup>−1/2</sup></span>. W ćwiczeniu porównujemy wartości dla obu naważek, a nie odczytujemy z nich bezwzględnej stałej termodynamicznej. Wzór (1) jest bezwymiarowy, ale zaniedbuje dysocjację i asocjację.")}
        </section>

        <section class="card">
          <h2>Który wzór kiedy?</h2>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Sytuacja</th><th>Wzór</th><th>Co zaniedbujemy</th></tr></thead>
              <tbody>
                <tr><td>Substancja nie dysocjuje ani nie asocjuje; roztwory rozcieńczone</td><td><span class="math">K = c<sub>t</sub>/c<sub>w</sub></span></td><td>Wszystkie efekty nierealne; wynik bezwymiarowy.</td></tr>
                <tr><td>Substancja dysocjuje w wodzie, nie asocjuje w toluenie</td><td><span class="math">K = c<sub>t</sub>/[c<sub>w</sub>(1 − α)]</span></td><td>Asocjację w fazie organicznej; aktywności.</td></tr>
                <tr><td>Substancja asocjuje w toluenie, nie dysocjuje w wodzie</td><td><span class="math">K = √c<sub>t</sub>/c<sub>w</sub></span></td><td>Dysocjację; stałą asocjacji (użyto uproszczenia).</td></tr>
                <tr><td>Kwas benzoesowy: oba efekty</td><td><span class="math">K = √c<sub>t</sub>/[c<sub>w</sub>(1 − α)]</span></td><td>Aktywności, dokładną stałą asocjacji, możliwe inne formy.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        ${check("formula-1", "W mianowniku wzoru roboczego dla kwasu benzoesowego znajduje się c<sub>w</sub>(1 − α). Co oznacza ten iloczyn?", [
          "Całkowite stężenie kwasu w wodzie",
          "Stężenie formy niezdysocjowanej w wodzie",
          "Stężenie jonów H⁺ w wodzie",
          "Stężenie dimeru w toluenie"
        ], "b", "c_w to całkowite stężenie analityczne w fazie wodnej. Mnożąc przez (1 − α), zostawiamy tylko formę HA, czyli cząsteczki niezdysocjowane, które mogą przechodzić do fazy organicznej.")}

        ${check("formula-2", "Dlaczego wzór (2) ma w liczniku pierwiastek, a nie cₜ?", [
          "Aby wynik był zawsze większy od jedności",
          "Bo w toluenie tylko monomer uczestniczy w równowadze, a jego stężenie jest w przyjętym modelu proporcjonalne do √cₜ",
          "Bo stężenie w toluenie podaje się w innych jednostkach",
          "Bo pierwiastek usuwa wpływ temperatury"
        ], "b", "Dimeryzacja obniża stężenie monomeru. Przy założeniach ćwiczenia monomer jest proporcjonalny do pierwiastka z całkowitego stężenia w toluenie — stąd √cₜ.")}
      `;
    }
  });

  /* ============================================================
     05 — EKSTRAKCJA
     ============================================================ */
  GUIDE.page({
    id: "extraction",
    num: "05",
    group: "Teoria",
    title: "Ekstrakcja jednostopniowa i wielostopniowa",
    short: "Ekstrakcja",
    eyebrow: "Moduł 05 · Zastosowanie praktyczne",
    lead: "Współczynnik podziału decyduje o tym, ile substancji przejdzie do rozpuszczalnika. Systematyczne, wielokrotne ekstrakcje pozwalają odzyskać ją niemal całkowicie — i to znacznie efektywniej niż jedna duża porcja.",
    body: function () {
      return `
        <div class="module-intro">
          <div>
            <p class="eyebrow">Cele modułu</p>
            ${goalList([
              "wyprowadzić wzór na ułamek substancji pozostający w fazie wodnej,",
              "obliczyć wydajność ekstrakcji jedno- i wielostopniowej,",
              "uzasadnić, dlaczego kilka małych porcji rozpuszczalnika jest skuteczniejsze od jednej dużej."
            ])}
          </div>
          <aside class="formula-slip">
            <span class="formula-slip-label">Po n ekstrakcjach</span>
            ${CF.eq('<span class="math">m<sub>n</sub> = m<sub>0</sub> · (' + CF.frac('<span class="math">V<sub>aq</sub></span>', '<span class="math">V<sub>aq</sub> + K V<sub>org</sub></span>') + ')<sup>n</sup></span>')}
            <p>Każda porcja świeżego rozpuszczalnika obniża resztę w sposób mnożnikowy.</p>
          </aside>
        </div>

        <section class="card">
          <h2>Ekstrakcja jednostopniowa</h2>
          <p>Mamy roztwór substancji w wodzie o masie <span class="math">m<sub>0</sub></span> i objętości <span class="math">V<sub>aq</sub></span>. Dodajemy porcję rozpuszczalnika organicznego o objętości <span class="math">V<sub>org</sub></span>. Po osiągnięciu równowagi:</p>
          <div class="equation-block">
            ${CF.eq('<span class="math">K = ' + CF.frac('<span class="math">c<sub>org</sub></span>', '<span class="math">c<sub>aq</sub></span>') + '</span>')}
            ${CF.eq('<span class="math">m<sub>0</sub> = c<sub>aq</sub>V<sub>aq</sub> + c<sub>org</sub>V<sub>org</sub></span>', "bilans masy")}
          </div>
          <p>Po podstawieniu <span class="math">c<sub>org</sub> = K c<sub>aq</sub></span> i podzieleniu przez <span class="math">m<sub>0</sub></span> otrzymujemy ułamek masy, który pozostał w fazie wodnej:</p>
          <div class="equation-block emphasized">
            ${CF.eq('<span class="math">q = ' + CF.frac('<span class="math">m<sub>aq</sub></span>', '<span class="math">m<sub>0</sub></span>') + ' = ' + CF.frac('<span class="math">V<sub>aq</sub></span>', '<span class="math">V<sub>aq</sub> + K V<sub>org</sub></span>') + '</span>', "(7)")}
            ${CF.eq('<span class="math">E = 1 − q</span>', "wydajność")}
          </div>
          <p>Jeśli <span class="math">K</span> jest duże lub objętość fazy organicznej jest duża, <span class="math">q</span> maleje, a wydajność <span class="math">E</span> rośnie.</p>
        </section>

        <section class="interactive-card" id="extraction-tool">
          <div class="interactive-head">
            <div>
              <p class="eyebrow">Symulator ekstrakcji</p>
              <h2>Podziel porcję i zobacz różnicę</h2>
              <p>Ta sama całkowita objętość rozpuszczalnika może być użyta raz albo w kilku porcjach. Zmień parametry i porównaj wydajność.</p>
            </div>
            <span class="live-badge"><i></i> bilans masy</span>
          </div>
          <div class="tool-grid">
            <div class="tool-controls">
              <label class="field">
                <span class="field-label">Początkowa masa substancji <small>[mg]</small></span>
                <input type="number" id="ex-mass" class="input" min="0.1" step="1" value="100">
              </label>
              <label class="field">
                <span class="field-label">Współczynnik podziału <span class="math">K</span></span>
                <input type="number" id="ex-k" class="input" min="0.01" step="0.1" value="8">
              </label>
              <label class="field">
                <span class="field-label">Objętość fazy wodnej <span class="math">V<sub>aq</sub></span> <small>[cm³]</small></span>
                <input type="number" id="ex-vaq" class="input" min="1" step="1" value="100">
              </label>
              <label class="field">
                <span class="field-label">Łączna objętość rozpuszczalnika <span class="math">V<sub>org</sub></span> <small>[cm³]</small></span>
                <input type="number" id="ex-vorg" class="input" min="1" step="1" value="100">
              </label>
              <label class="field">
                <span class="field-label">Liczba porcji <span class="math">n</span></span>
                <input type="range" id="ex-n" min="1" max="6" step="1" value="1" data-output="ex-n-out">
                <output id="ex-n-out" class="range-output">1</output>
              </label>
            </div>
            <div class="tool-results">
              <div class="result-tile"><span>Objętość jednej porcji</span><strong id="ex-vportion">—</strong></div>
              <div class="result-tile"><span>Ułamek pozostający w wodzie <span class="math">q</span></span><strong id="ex-q">—</strong></div>
              <div class="result-tile"><span>Masa pozostała w wodzie</span><strong id="ex-remaining">—</strong></div>
              <div class="result-tile"><span>Wydajność ekstrakcji</span><strong id="ex-efficiency">—</strong></div>
              <div class="result-tile wide highlight-tile"><span>Porównanie z jedną porcją</span><p id="ex-compare">—</p></div>
            </div>
          </div>
          <div class="extraction-stages">
            <div class="stages-head"><span>Przebieg ekstrakcji</span><span id="ex-stage-caption">—</span></div>
            <div class="stage-bars" id="ex-stage-bars"></div>
          </div>
          <div class="equation-block compact-equation">
            ${CF.eq('<span class="math">m<sub>n</sub> = m<sub>0</sub> · q<sup>n</sup> = m<sub>0</sub> · (' + CF.frac('<span class="math">V<sub>aq</sub></span>', '<span class="math">V<sub>aq</sub> + K·V<sub>org</sub>/n</span>') + ')<sup>n</sup></span>')}
          </div>
        </section>

        <section class="card">
          <h2>Dlaczego wiele porcji jest lepsze?</h2>
          <p>Przy jednej porcji 100 cm³ i <span class="math">K = 8</span> współczynnik <span class="math">q</span> wynosi 100/(100 + 800) ≈ 0,111. Po dwóch porcjach po 50 cm³ każda: <span class="math">q = 100/(100 + 400) ≈ 0,200</span>, ale po dwóch etapach pozostaje <span class="math">0,200² = 0,040</span>, czyli tylko 4,0 % masy. Jedna porcja zostawia 11,1 %. To nie magia — to konsekwencja mnożenia ułamków.</p>
          <p>Ten sam efekt dla <span class="math">K = 10</span>, <span class="math">V<sub>aq</sub> = 100 cm³</span> i łącznej objętości ekstrahenta 100 cm³:</p>
          <div class="table-wrap">
            <table class="data-table compact-table">
              <thead><tr><th>Sposób ekstrakcji</th><th>Pozostaje w wodzie</th><th>Wyekstrahowano</th></tr></thead>
              <tbody>
                <tr><td>1 × 100 cm³</td><td>9,09 %</td><td>90,9 %</td></tr>
                <tr><td>2 × 50 cm³</td><td>2,78 %</td><td>97,2 %</td></tr>
                <tr><td>3 × 33,3 cm³</td><td>1,23 %</td><td>98,8 %</td></tr>
                <tr><td>4 × 25 cm³</td><td>0,67 %</td><td>99,3 %</td></tr>
                <tr><td>5 × 20 cm³</td><td>0,41 %</td><td>99,6 %</td></tr>
              </tbody>
            </table>
          </div>
          <p class="small-note">Zyski maleją z każdym kolejnym stopniem, dlatego w praktyce stosuje się zwykle 2–4 ekstrakcje. Wartości dotyczą substancji w jednej formie, bez dysocjacji i asocjacji.</p>
          <div class="two-col compact-gap">
            <div class="mini-card success-card">
              <h3>Zalety ekstrakcji wielostopniowej</h3>
              <ul class="plain-list">
                <li>większy odzysk substancji przy tej samej ilości rozpuszczalnika,</li>
                <li>możliwość zatężenia próbki,</li>
                <li>lepsze rozdzielenie substancji o różnych <span class="math">K</span>.</li>
              </ul>
            </div>
            <div class="mini-card warning-mini">
              <h3>Kiedy nie jest opłacalna?</h3>
              <ul class="plain-list">
                <li>zbyt wiele etapów zwiększa czas i ryzyko emulgowania,</li>
                <li>straty mechaniczne i zanieczyszczenia mogą przewyższyć zysk,</li>
                <li>selektywność zależy od różnicy <span class="math">K</span>, a nie tylko od liczby porcji.</li>
              </ul>
            </div>
          </div>
          <p><strong>Odmiany wielostopniowe:</strong> ekstrakcja przeciwprądowa i rozdział przeciwprądowy Craiga. Ta idea jest teoretycznym zalążkiem <strong>chromatografii podziałowej</strong>, w której substancje rozdziela różnica współczynników podziału między fazę ruchomą i nieruchomą.</p>
        </section>

        <section class="card">
          <h2>Zastosowania praktyczne</h2>
          <div class="application-grid">
            <div class="application"><span class="app-icon">Rx</span><h3>Farmacja</h3><p>Izolacja alkaloidów i substancji roślinnych, oczyszczanie ekstraktów, otrzymywanie leków.</p></div>
            <div class="application"><span class="app-icon">A</span><h3>Analiza</h3><p>Przygotowanie próbek (LLE), zatężanie analitów, oznaczanie leków w płynach ustrojowych.</p></div>
            <div class="application"><span class="app-icon">H₂O</span><h3>Środowisko</h3><p>Usuwanie zanieczyszczeń organicznych ze ścieków i ocena ich losu w środowisku.</p></div>
            <div class="application"><span class="app-icon">F</span><h3>Żywność i kosmetyki</h3><p>Otrzymywanie aromatów, barwników, przeciwutleniaczy i składników aktywnych.</p></div>
          </div>
          ${callout("info", "Przykład: ekstrakcja kwasowo-zasadowa", "Zmiana pH pozwala przenosić substancję między fazami. Kwas w formie niejonowej (niskie pH) przechodzi do fazy organicznej, a w formie soli (wysokie pH) wraca do wody. W ten sposób rozdziela się kwasy, zasady i substancje obojętne. Klasyczny przykład technologiczny to ekstrakcja penicyliny z zakwaszonego płynu pofermentacyjnego do rozpuszczalnika organicznego, a następnie z powrotem do buforu o pH około 7.")}
        </section>

        ${check("extraction-1", "K = 9, V_aq = 50 cm³, V_org = 50 cm³. Jaki ułamek substancji pozostaje w wodzie po jednej ekstrakcji?", [
          "1/2",
          "1/10",
          "1/11",
          "9/10"
        ], "b", "q = V_aq/(V_aq + K·V_org) = 50/(50 + 9·50) = 50/500 = 0,1 = 1/10. Wydajność wynosi 90 %.")}

        ${check("extraction-2", "Ta sama całkowita objętość rozpuszczalnika została podzielona na dwie równe porcje. W porównaniu z jedną porcją:", [
          "wydajność jest taka sama",
          "wydajność jest mniejsza, bo każda porcja jest mniejsza",
          "wydajność jest większa, bo reszta w wodzie jest mnożona przez q dwa razy",
          "nie da się tego określić bez znajomości masy początkowej"
        ], "c", "Po dwóch etapach pozostaje m0·q², gdzie q < 1, więc reszta jest mniejsza niż po jednym etapie z całą objętością. To klasyczny wynik ekstrakcji wielostopniowej.")}
      `;
    }
  });

  /* ============================================================
     06 — AKTYWNOŚĆ BIOLOGICZNA
     ============================================================ */
  GUIDE.page({
    id: "bioactivity",
    num: "06",
    group: "Teoria",
    title: "Współczynnik podziału a aktywność biologiczna",
    short: "Aktywność biologiczna",
    eyebrow: "Moduł 06 · Od rozdzielacza do organizmu",
    lead: "Lipofilowość decyduje o tym, czy substancja przeniknie błonę, gdzie się zgromadzi i jak długo będzie działać. Współczynnik podziału jest jednym z najważniejszych parametrów w projektowaniu leków.",
    body: function () {
      return `
        <div class="module-intro">
          <div>
            <p class="eyebrow">Cele modułu</p>
            ${goalList([
              "zinterpretować logP jako miarę lipofilowości,",
              "powiązać K z przenikaniem błon, wchłanianiem i dystrybucją,",
              "wyjaśnić, jak pH i jonizacja zmieniają współczynnik dystrybucji D."
            ])}
          </div>
          <aside class="formula-slip">
            <span class="formula-slip-label">Lipofilowość</span>
            ${CF.eq('<span class="math">logP = log<sub>10</sub> ' + CF.frac('<span class="math">c<sub>oktanol</sub></span>', '<span class="math">c<sub>woda</sub></span>') + '</span>')}
            <p>Układ odniesienia: oktanol–woda, forma niejonowa.</p>
          </aside>
        </div>

        <section class="card">
          <h2>Co opisuje logP?</h2>
          <p><span class="math">logP</span> to logarytm dziesiętny współczynnika podziału między oktanol i wodę. Oktanol jest dobrym modelem fazy lipidowej błony, dlatego logP jest szeroko stosowany w farmacji i chemii medycznej.</p>
          <div class="equation-block">
            ${CF.eq('<span class="math">logP = log<sub>10</sub>(c<sub>oktanol</sub>/c<sub>woda</sub>)</span>', "dla formy niejonowej")}
          </div>
          <div class="bio-grid">
            <div class="bio-card"><span class="bio-icon">↑</span><h3>Wysokie logP</h3><p>Substancja lipofilowa: dobrze przechodzi przez błony, ale może odkładać się w tkance tłuszczowej, mieć słabą rozpuszczalność w wodzie i wiązać się z białkami.</p></div>
            <div class="bio-card"><span class="bio-icon">↓</span><h3>Niskie logP</h3><p>Substancja hydrofilowa: dobrze rozpuszcza się w wodzie, ale słabo przenika przez błony lipidowe. Może być szybko wydalana.</p></div>
            <div class="bio-card"><span class="bio-icon">↔</span><h3>Optimum</h3><p>Dla wielu leków doustnych korzystny jest umiarkowany zakres lipofilowości — wystarczający do przejścia przez błonę, ale nie powodujący nadmiernej kumulacji.</p></div>
          </div>
          <p class="small-note table-note">Orientacyjne wartości logP (zależą od źródła i metody pomiaru):</p>
          <div class="table-wrap">
            <table class="data-table compact-table">
              <thead><tr><th>Związek</th><th>logP (≈)</th><th>Charakter</th></tr></thead>
              <tbody>
                <tr><td>Kofeina</td><td>−0,1</td><td>hydrofilowa</td></tr>
                <tr><td>Paracetamol</td><td>0,5</td><td>umiarkowanie hydrofilowa</td></tr>
                <tr><td>Kwas acetylosalicylowy</td><td>1,2</td><td>zrównoważona</td></tr>
                <tr><td>Kwas benzoesowy</td><td>1,9</td><td>zrównoważona</td></tr>
                <tr><td>Diazepam</td><td>2,8</td><td>lipofilowa</td></tr>
                <tr><td>Ibuprofen</td><td>4,0</td><td>silnie lipofilowa</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="interactive-card" id="logp-tool">
          <div class="interactive-head">
            <div>
              <p class="eyebrow">Mapa lipofilowości</p>
              <h2>Gdzie jest Twoja substancja?</h2>
              <p>Przesuń suwak logP. To orientacyjna mapa skutków, a nie predykcja właściwości konkretnego leku.</p>
            </div>
            <span class="live-badge"><i></i> skala orientacyjna</span>
          </div>
          <div class="logp-scale-wrap">
            <div class="logp-scale" aria-hidden="true">
              <span class="zone zone-hydro">hydrofilowa</span>
              <span class="zone zone-balance">zrównoważona</span>
              <span class="zone zone-lipo">lipofilowa</span>
              <span class="zone zone-high">bardzo lipofilowa</span>
            </div>
            <input type="range" id="logp-range" min="-2" max="7" step="0.1" value="2.5" aria-label="logP substancji" data-output="logp-out">
            <div class="logp-readout"><strong id="logp-out">2,5</strong><span id="logp-category">zakres zrównoważony</span></div>
          </div>
          <div class="tool-results">
            <div class="result-tile wide"><span>Co to oznacza w praktyce?</span><p id="logp-note">—</p></div>
          </div>
          ${callout("info", "Granice modelu", "Przedziały na skali są orientacyjne i służą do nauki zależności. Rzeczywista biodostępność zależy także od masy cząsteczkowej, liczby donorów i akceptorów wiązań wodorowych, ładunku, polarności powierzchni, metabolizmu i formulacji.")}
        </section>

        <section class="card">
          <h2>Jonizacja zmienia wszystko</h2>
          <p>Większość leków to słabe kwasy lub zasady. W roztworze występują w formie zjonizowanej i niejonowej, a tylko forma niejonowa jest na ogół dobrze rozpuszczalna w lipidach. Dlatego współczynnik dystrybucji <span class="math">D</span> zależy od pH.</p>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Typ substancji</th><th>Wyrażenie na D (faza organiczna/wodna)</th><th>Efekt pH</th></tr></thead>
              <tbody>
                <tr><td>Słaby kwas (HA)</td><td><span class="math">D = K<sub>D</sub> / (1 + 10<sup>pH − pK<sub>a</sub></sup>)</span></td><td>Wzrost pH zwiększa jonizację i obniża D.</td></tr>
                <tr><td>Słaba zasada (B)</td><td><span class="math">D = K<sub>D</sub> / (1 + 10<sup>pK<sub>a</sub> − pH</sup>)</span></td><td>Spadek pH zwiększa jonizację i obniża D.</td></tr>
              </tbody>
            </table>
          </div>
          <p class="small-note">Przykład dla kwasu benzoesowego (<span class="math">pK<sub>a</sub> ≈ 4,19</span>): udział formy niejonowanej HA zależy od pH.</p>
          <div class="table-wrap">
            <table class="data-table compact-table">
              <thead><tr><th>pH</th><th>2,0</th><th>4,19</th><th>6,0</th><th>7,4</th></tr></thead>
              <tbody><tr><td>udział HA</td><td>0,994</td><td>0,50</td><td>0,015</td><td>0,0006</td></tr></tbody>
            </table>
          </div>
          ${callout("tip", "Pułapka jonowa", "Zjonizowana forma słabego kwasu praktycznie nie przechodzi przez błonę. Jeśli po jednej stronie błony pH sprzyja jonizacji, substancja może zostać „uwięziona” po tej stronie. To zjawisko wykorzystuje się w farmakokinetyce i toksykologii.")}
        </section>

        <section class="card">
          <h2>Od ćwiczenia do praktyki</h2>
          <div class="connection-line">
            <div class="connection-node"><span>1</span><p>Rozdzielacz woda–toluen</p></div>
            <span class="connection-arrow">→</span>
            <div class="connection-node"><span>2</span><p>Współczynnik podziału K</p></div>
            <span class="connection-arrow">→</span>
            <div class="connection-node"><span>3</span><p>Lipofilowość i logP</p></div>
            <span class="connection-arrow">→</span>
            <div class="connection-node"><span>4</span><p>Wchłanianie, dystrybucja, trwałość leku</p></div>
          </div>
          <p>W ćwiczeniu mierzysz podział kwasu benzoesowego między wodę i toluen. To uproszczony model, ale pokazuje te same zjawiska, które decydują o zachowaniu leku w organizmie: powinowactwo do fazy wodnej i lipidowej, wpływ pH oraz skłonność do tworzenia form zasocjowanych.</p>
        </section>

        <details class="decomposition">
          <summary>Rozszerzenie: logD, reguła Lipinskiego, QSAR Hanscha i pułapka jonowa</summary>
          <div class="extension-body">
            <p><strong>logD</strong> to logarytm współczynnika dystrybucji przy danym pH. Dla słabego kwasu i słabej zasady:</p>
            <div class="equation-block compact-equation">
              ${CF.eq('<span class="math">log D = log P − log<sub>10</sub>(1 + 10<sup>(pH − pK<sub>a</sub>)</sup>)</span>', "słaby kwas")}
              ${CF.eq('<span class="math">log D = log P − log<sub>10</sub>(1 + 10<sup>(pK<sub>a</sub> − pH)</sup>)</span>', "słaba zasada")}
            </div>
            <p><strong>Reguła Overtona–Meyera</strong> (ok. 1900) była pierwszym historycznym powiązaniem siły działania narkotyków z ich lipofilowością (współczynnik podziału oliwa/woda).</p>
            <p><strong>Analiza Hanscha (QSAR):</strong> aktywność często zależy od logP w sposób paraboliczny:</p>
            <div class="equation compact"><span class="math">log(1/C) = −k<sub>1</sub>(logP)<sup>2</sup> + k<sub>2</sub>logP + k<sub>3</sub></span></div>
            <p>Zbyt hydrofilowy związek nie wnika w błonę, zbyt lipofilowy może „utykać” w lipidach lub mieć złą rozpuszczalność w płynach ustrojowych. W klasycznych modelach dla leków działających na OUN optimum logP wynosi często około 2, ale zależy od klasy związku.</p>
            <p><strong>Reguła pięciu Lipinskiego</strong> — orientacyjne kryteria dobrego wchłaniania doustnego: masa cząsteczkowa ≤ 500 Da, logP ≤ 5, nie więcej niż 5 donorów i 10 akceptorów wiązań wodorowych.</p>
            <p><strong>Hipoteza podziału pH:</strong> w klasycznym modelu przez błony przenika głównie forma niejonowana, więc słaby kwas łatwiej wchłania się w kwaśnym środowisku żołądka, a słaba zasada w jelicie. W rzeczywistości o wchłanianiu decydują też powierzchnia błony, transportery, metabolizm i formulacja — nie należy traktować tego jako reguły absolutnej.</p>
            <p><strong>Inne zastosowania:</strong> przenikanie przez skórę (warstwa rogowa; w kosmetologii często korzystny jest umiarkowany logP około 1–3), bariera krew–mózg i bioakumulacja w środowisku.</p>
          </div>
        </details>

        ${check("bioactivity-1", "Substancja ma logP = 5,5. Czego można się spodziewać?", [
          "Bardzo dobrej rozpuszczalności w wodzie i słabego przenikania przez błony",
          "Silnej lipofilowości, ryzyka kumulacji w tkance tłuszczowej i gorszej rozpuszczalności w wodzie",
          "Brak wpływu na wchłanianie, bo logP dotyczy tylko rozdzielaczy laboratoryjnych",
          "Zawsze wysokiej biodostępności doustnej"
        ], "b", "Wysokie logP oznacza przewagę formy lipofilowej. Może to poprawiać przenikanie przez błony, ale zwiększa ryzyko kumulacji i pogarsza rozpuszczalność w wodzie. Biodostępność nie rośnie monotonicznie z logP.")}

        ${check("bioactivity-2", "Dla słabego kwasu wzrost pH w przedziale poniżej pKₐ powoduje, że:", [
          "coraz większa część cząsteczek jest zjonizowana, a D maleje",
          "coraz większa część cząsteczek jest niejonowa, a D rośnie",
          "D nie zależy od pH",
          "K_D zmienia się, ale D pozostaje stałe"
        ], "a", "Wzrost pH przesuwa równowagę HA ⇌ H⁺ + A⁻ w prawo. Rośnie udział formy zjonizowanej, która słabo przechodzi do fazy organicznej, więc współczynnik dystrybucji D maleje.")}
      `;
    }
  });

  global.GUIDE = GUIDE;
})(window);
