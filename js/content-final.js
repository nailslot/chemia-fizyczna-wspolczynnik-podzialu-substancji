/* ============================================================
   Treść przewodnika — część 3: test, ściągawka, zakres
   ============================================================ */
(function (global) {
  "use strict";

  const GUIDE = global.GUIDE;
  const page = GUIDE.page;

  function goalList(items) {
    return '<ul class="goal-list">' + items.map(function (item) {
      return '<li><span class="goal-check" aria-hidden="true">✓</span><span>' + item + "</span></li>";
    }).join("") + "</ul>";
  }

  function callout(type, title, body) {
    return '<aside class="callout callout-' + type + '">' +
      '<div class="callout-icon" aria-hidden="true">' +
      (type === "warning" ? "!" : type === "tip" ? "★" : "i") +
      "</div><div><strong>" + title + "</strong><p>" + body + "</p></div></aside>";
  }

  /* ============================================================
     BANKA PYTAŃ
     ============================================================ */
  GUIDE.quiz = [
    {
      id: "q1",
      cat: "Termodynamika",
      q: "W stanie równowagi między dwiema fazami wyrównują się:",
      options: [
        "stężenia molowe substancji w obu fazach",
        "potencjały chemiczne substancji w obu fazach",
        "objętości obu faz",
        "współczynniki aktywności w obu fazach"
      ],
      answer: 1,
      explain: "Równowaga termodynamiczna oznacza równość potencjałów chemicznych. Stężenia mogą się różnić — właśnie dlatego mówimy o współczynniku podziału."
    },
    {
      id: "q2",
      cat: "Aktywność",
      q: "Substancja ma stężenie 0,10 mol·dm⁻³ i współczynnik aktywności γ = 0,80. Jej aktywność (przy c° = 1 mol·dm⁻³) wynosi:",
      options: ["0,80", "0,08", "0,10", "1,25"],
      answer: 1,
      explain: "a = γ·c/c° = 0,80 · 0,10 = 0,08. Aktywność jest bezwymiarowa."
    },
    {
      id: "q3",
      cat: "Prawo Nernsta",
      q: "Prosty wzór K = c₁/c₂ jest najbardziej odpowiedni, gdy:",
      options: [
        "substancja silnie dysocjuje w jednej fazie",
        "substancja tworzy dimery w fazie organicznej",
        "roztwory są rozcieńczone, a substancja nie zmienia stanu cząsteczkowego",
        "objętości faz są różne"
      ],
      answer: 2,
      explain: "Wzór stężeniowy zakłada roztwory rozcieńczone (γ ≈ 1) oraz brak dysocjacji, asocjacji i innych reakcji w obu fazach."
    },
    {
      id: "q4",
      cat: "Dysocjacja",
      q: "Pełne prawo rozcieńczeń Ostwalda dla słabego kwasu ma postać:",
      options: [
        "Kₐ = c₀α²",
        "Kₐ = c₀α²/(1 − α)",
        "Kₐ = c₀(1 − α)/α²",
        "Kₐ = α/c₀"
      ],
      answer: 1,
      explain: "Po podstawieniu [A⁻] = c₀α i [HA] = c₀(1 − α) do wyrażenia na Kₐ otrzymujemy Kₐ = c₀α²/(1 − α)."
    },
    {
      id: "q5",
      cat: "Dysocjacja",
      q: "Rozcieńczanie roztworu słabego kwasu (bez zmiany temperatury) powoduje, że:",
      options: [
        "stopień dysocjacji α rośnie, a stężenie H⁺ maleje",
        "stopień dysocjacji α maleje, a stężenie H⁺ rośnie",
        "α i [H⁺] rosną",
        "α i [H⁺] pozostają stałe"
      ],
      answer: 0,
      explain: "Z prawa Ostwalda α ≈ √(Kₐ/c₀) — wraz ze spadkiem c₀ rośnie α. Jednocześnie [H⁺] = c₀α maleje, bo efekt rozcieńczenia przeważa."
    },
    {
      id: "q6",
      cat: "Wzór roboczy",
      q: "W mianowniku wzoru roboczego dla kwasu benzoesowego występuje c<sub>w</sub>(1 − α). Wynika to z:",
      options: [
        "dimeryzacji w toluenie",
        "dysocjacji w fazie wodnej",
        "parowania toluenu",
        "zmiany temperatury podczas miareczkowania"
      ],
      answer: 1,
      explain: "Tylko forma niezdysocjowana HA uczestniczy w prostym podziale. Jej stężenie to c<sub>w</sub>(1 − α)."
    },
    {
      id: "q7",
      cat: "Wzór roboczy",
      q: "Pierwiastek √cₜ w liczniku wzoru roboczego jest związany z:",
      options: [
        "dysocjacją kwasu w wodzie",
        "dimeryzacją kwasu w toluenie",
        "obecnością wskaźnika",
        "niepewnością miareczkowania"
      ],
      answer: 1,
      explain: "W fazie organicznej kwas benzoesowy tworzy dimery. W równowadze z wodą uczestniczy monomer, którego stężenie jest w przyjętym modelu proporcjonalne do √cₜ."
    },
    {
      id: "q8",
      cat: "Obliczenia",
      q: "Do zmiareczkowania 10,0 cm³ fazy wodnej zużyto 2,50 cm³ 0,0100 M NaOH. Stężenie kwasu w fazie wodnej wynosi:",
      options: ["0,00025 mol·dm⁻³", "0,0025 mol·dm⁻³", "0,025 mol·dm⁻³", "0,25 mol·dm⁻³"],
      answer: 1,
      explain: "n(NaOH) = 0,0100 mol·dm⁻³ · 0,00250 dm³ = 2,50·10⁻⁵ mol. Dla reakcji 1:1 c_w = 2,50·10⁻⁵ / 0,0100 = 2,50·10⁻³ mol·dm⁻³ = 0,0025 M."
    },
    {
      id: "q9",
      cat: "Obliczenia",
      q: "Stężenie kwasu w fazie wodnej wynosi 0,00250 mol·dm⁻³, objętość fazy wodnej 35,0 cm³, a masa molowa 122,12 g·mol⁻¹. Masa kwasu w tej fazie to około:",
      options: ["0,00107 g", "0,0107 g", "0,107 g", "1,07 g"],
      answer: 1,
      explain: "m = c·V·M = 0,00250 · 0,0350 · 122,12 ≈ 0,0107 g."
    },
    {
      id: "q10",
      cat: "Ekstrakcja",
      q: "K = 9, V_aq = 50 cm³, V_org = 50 cm³. Po jednej ekstrakcji w fazie wodnej pozostaje:",
      options: ["10 % substancji", "50 % substancji", "90 % substancji", "1 % substancji"],
      answer: 0,
      explain: "q = V_aq/(V_aq + K·V_org) = 50/(50 + 450) = 0,10, czyli 10 %. Wydajność ekstrakcji wynosi 90 %."
    },
    {
      id: "q11",
      cat: "Ekstrakcja",
      q: "Ta sama całkowita objętość rozpuszczalnika użyta w dwóch porcjach zamiast jednej:",
      options: [
        "daje taką samą wydajność",
        "daje mniejszą wydajność, bo porcje są mniejsze",
        "daje większą wydajność, bo reszta w wodzie jest mnożona przez q dwa razy",
        "zmienia K"
      ],
      answer: 2,
      explain: "Po n etapach pozostaje m₀qⁿ. Ponieważ 0 < q < 1, podział na porcje obniża resztę substancji. K pozostaje stałe w danej temperaturze."
    },
    {
      id: "q12",
      cat: "Aktywność biologiczna",
      q: "Wysokie logP (np. 5,5) zwykle oznacza:",
      options: [
        "dużą hydrofilowość i słabe przenikanie przez błony",
        "dużą lipofilowość, ryzyko kumulacji w tkance tłuszczowej i gorszą rozpuszczalność w wodzie",
        "brak wpływu na wchłanianie",
        "zawsze wysoką biodostępność doustną"
      ],
      answer: 1,
      explain: "Wysokie logP oznacza przewagę formy lipofilowej. Może poprawiać przenikanie, ale zwiększa ryzyko kumulacji i pogarsza rozpuszczalność w wodzie."
    },
    {
      id: "q13",
      cat: "Aktywność biologiczna",
      q: "Dla słabego kwasu wzrost pH powyżej pKₐ powoduje, że:",
      options: [
        "rośnie udział formy zjonizowanej, a współczynnik dystrybucji D maleje",
        "rośnie udział formy niejonowej, a D rośnie",
        "D nie zależy od pH",
        "K<sub>D</sub> zmienia się, ale D pozostaje stałe"
      ],
      answer: 0,
      explain: "Wzrost pH przesuwa równowagę HA ⇌ H⁺ + A⁻ w prawo. Forma zjonizowana słabo przechodzi do fazy organicznej, więc D maleje."
    },
    {
      id: "q14",
      cat: "Laboratorium",
      q: "Dlaczego przed spuszczeniem fazy wodnej z rozdzielacza należy wyjąć korek?",
      options: [
        "Aby toluen szybciej parował",
        "Aby wyrównać ciśnienie i umożliwić równy wypływ cieczy",
        "Aby zwiększyć stężenie kwasu w wodzie",
        "Aby zmienić barwę wskaźnika"
      ],
      answer: 1,
      explain: "Zamknięty rozdzielacz działa jak naczynie pod obniżonym ciśnieniem. Wyjęcie korka wyrównuje ciśnienie i pozwala kontrolować wypływ."
    },
    {
      id: "q15",
      cat: "Laboratorium",
      q: "Dlaczego do każdej próbki dodaje się zawsze taką samą ilość fenoloftaleiny?",
      options: [
        "Aby próbki wyglądały identycznie",
        "Aby wpływ wskaźnika na objętość titranta był powtarzalny i można go było pominąć w porównaniu",
        "Ponieważ fenoloftaleina katalizuje reakcję",
        "Aby obniżyć stężenie NaOH"
      ],
      answer: 1,
      explain: "Wskaźnik jest słabym kwasem i może zużywać titrant. Stała ilość w każdej próbce zapewnia porównywalność wyników."
    },
    {
      id: "q16",
      cat: "Rachunek błędów",
      q: "Błąd bezwzględny pomiaru wielkości x względem wartości tablicowej X_t wyraża się wzorem:",
      options: [
        "Δx = |x − X_t|",
        "Δx = x/X_t",
        "Δx = |X_t|/x",
        "Δx = |x − X_t|/x"
      ],
      answer: 0,
      explain: "Błąd bezwzględny to moduł różnicy między wynikiem a wartością rzeczywistą. Błąd względny to Δx/|X_t|."
    },
    {
      id: "q17",
      cat: "Rachunek błędów",
      q: "Niepewność typu A wynosi 0,12, a typu B 0,16. Niepewność całkowita to:",
      options: ["0,28", "0,20", "0,04", "0,16"],
      answer: 1,
      explain: "u_c = √(0,12² + 0,16²) = √(0,0144 + 0,0256) = √0,04 = 0,20."
    },
    {
      id: "q18",
      cat: "Opracowanie graficzne",
      q: "Który sposób przedstawienia punktów pomiarowych jest prawidłowy?",
      options: [
        "Połączenie wszystkich punktów linią łamaną",
        "Zaznaczenie punktów i poprowadzenie gładkiej linii lub dopasowanej prostej",
        "Połączenie tylko pierwszego i ostatniego punktu",
        "Pominięcie punktów, jeśli leżą blisko siebie"
      ],
      answer: 1,
      explain: "Linia łamana sugeruje znajomość przebiegu między punktami. Należy poprowadzić gładką linię lub prostą dopasowaną do wszystkich punktów."
    }
  ];

  /* ============================================================
     12 — TEST KOŃCOWY
     ============================================================ */
  page({
    id: "quiz",
    num: "12",
    group: "Utrwalenie",
    title: "Test końcowy",
    short: "Test końcowy",
    eyebrow: "Moduł 12 · Sprawdź całość",
    lead: "Osiemnaście pytań z całego materiału: od potencjału chemicznego po rachunek błędów i styl sprawozdania. Wybierz odpowiedzi, sprawdź wynik i przeczytaj wyjaśnienia.",
    body: function () {
      return `
        <div class="module-intro">
          <div>
            <p class="eyebrow">Zasady</p>
            ${goalList([
              "18 pytań, po jednej poprawnej odpowiedzi,",
              "wynik od razu z wyjaśnieniem każdego pytania,",
              "80 % poprawnych odpowiedzi oznacza zaliczenie modułu."
            ])}
          </div>
          <aside class="formula-slip">
            <span class="formula-slip-label">Wynik</span>
            <div class="score-preview"><strong id="quiz-best">—</strong><span>najlepszy wynik</span></div>
            <p>Możesz powtarzać test dowolną liczbę razy.</p>
          </aside>
        </div>

        <form id="quiz-form" class="quiz-form" novalidate>
          <div class="quiz-progress-bar"><span id="quiz-progress-fill"></span></div>
          <p class="quiz-progress-text" id="quiz-progress-text">Odpowiedziano: 0 / ${GUIDE.quiz.length}</p>
          ${GUIDE.quiz.map(function (item, index) {
            return '<article class="quiz-question" data-quiz-id="' + item.id + '" data-correct="' + item.answer + '">' +
              '<div class="quiz-q-head"><span class="quiz-number">' + String(index + 1).padStart(2, "0") + '</span><span class="quiz-category">' + item.cat + "</span></div>" +
              '<p class="quiz-q">' + item.q + "</p>" +
              '<div class="quiz-options">' + item.options.map(function (option, optionIndex) {
                return '<label class="quiz-option"><input type="radio" name="' + item.id + '" value="' + optionIndex + '"><span class="quiz-letter">' + String.fromCharCode(65 + optionIndex) + '</span><span>' + option + "</span></label>";
              }).join("") + "</div>" +
              '<div class="quiz-feedback" aria-live="polite"></div>' +
              "</article>";
          }).join("")}
          <div class="quiz-actions">
            <button type="submit" class="btn btn-primary" id="quiz-submit">Sprawdź wynik</button>
            <button type="button" class="btn btn-ghost" id="quiz-reset">Nowy test</button>
          </div>
        </form>

        <section class="quiz-result-panel" id="quiz-result" hidden>
          <div class="score-ring" id="score-ring"><div><strong id="quiz-score">0</strong><span>/ ${GUIDE.quiz.length}</span></div></div>
          <div class="quiz-result-copy">
            <p class="eyebrow">Wynik testu</p>
            <h2 id="quiz-verdict">—</h2>
            <p id="quiz-summary">—</p>
            <button type="button" class="btn btn-ghost" id="quiz-review">Pokaż wyjaśnienia</button>
          </div>
        </section>

        ${callout("tip", "Jak wykorzystać test", "Nie chodzi o zapamiętanie liter. Po każdym błędzie wróć do modułu, którego dotyczy pytanie, i spróbuj wyjaśnić odpowiedź własnymi słowami. Dopiero wtedy oznacz moduł jako opanowany.")}
      `;
    }
  });

  /* ============================================================
     13 — ŚCIĄGAWKA I ZAKRES
     ============================================================ */
  GUIDE.scope = [
    {
      title: "Potencjał chemiczny, aktywność i współczynnik aktywności",
      page: "potential",
      points: [
        "definicja potencjału chemicznego i jego interpretacja,",
        "aktywność a stężenie, sens współczynnika aktywności γ,",
        "równość potencjałów chemicznych jako warunek równowagi fazowej."
      ]
    },
    {
      title: "Prawo podziału Nernsta",
      page: "nernst",
      points: [
        "sformułowanie prawa i definicja współczynnika podziału K,",
        "warunki stosowalności: stała T, roztwory rozcieńczone, brak dysocjacji i asocjacji,",
        "odróżnienie K od współczynnika dystrybucji D oraz logP."
      ]
    },
    {
      title: "Równowaga dysocjacji i asocjacji",
      page: "equilibria",
      points: [
        "stopień dysocjacji α i stała dysocjacji Kₐ,",
        "pełne prawo rozcieńczeń Ostwalda i jego rozwiązanie,",
        "stała asocjacji, dimeryzacja kwasu benzoesowego, poprawka √cₜ."
      ]
    },
    {
      title: "Ekstrakcja jednostopniowa i wielostopniowa",
      page: "extraction",
      points: [
        "bilans masy i wzór na ułamek pozostający w fazie wodnej,",
        "wydajność ekstrakcji i porównanie jednej porcji z wieloma,",
        "praktyczne zastosowania w farmacji, analizie i ochronie środowiska."
      ]
    },
    {
      title: "Współczynnik podziału a aktywność biologiczna",
      page: "bioactivity",
      points: [
        "lipofilowość, logP i jego znaczenie dla przenikania przez błony,",
        "wpływ pH i jonizacji na współczynnik dystrybucji D,",
        "konsekwencje dla wchłaniania, dystrybucji i kumulacji leków."
      ]
    },
    {
      title: "Opracowanie wyników i rachunek błędów",
      page: "errors",
      points: [
        "błąd bezwzględny, względny i procentowy,",
        "niepewność typu A i B, niepewność całkowita, współczynnik Studenta,",
        "poprawny zapis wyniku i przenoszenie niepewności."
      ]
    },
    {
      title: "Metoda graficzna i sprawozdanie",
      page: "report",
      points: [
        "zasady sporządzania wykresów i dopasowania prostej,",
        "struktura sprawozdania i bezosobowy styl opisu,",
        "opis tabel, wykresów, dyskusja błędów i wnioski."
      ]
    }
  ];

  page({
    id: "cheatsheet",
    num: "13",
    group: "Utrwalenie",
    title: "Ściągawka i zakres wymaganych wiadomości",
    short: "Ściągawka",
    eyebrow: "Moduł 13 · Wszystko w jednym miejscu",
    lead: "Najważniejsze wzory, definicje i lista wymagań z sekcji „Zakres wymaganych wiadomości”. Dobry materiał do powtórki przed zajęciami i przed sprawozdaniem.",
    body: function () {
      return `
        <div class="cheatsheet-toolbar">
          <p>Wydrukuj ściągawkę lub wróć do konkretnego modułu, klikając jego nazwę.</p>
          <button type="button" class="btn btn-small btn-ghost" id="cheatsheet-print">Drukuj ściągawkę</button>
        </div>

        <section class="card">
          <h2>Zakres wymaganych wiadomości — lista kontrolna</h2>
          <p>Punkty wprost ze skryptu, rozszerzone o to, co trzeba umieć, żeby wykonać ćwiczenie i napisać sprawozdanie.</p>
          <div class="scope-list">
            ${GUIDE.scope.map(function (item, index) {
              return '<div class="scope-item">' +
                '<div class="scope-head"><span class="scope-num">' + String(index + 1).padStart(2, "0") + '</span><div><h3>' + item.title + '</h3><ul class="plain-list">' + item.points.map(function (point) { return "<li>" + point + "</li>"; }).join("") + "</ul></div></div>" +
                '<a class="text-link" href="#' + item.page + '" data-page-link="' + item.page + '">Powtórz w module <span aria-hidden="true">→</span></a>' +
                "</div>";
            }).join("")}
          </div>
        </section>

        <section class="cheat-grid">
          <article class="cheat-card">
            <h2>Termodynamika</h2>
            <div class="equation compact"><span class="math">μ<sub>i</sub> = μ<sub>i</sub><sup>°</sup> + RT ln a<sub>i</sub></span></div>
            <div class="equation compact"><span class="math">a<sub>i</sub> = γ<sub>i</sub> c<sub>i</sub>/c°</span></div>
            <div class="equation compact"><span class="math">γ<sub>i</sub> → 1 gdy c<sub>i</sub> → 0</span></div>
            <p>Równowaga: <span class="math">μ<sub>1</sub> = μ<sub>2</sub></span>, a dla rozcieńczonych roztworów <span class="math">c<sub>1</sub>/c<sub>2</sub> = K</span>.</p>
          </article>
          <article class="cheat-card">
            <h2>Prawo podziału</h2>
            <div class="equation compact"><span class="math">K = c<sub>1</sub>/c<sub>2</sub></span></div>
            <div class="equation compact"><span class="math">D = c<sub>org,całk</sub>/c<sub>aq,całk</sub></span></div>
            <div class="equation compact"><span class="math">logP = log<sub>10</sub>(c<sub>oktanol</sub>/c<sub>woda</sub>)</span></div>
            <div class="equation compact"><span class="math">logD = log<sub>10</sub>D(pH)</span></div>
            <p>K dotyczy jednej formy; D — wszystkich form. D zależy od pH.</p>
          </article>
          <article class="cheat-card">
            <h2>Dysocjacja</h2>
            <div class="equation compact"><span class="math">K<sub>a</sub> = c<sub>0</sub>α<sup>2</sup>/(1 − α)</span></div>
            <div class="equation compact"><span class="math">α = [−K<sub>a</sub> + √(K<sub>a</sub><sup>2</sup> + 4K<sub>a</sub>c<sub>0</sub>)]/(2c<sub>0</sub>)</span></div>
            <div class="equation compact"><span class="math">α ≈ √(K<sub>a</sub>/c<sub>0</sub>)</span></div>
            <p>Przybliżenie stosuj tylko dla małych α; w ćwiczeniu wymagana jest postać zupełna.</p>
          </article>
          <article class="cheat-card">
            <h2>Wzór roboczy</h2>
            <div class="equation compact"><span class="math">K<sub>1</sub> = c<sub>t</sub>/c<sub>w</sub></span></div>
            <div class="equation compact"><span class="math">K<sub>2</sub> = √c<sub>t</sub>/[c<sub>w</sub>(1 − α)]</span></div>
            <p>Licznik — monomer w toluenie; mianownik — forma niezdysocjowana w wodzie. Przy silnej dimeryzacji <span class="math">K<sub>2</sub> = √(2K<sub>as</sub>)·K<sub>monomer</sub></span>; wynik ma wymiar <span class="math">(mol·dm⁻³)<sup>−1/2</sup></span> i nie jest czystym K monomeru.</p>
          </article>
          <article class="cheat-card">
            <h2>Ekstrakcja</h2>
            <div class="equation compact"><span class="math">q = V<sub>aq</sub>/(V<sub>aq</sub> + K V<sub>org</sub>)</span></div>
            <div class="equation compact"><span class="math">m<sub>n</sub> = m<sub>0</sub> q<sup>n</sup></span></div>
            <div class="equation compact"><span class="math">E = 1 − q<sup>n</sup></span></div>
            <p>Kilka mniejszych porcji jest skuteczniejsze od jednej dużej.</p>
          </article>
          <article class="cheat-card">
            <h2>Błędy i niepewności</h2>
            <div class="equation compact"><span class="math">Δx = |x − X<sub>t</sub>|</span></div>
            <div class="equation compact"><span class="math">δx = Δx/|X<sub>t</sub>| · 100 %</span></div>
            <div class="equation compact"><span class="math">u<sub>A</sub> = t · s/√n</span></div>
            <div class="equation compact"><span class="math">u<sub>B</sub> = ΔX/√3</span></div>
            <div class="equation compact"><span class="math">u<sub>c</sub> = √(u<sub>A</sub><sup>2</sup> + u<sub>B</sub><sup>2</sup>)</span></div>
            <p>Wynik: <span class="math">x ± u(x)</span>, niepewność zwykle do dwóch cyfr znaczących.</p>
          </article>
          <article class="cheat-card">
            <h2>Prosta i regresja</h2>
            <div class="equation compact"><span class="math">y = A x + B</span></div>
            <div class="equation compact"><span class="math">A = Σ(x<sub>i</sub> − x̄)(y<sub>i</sub> − ȳ) / Σ(x<sub>i</sub> − x̄)<sup>2</sup></span></div>
            <div class="equation compact"><span class="math">B = ȳ − A x̄</span></div>
            <p>Nie łącz punktów linią łamaną. Opisz osie, jednostki i podaj numer wykresu.</p>
          </article>
          <article class="cheat-card">
            <h2>Sprawozdanie</h2>
            <ul class="plain-list">
              <li>strona tytułowa, teoria, cel,</li>
              <li>karta wyników, wykonanie, obliczenia,</li>
              <li>tabele i wykresy z numeracją,</li>
              <li>dyskusja błędów, wnioski, źródła.</li>
            </ul>
            <p>Styl bezosobowy w czasie przeszłym: „odważono”, „miareczkowano”, „obliczono”.</p>
          </article>
        </section>

        <section class="card">
          <h2>Pojęcia, które trzeba umieć zdefiniować</h2>
          <div class="definition-list">
            <p><strong>Potencjał chemiczny</strong> — zmiana energii Gibbsa układu przy dodaniu 1 mola składnika, przy stałych T, p i liczbie moli pozostałych składników.</p>
            <p><strong>Aktywność</strong> — bezwymiarowa „efektywna” miara stężenia, uwzględniająca oddziaływania; <span class="math">a = γc/c°</span>.</p>
            <p><strong>Współczynnik podziału Nernsta</strong> — stały w danej temperaturze stosunek stężeń (aktywności) jednej formy substancji w dwóch fazach.</p>
            <p><strong>Współczynnik dystrybucji D</strong> — stosunek całkowitych stężeń analitycznych, uwzględniający wszystkie formy; zależy od pH.</p>
            <p><strong>Stopień dysocjacji α</strong> — ułamek cząsteczek kwasu, które uległy dysocjacji.</p>
            <p><strong>Stała asocjacji</strong> — stała równowagi tworzenia asocjatów, np. dimerów.</p>
            <p><strong>Ekstrakcja wielostopniowa</strong> — wielokrotne wytrząsanie roztworu z kolejnymi porcjami rozpuszczalnika.</p>
            <p><strong>Niepewność standardowa</strong> — miara niedokładności wyniku; typ A z rozrzutu, typ B z oceny przyrządu i procedury.</p>
          </div>
        </section>

        <section class="card">
          <h2>Źródła i opracowanie</h2>
          <p>Materiał opracowano na podstawie skryptu <em>Chemia fizyczna — ćwiczenia laboratoryjne. Skrypt dla studentów farmacji, analityki medycznej, biotechnologii i chemii kosmetycznej</em>:</p>
          <ol class="reference-list">
            <li>rozdz. 3 „Współczynnik podziału substancji” — cel, zakres wymaganych wiadomości, zagadnienia wprowadzające, część doświadczalna, opracowanie wyników;</li>
            <li>rozdz. 14–15 — strona tytułowa i wzór sprawozdania;</li>
            <li>rozdz. 16 — rachunek błędów, niepewność pomiaru, zapis wyników i opracowanie graficzne.</li>
          </ol>
          <p class="small-note">Wybrane rozwinięcia (np. logP, propagacja niepewności, D od pH) mają charakter uzupełniający i są oznaczone jako rozszerzenie. Pełny zakres wymagań znajduje się także w pliku <a href="../ZAKRES_WIADOMOSCI.md" download>ZAKRES_WIADOMOSCI.md</a>.</p>
        </section>
      `;
    }
  });

  global.GUIDE = GUIDE;
})(window);
