/* ============================================================
   Treść przewodnika — część 2: laboratorium i opracowanie
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

  const apparatus = [
    ["Waga laboratoryjska", "pomiar masy naważek", "1"],
    ["Papierek wagowy", "przenoszenie naważki", "—"],
    ["Rozdzielacz", "rozdział faz", "2"],
    ["Kolba stożkowa", "miareczkowanie", "4"],
    ["Pipeta miarowa 10 cm³", "pobór fazy wodnej", "2"],
    ["Biureta 10 cm³", "miareczkowanie", "1"],
    ["Lejek", "przelewanie", "3"],
    ["Butelka z korkiem", "wytrząsanie", "2"],
    ["Wytrząsarka", "równoważenie", "1"],
    ["Cylinder 25 cm³", "odmierzanie toluenu", "1"],
    ["Cylinder 50 cm³", "odmierzanie wody", "1"],
    ["Zlewka 50, 100, 150 cm³", "pomocnicze", "4"]
  ];

  const reagents = [
    ["Kwas benzoesowy", "substancja badana", "drażniący; unikać pyłu i kontaktu z oczami", "neutralizować zgodnie z zaleceniami prowadzącego"],
    ["Toluen", "faza organiczna", "łatwopalny, szkodliwy, działa odurzająco; może działać szkodliwie na rozrodczość", "zbiornik „zlewki organiczne” pod dygestorium"],
    ["Woda destylowana", "faza wodna", "—", "kanalizacja"],
    ["0,01 M NaOH", "roztwór miareczkujący", "żrący; chronić oczy i skórę", "neutralizować i usuwać zgodnie z instrukcją"],
    ["Fenoloftaleina", "wskaźnik", "roztwór alkoholowy; łatwopalny, drażniący", "odpady chemiczne"]
  ];

  /* ============================================================
     07 — LABORATORIUM
     ============================================================ */
  page({
    id: "lab",
    num: "07",
    group: "Laboratorium",
    title: "Wykonanie ćwiczenia krok po kroku",
    short: "Wykonanie ćwiczenia",
    eyebrow: "Moduł 07 · Protokół laboratoryjny",
    lead: "Poznaj sprzęt, odczynniki i każdy etap pracy — wraz z uzasadnieniem, dlaczego dany krok ma znaczenie. Wpisz wyniki miareczkowania do karty, a później przenieś je do arkusza obliczeń.",
    body: function () {
      return `
        <div class="module-intro">
          <div>
            <p class="eyebrow">Cele modułu</p>
            ${goalList([
              "przygotować stanowisko i bezpiecznie posługiwać się toluenem oraz NaOH,",
              "wykonać rozdział kwasu benzoesowego między wodę i toluen,",
              "wykonać miareczkowanie fazy wodnej i zapisać wyniki w karcie."
            ])}
          </div>
          <aside class="formula-slip safety-slip">
            <span class="formula-slip-label">Zasada nr 1</span>
            <div class="safety-mark">!</div>
            <p>Toluen jest łatwopalny i szkodliwy. Pracuj pod wyciągiem, z dala od źródeł zapłonu, w okularach ochronnych.</p>
          </aside>
        </div>

        ${callout("warning", "Bezpieczeństwo przede wszystkim", "Zapoznaj się z kartami charakterystyki substancji (SDS) i instrukcją prowadzącego. Nie pipetuj ustami. Nie wylewaj toluenu do zlewu. W razie kontaktu z oczami natychmiast płucz dużą ilością wody i zgłoś się do prowadzącego.")}

        <section class="card">
          <h2>Aparatura i szkło</h2>
          <div class="apparatus-grid">
            ${apparatus.map(function (item) {
              return '<div class="apparatus"><span class="apparatus-qty">' + item[2] + '</span><div><strong>' + item[0] + '</strong><small>' + item[1] + '</small></div></div>';
            }).join("")}
          </div>
        </section>

        <section class="card">
          <h2>Odczynniki</h2>
          <div class="table-wrap">
            <table class="data-table reagent-table">
              <thead><tr><th>Odczynnik</th><th>Rola</th><th>Zagrożenia</th><th>Utylizacja</th></tr></thead>
              <tbody>
                ${reagents.map(function (r) {
                  return "<tr><td><strong>" + r[0] + "</strong></td><td>" + r[1] + "</td><td>" + r[2] + "</td><td>" + r[3] + "</td></tr>";
                }).join("")}
              </tbody>
            </table>
          </div>
        </section>

        <section class="card procedure-card">
          <div class="section-heading inline-heading">
            <div>
              <h2>Protokół wykonania</h2>
              <p>Odhaczaj kolejne kroki. Postęp zapisuje się w przeglądarce.</p>
            </div>
            <span class="step-counter" id="lab-progress-label">0 / 7</span>
          </div>
          <div class="procedure-progress"><span id="lab-progress-bar"></span></div>

          <div class="procedure-step" data-lab-step="1">
            <label class="step-check"><input type="checkbox" id="lab-step-1"><span></span></label>
            <div class="step-content">
              <div class="step-top"><span class="step-num">01</span><h3>Odważenie naważek</h3></div>
              <p>Odważono dwie naważki kwasu benzoesowego o masie około <strong>0,10 g</strong> i <strong>0,03 g</strong>. Masę każdej naważki zanotowano.</p>
              <div class="step-why"><strong>Dlaczego?</strong> Różne stężenia początkowe pozwalają sprawdzić, czy wyznaczony współczynnik podziału jest stały — zgodnie z prawem Nernsta.</div>
              <div class="mini-input-row">
                <label class="field compact-field"><span class="field-label">Rzeczywista masa naważki A <small>[g]</small></span><input class="input" type="number" id="lab-mass-a" step="0.0001" min="0.001" value="0.0300"></label>
                <label class="field compact-field"><span class="field-label">Rzeczywista masa naważki B <small>[g]</small></span><input class="input" type="number" id="lab-mass-b" step="0.0001" min="0.001" value="0.1000"></label>
              </div>
            </div>
          </div>

          <div class="procedure-step" data-lab-step="2">
            <label class="step-check"><input type="checkbox" id="lab-step-2"><span></span></label>
            <div class="step-content">
              <div class="step-top"><span class="step-num">02</span><h3>Rozpuszczenie w toluenie</h3></div>
              <p>Każdą naważkę przeniesiono ilościowo do butelki z doszlifowanym korkiem, zawierającej <strong>25 cm³ toluenu</strong>, i rozpuszczono przez wymieszanie.</p>
              <div class="step-why"><strong>Dlaczego butelka z korkiem?</strong> Toluen jest lotny. Zamknięcie naczynia ogranicza parowanie, zmianę objętości i narażenie na pary.</div>
            </div>
          </div>

          <div class="procedure-step" data-lab-step="3">
            <label class="step-check"><input type="checkbox" id="lab-step-3"><span></span></label>
            <div class="step-content">
              <div class="step-top"><span class="step-num">03</span><h3>Dodanie wody i wytrząsanie</h3></div>
              <p>Do każdej butelki dodano <strong>35 cm³ wody destylowanej</strong>, a następnie wytrząsano zawartość przez około <strong>15 minut</strong>.</p>
              <div class="step-why"><strong>Dlaczego 15 minut?</strong> Potrzebny jest czas na przetransportowanie substancji przez granicę faz i osiągnięcie równowagi. Zbyt krótkie wytrząsanie daje wynik zależny od czasu, a nie od stałej K.</div>
            </div>
          </div>

          <div class="procedure-step" data-lab-step="4">
            <label class="step-check"><input type="checkbox" id="lab-step-4"><span></span></label>
            <div class="step-content">
              <div class="step-top"><span class="step-num">04</span><h3>Rozdział faz</h3></div>
              <p>Mieszaniny przeniesiono do rozdzielaczy i pozostawiono na <strong>1 godzinę</strong> do całkowitego rozwarstwienia.</p>
              <div class="step-why"><strong>Dlaczego czekamy?</strong> Potrzebne są czyste, dobrze odseparowane fazy. Resztki emulsji zafałszowałyby objętość i stężenie próbki wodnej.</div>
            </div>
          </div>

          <div class="procedure-step" data-lab-step="5">
            <label class="step-check"><input type="checkbox" id="lab-step-5"><span></span></label>
            <div class="step-content">
              <div class="step-top"><span class="step-num">05</span><h3>Spuszczenie fazy wodnej</h3></div>
              <p>Z rozdzielacza usunięto korek i spuszczono <strong>jedynie dobrze odwarstwioną fazę wodną</strong>. Warstwa toluenowa pozostała w zamkniętym rozdzielaczu.</p>
              <div class="step-why"><strong>Dlaczego wyjmujemy korek?</strong> Bez odpowietrzenia w rozdzielaczu powstaje podciśnienie i ciecz nie wypływa równym strumieniem. To także zwiększa ryzyko zassania fazy organicznej.</div>
            </div>
          </div>

          <div class="procedure-step" data-lab-step="6">
            <label class="step-check"><input type="checkbox" id="lab-step-6"><span></span></label>
            <div class="step-content">
              <div class="step-top"><span class="step-num">06</span><h3>Miareczkowanie fazy wodnej</h3></div>
              <p>Pobrano po <strong>10 cm³</strong> fazy wodnej, dodano <strong>2–3 krople fenoloftaleiny</strong> i miareczkowano <strong>0,01 M NaOH</strong> do trwałego bladoróżowego zabarwienia. Miareczkowanie powtórzono.</p>
              <div class="step-why"><strong>Dlaczego zawsze taka sama ilość wskaźnika?</strong> Wskaźnik sam jest słabym kwasem i może zużywać niewielką ilość titranta. Stała ilość w każdej próbce zapewnia porównywalność wyników.</div>
              <div class="titration-card">
                <div class="titration-head"><strong>Karta wyników — objętości NaOH</strong><span>0,01 M NaOH</span></div>
                <div class="titration-grid">
                  <div class="titration-sample">
                    <span class="sample-tag">A · ok. 0,03 g</span>
                    <label class="field compact-field"><span class="field-label">V₁ [cm³]</span><input class="input" type="number" id="lab-v1a" step="0.01" min="0" placeholder="np. 0,79"></label>
                    <label class="field compact-field"><span class="field-label">V₂ [cm³]</span><input class="input" type="number" id="lab-v2a" step="0.01" min="0" placeholder="np. 0,81"></label>
                    <div class="mean-readout"><span>Średnia</span><strong id="lab-mean-a">—</strong></div>
                  </div>
                  <div class="titration-sample">
                    <span class="sample-tag">B · ok. 0,10 g</span>
                    <label class="field compact-field"><span class="field-label">V₁ [cm³]</span><input class="input" type="number" id="lab-v1b" step="0.01" min="0" placeholder="np. 1,39"></label>
                    <label class="field compact-field"><span class="field-label">V₂ [cm³]</span><input class="input" type="number" id="lab-v2b" step="0.01" min="0" placeholder="np. 1,41"></label>
                    <div class="mean-readout"><span>Średnia</span><strong id="lab-mean-b">—</strong></div>
                  </div>
                </div>
                <p class="small-note">Wpisz objętości z dokładnością do 0,01 cm³. Średnia jest liczona automatycznie i może zostać przeniesiona do arkusza obliczeń.</p>
              </div>
            </div>
          </div>

          <div class="procedure-step" data-lab-step="7">
            <label class="step-check"><input type="checkbox" id="lab-step-7"><span></span></label>
            <div class="step-content">
              <div class="step-top"><span class="step-num">07</span><h3>Utylizacja fazy organicznej</h3></div>
              <p>Fazę toluenową zlano do zlewki i wylano do pojemnika oznaczonego <strong>„zlewki organiczne”</strong> pod dygestorium.</p>
              <div class="step-why"><strong>Dlaczego nie do zlewu?</strong> Toluen jest szkodliwy dla środowiska i łatwopalny. Odpady organiczne muszą być zbierane selektywnie.</div>
            </div>
          </div>
        </section>

        <section class="card">
          <h2>Karta obserwacji</h2>
          <p>Zanotuj warunki i spostrzeżenia. Te informacje przydadzą się w dyskusji wyników.</p>
          <div class="observation-grid">
            <label class="field"><span class="field-label">Temperatura w laboratorium <small>[°C]</small></span><input class="input" id="lab-temp" type="number" step="0.1" placeholder="np. 22,5"></label>
            <label class="field"><span class="field-label">Wygląd fazy wodnej</span><input class="input" id="lab-appearance" type="text" placeholder="np. klarowna, bez emulsji"></label>
            <label class="field wide"><span class="field-label">Inne obserwacje</span><textarea class="input textarea" id="lab-notes" rows="3" placeholder="np. trudności z rozwarstwieniem, zabarwienie, objętość rzeczywista"></textarea></label>
          </div>
        </section>

        <section class="card">
          <h2>Co może pójść nie tak?</h2>
          <div class="accordion" data-accordion>
            <details>
              <summary>Powstała emulsja i fazy nie chcą się rozdzielić</summary>
              <p>Można delikatnie zakręcić rozdzielaczem, dodać kilka cm³ wody destylowanej, odczekać dłużej lub użyć delikatnego wirowania. Nie należy sączyć mętnej fazy — zafałszuje to wynik.</p>
            </details>
            <details>
              <summary>Koniec miareczkowania jest nieostry</summary>
              <p>Fenoloftaleina daje bladoróżowe zabarwienie. Odczytaj objętość, przy której barwa utrzymuje się co najmniej 30 sekund. Zbyt dużo wskaźnika utrudnia dostrzeżenie punktu końcowego.</p>
            </details>
            <details>
              <summary>Zużyto więcej NaOH, niż wynika z naważki</summary>
              <p>Możliwe przyczyny: zanieczyszczenie szkła, obecność innych kwasów, błąd pipetowania, przeciek z biurety lub zbyt daleko posunięte miareczkowanie. Sprawdź, czy masa fazy wodnej nie jest większa niż naważka — w arkuszu pojawi się ostrzeżenie.</p>
            </details>
            <details>
              <summary>Warstwa toluenowa częściowo odparowała</summary>
              <p>To zmienia objętość fazy organicznej i bilans masy. Pracuj w zamkniętych naczyniach, nie zostawiaj otwartego rozdzielacza i notuj objętości rzeczywiste, jeśli odbiegają od założonych.</p>
            </details>
          </div>
        </section>

        ${check("lab-1", "Dlaczego przed spuszczeniem cieczy z rozdzielacza należy wyjąć korek?", [
          "Aby toluen parował szybciej",
          "Aby wyrównać ciśnienie i umożliwić równy wypływ cieczy",
          "Aby zwiększyć stężenie kwasu w fazie wodnej",
          "Aby wskaźnik zmienił barwę"
        ], "b", "Zamknięty rozdzielacz działa jak naczynie pod obniżonym ciśnieniem podczas wypływu. Wyjęcie korka wyrównuje ciśnienie i pozwala kontrolować strumień.")}

        ${check("lab-2", "Dlaczego do każdej próbki dodaje się taką samą ilość fenoloftaleiny?", [
          "Aby wszystkie próbki miały identyczny wygląd",
          "Aby zniwelować wpływ wskaźnika na objętość titranta i porównywalność wyników",
          "Ponieważ fenoloftaleina jest katalizatorem reakcji",
          "Aby zmniejszyć stężenie NaOH"
        ], "b", "Wskaźnik jest dodatkiem, który może zużywać titrant. Stała ilość w każdej próbce sprawia, że jego wpływ jest powtarzalny i można go pominąć w porównaniu.")}
      `;
    }
  });

  /* ============================================================
     08 — OBLICZENIA
     ============================================================ */
  page({
    id: "calculations",
    num: "08",
    group: "Laboratorium",
    title: "Obliczenia krok po kroku",
    short: "Obliczenia",
    eyebrow: "Moduł 08 · Arkusz obliczeń",
    lead: "Wpisz masy naważek i średnie objętości NaOH. Arkusz przeprowadzi Cię przez stężenia, bilans masy, stopień dysocjacji i oba współczynniki podziału — z podstawionymi liczbami.",
    body: function () {
      return `
        <div class="module-intro">
          <div>
            <p class="eyebrow">Cele modułu</p>
            ${goalList([
              "przeliczyć wynik miareczkowania na stężenie kwasu w fazie wodnej,",
              "domknąć bilans masy między fazami,",
              "obliczyć α i oba współczynniki podziału oraz porównać naważki."
            ])}
          </div>
          <aside class="formula-slip">
            <span class="formula-slip-label">Łańcuch obliczeń</span>
            <p class="chain">V<sub>NaOH</sub> → n<sub>NaOH</sub> → c<sub>w</sub><br>→ m<sub>w</sub> → m<sub>t</sub> → c<sub>t</sub> → α → K</p>
          </aside>
        </div>

        <section class="card">
          <div class="section-heading inline-heading">
            <div>
              <h2>Dane wejściowe</h2>
              <p id="calc-data-note">Domyślnie wpisano <strong>dane przykładowe</strong> (wyidealizowane; nie są wynikami rzeczywistego pomiaru). Zamień je na własne wyniki z karty.</p>
            </div>
            <span class="example-badge" id="calc-data-badge">dane przykładowe</span>
          </div>
          <div class="input-grid">
            <label class="field"><span class="field-label">Masa naważki A <small>[g]</small></span><input class="input" id="calc-mass-a" type="number" step="0.0001" min="0.0001" value="0.0300"></label>
            <label class="field"><span class="field-label">Masa naważki B <small>[g]</small></span><input class="input" id="calc-mass-b" type="number" step="0.0001" min="0.0001" value="0.1000"></label>
            <label class="field"><span class="field-label">Średnia V<sub>NaOH</sub> — A <small>[cm³]</small></span><input class="input" id="calc-v-a" type="number" step="0.01" min="0" value="0.80"></label>
            <label class="field"><span class="field-label">Średnia V<sub>NaOH</sub> — B <small>[cm³]</small></span><input class="input" id="calc-v-b" type="number" step="0.01" min="0" value="1.40"></label>
            <label class="field"><span class="field-label">Stężenie NaOH <small>[mol·dm⁻³]</small></span><input class="input" id="calc-cnaoh" type="number" step="0.0001" min="0" value="0.0100"></label>
            <label class="field"><span class="field-label">Objętość fazy wodnej <small>[cm³]</small></span><input class="input" id="calc-vwater" type="number" step="0.1" min="0" value="35.0"></label>
            <label class="field"><span class="field-label">Objętość fazy toluenowej <small>[cm³]</small></span><input class="input" id="calc-vtol" type="number" step="0.1" min="0" value="25.0"></label>
            <label class="field"><span class="field-label">Objętość próbki do miareczkowania <small>[cm³]</small></span><input class="input" id="calc-valiquot" type="number" step="0.1" min="0" value="10.0"></label>
            <label class="field"><span class="field-label">Masa molowa kwasu <small>[g·mol⁻¹]</small></span><input class="input" id="calc-molar" type="number" step="0.01" min="0" value="122.12"></label>
            <label class="field"><span class="field-label">Stała dysocjacji K<sub>a</sub></span><input class="input" id="calc-ka" type="number" step="0.0000001" min="0" value="0.0000646"></label>
          </div>
          <div class="button-row">
            <button type="button" class="btn btn-primary" id="calc-run">Przelicz</button>
            <button type="button" class="btn btn-ghost" id="calc-load-lab">Wczytaj dane z karty</button>
            <button type="button" class="btn btn-quiet" id="calc-reset">Przywróć przykład</button>
            <button type="button" class="btn btn-quiet" id="calc-clear">Wyczyść</button>
          </div>
          <div class="alert-box" id="calc-warning" hidden></div>
          <p class="small-note">Wzory i jednostki: stężenie molowe = mol·dm⁻³; 1 cm³ = 0,001 dm³; masa molowa kwasu benzoesowego ≈ 122,12 g·mol⁻¹.</p>
        </section>

        <section class="calc-step-card">
          <div class="calc-step-head"><span class="calc-step-num">1</span><div><h2>Od miareczkowania do masy w fazie wodnej</h2><p>Reakcja kwasu benzoesowego z NaOH zachodzi w stosunku 1:1.</p></div></div>
          <div class="equation-block">
            ${CF.eq('<span class="math">n<sub>NaOH</sub> = c<sub>NaOH</sub> · V<sub>NaOH</sub></span>')}
            ${CF.eq('<span class="math">c<sub>w</sub> = ' + CF.frac('<span class="math">n<sub>NaOH</sub></span>', '<span class="math">V<sub>próbki</sub></span>') + '</span>')}
            ${CF.eq('<span class="math">m<sub>w</sub> = c<sub>w</sub> · V<sub>w</sub> · M</span>')}
          </div>
          <div class="table-wrap">
            <table class="data-table calc-table">
              <thead><tr><th>Naważka</th><th>V<sub>NaOH</sub> [cm³]</th><th>n<sub>NaOH</sub> [mmol]</th><th>c<sub>w</sub> [mol·dm⁻³]</th><th>m<sub>w</sub> [g]</th></tr></thead>
              <tbody id="tbody-step1"><tr><td colspan="5" class="empty-cell">Wpisz dane i kliknij „Przelicz”.</td></tr></tbody>
            </table>
          </div>
          <div class="calc-work" id="calc-work-1">—</div>
        </section>

        <section class="calc-step-card">
          <div class="calc-step-head"><span class="calc-step-num">2</span><div><h2>Bilans masy i stężenie w toluenie</h2><p>Masa w fazie organicznej to różnica między naważką a masą oznaczoną w wodzie.</p></div></div>
          <div class="equation-block">
            ${CF.eq('<span class="math">m<sub>t</sub> = m<sub>naważki</sub> − m<sub>w</sub></span>')}
            ${CF.eq('<span class="math">c<sub>t</sub> = ' + CF.frac('<span class="math">m<sub>t</sub></span>', '<span class="math">V<sub>t</sub> · M</span>') + '</span>')}
          </div>
          <div class="table-wrap">
            <table class="data-table calc-table">
              <thead><tr><th>Naważka</th><th>m<sub>naważki</sub> [g]</th><th>m<sub>w</sub> [g]</th><th>m<sub>t</sub> [g]</th><th>c<sub>t</sub> [mol·dm⁻³]</th></tr></thead>
              <tbody id="tbody-step2"><tr><td colspan="5" class="empty-cell">—</td></tr></tbody>
            </table>
          </div>
          <div class="calc-work" id="calc-work-2">—</div>
        </section>

        <section class="calc-step-card">
          <div class="calc-step-head"><span class="calc-step-num">3</span><div><h2>Stopień dysocjacji w fazie wodnej</h2><p>Rozwiązujemy pełne prawo rozcieńczeń Ostwalda, a przybliżenie traktujemy tylko jako kontrolę.</p></div></div>
          <div class="equation-block">
            ${CF.eq('<span class="math">K<sub>a</sub> = ' + CF.frac('<span class="math">c<sub>w</sub> α<sup>2</sup></span>', '<span class="math">1 − α</span>') + '</span>')}
            ${CF.eq('<span class="math">α = ' + CF.frac('<span class="math">−K<sub>a</sub> + √(K<sub>a</sub><sup>2</sup> + 4K<sub>a</sub>c<sub>w</sub>)</span>', '<span class="math">2c<sub>w</sub></span>') + '</span>')}
          </div>
          <div class="table-wrap">
            <table class="data-table calc-table">
              <thead><tr><th>Naważka</th><th>c<sub>w</sub> [mol·dm⁻³]</th><th>α (ścisły)</th><th>α ≈ √(K<sub>a</sub>/c<sub>w</sub>)</th><th>[H⁺] [mol·dm⁻³]</th><th>pH</th></tr></thead>
              <tbody id="tbody-step3"><tr><td colspan="6" class="empty-cell">—</td></tr></tbody>
            </table>
          </div>
          <div class="calc-work" id="calc-work-3">—</div>
        </section>

        <section class="calc-step-card">
          <div class="calc-step-head"><span class="calc-step-num">4</span><div><h2>Współczynnik podziału</h2><p>Najpierw wzór prosty, potem wersja z poprawkami. Oba wyniki odnosimy do tej samej pary stężeń.</p></div></div>
          <div class="equation-block">
            ${CF.eq('<span class="math">K<sub>1</sub> = ' + CF.frac('<span class="math">c<sub>t</sub></span>', '<span class="math">c<sub>w</sub></span>') + '</span>', "(1)")}
            ${CF.eq('<span class="math">K<sub>2</sub> = ' + CF.frac('<span class="math">√c<sub>t</sub></span>', '<span class="math">c<sub>w</sub>(1 − α)</span>') + '</span>', "(2)")}
          </div>
          <div class="table-wrap">
            <table class="data-table calc-table">
              <thead><tr><th>Naważka</th><th>c<sub>t</sub> [mol·dm⁻³]</th><th>c<sub>w</sub> [mol·dm⁻³]</th><th>K<sub>1</sub> = c<sub>t</sub>/c<sub>w</sub></th><th>K<sub>2</sub> (skrypt)</th></tr></thead>
              <tbody id="tbody-step4"><tr><td colspan="5" class="empty-cell">—</td></tr></tbody>
            </table>
          </div>
          <div class="result-row calc-summary">
            <div class="result-tile"><span>K₂ — naważka A</span><strong id="calc-k2-a">—</strong></div>
            <div class="result-tile"><span>K₂ — naważka B</span><strong id="calc-k2-b">—</strong></div>
            <div class="result-tile"><span>Różnica względna K₂</span><strong id="calc-k2-diff">—</strong></div>
            <div class="result-tile"><span>Stosunek K₂(B)/K₂(A)</span><strong id="calc-k2-ratio">—</strong></div>
          </div>
          <details class="decomposition">
            <summary>Pokaż rozbicie poprawek</summary>
            <div class="table-wrap">
              <table class="data-table calc-table">
                <thead><tr><th>Naważka</th><th>K = c<sub>t</sub>/c<sub>w</sub></th><th>+ dysocjacja<br>c<sub>t</sub>/[c<sub>w</sub>(1−α)]</th><th>+ asocjacja<br>√c<sub>t</sub>/c<sub>w</sub></th><th>+ obie poprawki<br>√c<sub>t</sub>/[c<sub>w</sub>(1−α)]</th></tr></thead>
                <tbody id="tbody-decomp"><tr><td colspan="5" class="empty-cell">—</td></tr></tbody>
              </table>
            </div>
            <p class="small-note">To zestawienie pomaga zobaczyć, który efekt silniej zmienia wynik. Nie jest osobnym wymaganiem skryptu.</p>
          </details>
        </section>

        <section class="calc-step-card">
          <div class="calc-step-head"><span class="calc-step-num">5</span><div><h2>Porównanie i interpretacja</h2><p>Sprawdź, czy obie naważki dają zbliżony wynik, i przygotuj materiał do dyskusji.</p></div></div>
          <div class="comparison-card" id="calc-comparison">—</div>
          <div class="prompt-list">
            <h3>Pytania do dyskusji</h3>
            <ol>
              <li>Czy wartości K₂ dla obu naważek są zbliżone? Jeśli nie, jaka może być przyczyna?</li>
              <li>Jak zmienia się α wraz ze stężeniem kwasu w fazie wodnej?</li>
              <li>Która poprawka — dysocjacja czy dimeryzacja — silniej zmienia wynik względem K₁?</li>
              <li>Czy założenie o stałej temperaturze i braku innych równowag jest w Twoim eksperymencie spełnione?</li>
              <li>Jakie błędy systematyczne mogły wpłynąć na wynik: pipetowanie, rozdzielenie faz, wskaźnik, parowanie toluenu?</li>
            </ol>
          </div>
          <div class="button-row">
            <button type="button" class="btn btn-ghost" id="calc-copy">Kopiuj wyniki</button>
            <button type="button" class="btn btn-quiet" id="calc-to-report">Przenieś do sprawozdania</button>
          </div>
        </section>

        ${callout("warning", "Gdy m<sub>t</sub> wychodzi ujemne", "Oznacza to, że obliczona masa kwasu w fazie wodnej przewyższa naważkę. Najczęstsze przyczyny: zbyt duża objętość titranta, błędne stężenie NaOH, zanieczyszczenie kwasem, błąd pipety lub naważki. Nie „poprawiaj” wyniku na siłę — sprawdź dane i opisz problem w dyskusji.")}
      `;
    }
  });

  /* ============================================================
     09 — BŁĘDY I NIEPEWNOŚCI
     ============================================================ */
  page({
    id: "errors",
    num: "09",
    group: "Laboratorium",
    title: "Rachunek błędów i niepewność pomiaru",
    short: "Rachunek błędów",
    eyebrow: "Moduł 09 · Ile wart jest wynik?",
    lead: "Każdy wynik pomiaru jest tylko oszacowaniem. Naucz się odróżniać błąd od niepewności, liczyć niepewność typu A i B oraz podawać wynik z właściwą liczbą cyfr.",
    body: function () {
      const tRows = Object.keys(CF.t95).filter(function (key) { return Number(key) <= 30; }).map(function (key) {
        return "<tr><td>" + key + "</td><td>" + CF.fixed(CF.t95[key], 4) + "</td></tr>";
      }).join("");

      return `
        <div class="module-intro">
          <div>
            <p class="eyebrow">Cele modułu</p>
            ${goalList([
              "rozróżnić błąd bezwzględny, względny i niepewność standardową,",
              "obliczyć niepewność typu A i B oraz niepewność całkowitą,",
              "poprawnie zaokrąglić i zapisać wynik końcowy."
            ])}
          </div>
          <aside class="formula-slip">
            <span class="formula-slip-label">Niepewność całkowita</span>
            ${CF.eq('<span class="math">u<sub>c</sub> = √(u<sub>A</sub><sup>2</sup> + u<sub>B</sub><sup>2</sup>)</span>')}
            <p>Dwa niezależne źródła niepewności sumują się kwadratowo.</p>
          </aside>
        </div>

        <section class="card">
          <h2>Błąd a niepewność</h2>
          <div class="two-col compact-gap">
            <div class="mini-card">
              <h3>Błąd pomiaru</h3>
              <p>Różnica między wynikiem <span class="math">x</span> a wartością tablicową (rzeczywistą) <span class="math">X<sub>t</sub></span>.</p>
              <div class="equation compact"><span class="math">Δx = |x − X<sub>t</sub>|</span></div>
              <div class="equation compact"><span class="math">δx = Δx / |X<sub>t</sub>| · 100 %</span></div>
              <p class="small-note">Błąd bezwzględny ma jednostkę wielkości; błąd względny jest bezwymiarowy.</p>
            </div>
            <div class="mini-card">
              <h3>Niepewność pomiaru</h3>
              <p>Oszacowanie, jak dokładnie znamy wartość mierzoną. Nie wymaga znajomości wartości prawdziwej.</p>
              <p>Może wynikać z rozrzutu wyników, klasy przyrządu, kalibracji, warunków otoczenia i obserwatora.</p>
              <p class="small-note">Wynik podajemy zawsze jako <span class="math">x ± u(x)</span>.</p>
            </div>
          </div>
        </section>

        <section class="card">
          <h2>Niepewność standardowa typu A</h2>
          <p>Dla serii <span class="math">n</span> niezależnych pomiarów najlepszym oszacowaniem wartości jest średnia arytmetyczna:</p>
          <div class="equation-block">
            ${CF.eq('<span class="math">x̄ = ' + CF.frac('<span class="math">x<sub>1</sub> + x<sub>2</sub> + … + x<sub>n</sub></span>', '<span class="math">n</span>') + '</span>', "(4)")}
          </div>
          <p>Odchylenie standardowe średniej opisuje rozrzut średniej, a nie pojedynczego pomiaru:</p>
          <div class="equation-block">
            ${CF.eq('<span class="math">u<sub>A</sub>(x̄) = s<sub>x̄</sub> = ' + CF.sqrt(CF.frac("<span class='math'>Σ(x<sub>i</sub> − x̄)<sup>2</sup></span>", "<span class='math'>n(n − 1)</span>")) + '</span>', "(5)")}
          </div>
          <p>Dla małej liczby pomiarów skrypt zaleca pomnożenie przez współczynnik rozkładu Studenta–Fishera <span class="math">t<sub>n−1,α</sub></span> dla poziomu ufności 0,95:</p>
          <div class="equation-block">
            ${CF.eq('<span class="math">u(x̄) = t<sub>n−1,0,95</sub> · s<sub>x̄</sub></span>', "(6)")}
          </div>
          <div class="two-col compact-gap">
            <div class="table-wrap t-table-wrap">
              <table class="data-table compact-table">
                <thead><tr><th>n − 1</th><th>t (95 %)</th></tr></thead>
                <tbody>${tRows}</tbody>
              </table>
            </div>
            <div class="mini-card worked-example">
              <h3>Przykład ze skryptu</h3>
              <p>Pięć odczytów kąta skręcenia: 36,95°; 36,60°; 36,75°; 36,59°; 36,80°.</p>
              <p>Średnia: <strong>36,738°</strong>; odchylenie standardowe średniej: <strong>0,067°</strong>.</p>
              <p>Dla <span class="math">n = 5</span> współczynnik <span class="math">t = 2,7764</span>:</p>
              <div class="equation compact"><span class="math">u = 0,067 · 2,7764 = 0,1861</span></div>
              <p>Po zaokrągleniu: <strong>36,74° ± 0,19°</strong>.</p>
            </div>
          </div>
        </section>

        <section class="card">
          <h2>Niepewność standardowa typu B</h2>
          <p>Szacujemy ją, gdy mamy pojedynczy wynik, wyniki się nie różnią lub znamy dokładność przyrządu. Często korzysta się z niepewności maksymalnej <span class="math">ΔX</span> podanej przez producenta lub z działki elementarnej:</p>
          <div class="equation-block">
            ${CF.eq('<span class="math">u<sub>B</sub>(X) = ' + CF.frac('<span class="math">ΔX</span>', '<span class="math">√3</span>') + '</span>', "(7)")}
            <p class="equation-note">Dla prostych przyrządów analogowych, np. linijki, jako <span class="math">ΔX</span> przyjmuje się połowę działki elementarnej.</p>
          </div>
          <p>Gdy oba typy niepewności są istotne, łączymy je:</p>
          <div class="equation-block emphasized">
            ${CF.eq('<span class="math">u<sub>c</sub> = √(s<sub>x̄</sub><sup>2</sup> + u<sub>B</sub><sup>2</sup>)</span>', "(8)")}
            ${CF.eq('<span class="math">ε<sub>x̄</sub> = u<sub>c</sub> / x̄</span>', "niepewność względna całkowita")}
            <p class="equation-note">Skrypt oznacza przez <span class="math">ε</span> stosunek <span class="math">s<sub>x̄</sub>/x̄</span> (tylko niepewność typu A, wzór 9). Tutaj podajemy <span class="math">u<sub>c</sub>/x̄</span>, ponieważ uwzględniamy również typ B.</p>
          </div>
        </section>

        <section class="interactive-card" id="error-tool">
          <div class="interactive-head">
            <div>
              <p class="eyebrow">Kalkulator niepewności</p>
              <h2>Policz niepewność swojej serii</h2>
              <p>Wklej wyniki pomiarów, podaj działkę przyrządu i sprawdź gotowy zapis wyniku.</p>
            </div>
            <span class="live-badge"><i></i> typ A + B</span>
          </div>
          <div class="tool-grid">
            <div class="tool-controls">
              <label class="field">
                <span class="field-label">Wyniki pomiarów <small>(oddziel spacjami, przecinkami lub enterem)</small></span>
                <textarea class="input textarea" id="err-series" rows="5">36,95 36,60 36,75 36,59 36,80</textarea>
              </label>
              <label class="field">
                <span class="field-label">Działka elementarna / niepewność maksymalna <span class="math">ΔX</span></span>
                <input class="input" id="err-resolution" type="number" min="0" step="0.001" value="0.01">
              </label>
              <label class="switch-line">
                <input type="checkbox" id="err-script-mode">
                <span class="switch-ui"></span>
                <span><strong>Tryb zgodny ze skryptem</strong><small>t stosuj tylko dla n &lt; 10</small></span>
              </label>
              <p class="small-note">Domyślnie kalkulator stosuje współczynnik Studenta dla 95 % niezależnie od liczby pomiarów — jest to podejście bardziej rygorystyczne. Tryb skryptu pomija t dla n ≥ 10.</p>
            </div>
            <div class="tool-results">
              <div class="result-tile"><span>Liczba pomiarów <span class="math">n</span></span><strong id="err-n">—</strong></div>
              <div class="result-tile"><span>Średnia <span class="math">x̄</span></span><strong id="err-mean">—</strong></div>
              <div class="result-tile"><span>Odchylenie standardowe próbki <span class="math">s</span></span><strong id="err-sd">—</strong></div>
              <div class="result-tile"><span>Niepewność typu A</span><strong id="err-ua">—</strong></div>
              <div class="result-tile"><span>Współczynnik <span class="math">t</span></span><strong id="err-t">—</strong></div>
              <div class="result-tile"><span>Niepewność typu B</span><strong id="err-ub">—</strong></div>
              <div class="result-tile"><span>Niepewność całkowita</span><strong id="err-uc">—</strong></div>
              <div class="result-tile"><span>Niepewność względna (u<sub>c</sub>/x̄)</span><strong id="err-rel">—</strong></div>
              <div class="result-tile wide highlight-tile"><span>Wynik końcowy</span><p id="err-format">—</p></div>
            </div>
          </div>
          <div class="calc-work" id="err-steps">—</div>
        </section>

        ${callout("warning", "Dwa miareczkowania to mało", "Dla <span class=\"math\">n = 2</span> współczynnik Studenta dla 95 % wynosi <span class=\"math\">t = 12,706</span>, więc niepewność typu A bywa duża. W sprawozdaniu podaj ją razem z niepewnością typu B, omów ograniczenia i nie traktuj dwóch zgodnych objętości jako dowodu wysokiej precyzji.")}

        <section class="card">
          <h2>Przenoszenie niepewności — rozszerzenie</h2>
          <p>Gdy wielkość jest obliczana pośrednio, niepewności nie dodaje się „na oko”. Dla niezależnych wielkości stosujemy proste reguły:</p>
          <div class="rule-grid">
            <div class="rule"><h3>Suma i różnica</h3><p><span class="math">y = a ± b</span></p><div class="equation compact"><span class="math">u(y) = √(u(a)<sup>2</sup> + u(b)<sup>2</sup>)</span></div><p class="small-note">Niepewności bezwzględne sumują się kwadratowo.</p></div>
            <div class="rule"><h3>Iloczyn i iloraz</h3><p><span class="math">y = a·b</span> lub <span class="math">y = a/b</span></p><div class="equation compact"><span class="math">u(y)/|y| = √[(u(a)/a)<sup>2</sup> + (u(b)/b)<sup>2</sup>]</span></div><p class="small-note">Sumują się niepewności względne.</p></div>
            <div class="rule"><h3>Potęga</h3><p><span class="math">y = a<sup>k</sup></span></p><div class="equation compact"><span class="math">u(y)/|y| = |k| · u(a)/|a|</span></div><p class="small-note">Np. dla pierwiastka niepewność względna maleje dwukrotnie.</p></div>
          </div>
          <p class="small-note">Reguły dotyczą niepewności standardowych i niezależnych źródeł. W bardziej złożonych przypadkach stosuje się prawo propagacji niepewności z pochodnymi cząstkowymi.</p>
        </section>

        <section class="card">
          <h2>Jak zapisać wynik?</h2>
          <div class="two-col compact-gap">
            <div class="mini-card">
              <h3>Zasady zaokrąglania</h3>
              <ul class="plain-list">
                <li>Niepewność podajemy zwykle z dokładnością do dwóch cyfr znaczących.</li>
                <li>Wartość zaokrąglamy do tego samego miejsca dziesiętnego co niepewność.</li>
                <li>Jednostki podajemy przy obu liczbach lub po nawiasie.</li>
              </ul>
            </div>
            <div class="mini-card example-notation">
              <h3>Przykład</h3>
              <p>Wynik surowy: <span class="math">a = 321,735 m/s</span>, <span class="math">u(a) = 0,24678 m/s</span>.</p>
              <p>Poprawnie:</p>
              <div class="equation compact"><span class="math">a = 321,74 m/s; u(a) = 0,25 m/s</span></div>
              <div class="equation compact"><span class="math">a = 321,74(25) m/s</span></div>
              <div class="equation compact"><span class="math">a = 321,74(0,25) m/s</span></div>
            </div>
          </div>
        </section>

        ${check("errors-1", "Niepewność typu A wynosi 0,12, a typu B 0,16. Niepewność całkowita to:", [
          "0,28",
          "0,20",
          "0,04",
          "0,16"
        ], "b", "Niepewności niezależne sumujemy kwadratowo: √(0,12² + 0,16²) = √(0,0144 + 0,0256) = √0,04 = 0,20.")}

        ${check("errors-2", "Dla n = 5 pomiarów współczynnik Studenta dla 95 % wynosi 2,7764. Jeśli s_x̄ = 0,067, to u =", [
          "0,067",
          "0,186",
          "2,776",
          "0,024"
        ], "b", "u = t · s_x̄ = 2,7764 · 0,067 ≈ 0,186. Po zaokrągleniu 0,19.")}

        ${check("errors-3", "Który zapis wyniku jest poprawny, jeśli u = 0,25 m/s, a wartość = 321,735 m/s?", [
          "321,735 ± 0,24678 m/s",
          "321,74 ± 0,25 m/s",
          "321,7 ± 0,2 m/s",
          "321,74 ± 0,24678 m/s"
        ], "b", "Niepewność zaokrąglamy do dwóch cyfr znaczących (0,25), a wartość do tego samego miejsca dziesiętnego (321,74).")}
      `;
    }
  });

  /* ============================================================
     10 — WYKRESY I REGRESJA
     ============================================================ */
  page({
    id: "graphs",
    num: "10",
    group: "Laboratorium",
    title: "Opracowanie wyników metodą graficzną",
    short: "Wykresy i regresja",
    eyebrow: "Moduł 10 · Wykres, który mówi prawdę",
    lead: "Wykres jest narzędziem analizy, nie ozdobą. Naucz się opisywać osie, dobierać skalę, prowadzić linię i wyznaczać parametry prostej metodą regresji.",
    body: function () {
      return `
        <div class="module-intro">
          <div>
            <p class="eyebrow">Cele modułu</p>
            ${goalList([
              "stosować zasady poprawnego sporządzania wykresów,",
              "odróżnić linię łamaną od dopasowania prostą lub krzywą,",
              "wyznaczyć nachylenie, przecięcie z osią OY i współczynnik R²."
            ])}
          </div>
          <aside class="formula-slip">
            <span class="formula-slip-label">Prosta</span>
            ${CF.eq('<span class="math">y = A x + B</span>')}
            <p><span class="math">A</span> — nachylenie, <span class="math">B</span> — przecięcie z osią OY.</p>
          </aside>
        </div>

        <section class="card">
          <h2>Zasady dobrego wykresu</h2>
          <div class="rules-grid">
            <div class="rule-card"><span class="rule-num">01</span><h3>Opisz osie</h3><p>Nazwa wielkości, symbol i jednostka. Bez jednostek wykres jest nieczytelny.</p></div>
            <div class="rule-card"><span class="rule-num">02</span><h3>Dobierz skalę</h3><p>Wszystkie punkty powinny się zmieścić i zajmować możliwie dużą część pola. Skala nie musi zaczynać się od zera.</p></div>
            <div class="rule-card"><span class="rule-num">03</span><h3>Zaznacz punkty</h3><p>Czytelnie, różnymi symbolami dla różnych serii. Nie łącz punktów linią łamaną.</p></div>
            <div class="rule-card"><span class="rule-num">04</span><h3>Prowadź linię</h3><p>Gładką krzywą lub prostą dopasowaną do punktów. Liczba punktów po obu stronach linii powinna być porównywalna.</p></div>
            <div class="rule-card"><span class="rule-num">05</span><h3>Podpisz wykres</h3><p>Numer i tytuł pod wykresem. Tabela — numer i tytuł nad tabelą.</p></div>
            <div class="rule-card"><span class="rule-num">06</span><h3>Odwołaj się w tekście</h3><p>Każdy wykres i tabela muszą być opisane w treści sprawozdania.</p></div>
          </div>
          <div class="bad-good-graphs">
            <figure class="graph-example bad">
              <svg viewBox="0 0 260 150" aria-hidden="true">
                <line x1="30" y1="125" x2="240" y2="125" stroke="currentColor" opacity=".5"/>
                <line x1="30" y1="15" x2="30" y2="125" stroke="currentColor" opacity=".5"/>
                <polyline points="45,105 80,85 115,95 150,55 185,65 220,25" fill="none" stroke="#b6483f" stroke-width="2.5"/>
                <g fill="#b6483f"><circle cx="45" cy="105" r="4"/><circle cx="80" cy="85" r="4"/><circle cx="115" cy="95" r="4"/><circle cx="150" cy="55" r="4"/><circle cx="185" cy="65" r="4"/><circle cx="220" cy="25" r="4"/></g>
              </svg>
              <figcaption><strong>Nieprawidłowo:</strong> punkty połączone linią łamaną.</figcaption>
            </figure>
            <figure class="graph-example good">
              <svg viewBox="0 0 260 150" aria-hidden="true">
                <line x1="30" y1="125" x2="240" y2="125" stroke="currentColor" opacity=".5"/>
                <line x1="30" y1="15" x2="30" y2="125" stroke="currentColor" opacity=".5"/>
                <line x1="42" y1="113" x2="228" y2="24" stroke="#111111" stroke-width="2.5"/>
                <g fill="#111111"><circle cx="45" cy="105" r="4"/><circle cx="80" cy="85" r="4"/><circle cx="115" cy="95" r="4"/><circle cx="150" cy="55" r="4"/><circle cx="185" cy="65" r="4"/><circle cx="220" cy="25" r="4"/></g>
              </svg>
              <figcaption><strong>Prawidłowo:</strong> gładka prosta dopasowana do punktów.</figcaption>
            </figure>
          </div>
        </section>

        <section class="interactive-card" id="regression-tool">
          <div class="interactive-head">
            <div>
              <p class="eyebrow">Regresja liniowa</p>
              <h2>Dopasuj prostą do danych</h2>
              <p>Edytuj punkty lub wczytaj przykład. Wykres i parametry aktualizują się na bieżąco.</p>
            </div>
            <span class="live-badge"><i></i> najmniejsze kwadraty</span>
          </div>
          <div class="regression-layout">
            <div class="regression-data">
              <div class="table-wrap">
                <table class="data-table graph-data-table">
                  <thead><tr><th>#</th><th><span class="math">x</span></th><th><span class="math">y</span></th><th></th></tr></thead>
                  <tbody id="graph-table"></tbody>
                </table>
              </div>
              <div class="button-row">
                <button type="button" class="btn btn-small btn-ghost" id="graph-add">Dodaj punkt</button>
                <button type="button" class="btn btn-small btn-quiet" id="graph-example">Przykład</button>
                <button type="button" class="btn btn-small btn-quiet" id="graph-clear">Wyczyść</button>
              </div>
              <p class="small-note">Przykład: zależność absorbancji od stężenia — dane demonstracyjne.</p>
            </div>
            <div class="regression-plot">
              <canvas id="regression-canvas" aria-label="Wykres punktów pomiarowych i linii regresji"></canvas>
            </div>
          </div>
          <div class="regression-results">
            <div class="result-tile"><span>Nachylenie <span class="math">A</span></span><strong id="reg-slope">—</strong></div>
            <div class="result-tile"><span>Przecięcie <span class="math">B</span></span><strong id="reg-intercept">—</strong></div>
            <div class="result-tile"><span>Współczynnik <span class="math">R²</span></span><strong id="reg-r2">—</strong></div>
            <div class="result-tile"><span>Liczba punktów <span class="math">n</span></span><strong id="reg-n">—</strong></div>
            <div class="result-tile wide equation-tile"><span>Równanie prostej</span><p id="reg-equation">—</p></div>
          </div>
          <details class="decomposition">
            <summary>Niepewności parametrów</summary>
            <div class="result-row">
              <div class="result-tile"><span>Niepewność nachylenia <span class="math">u(A)</span></span><strong id="reg-se-slope">—</strong></div>
              <div class="result-tile"><span>Niepewność przecięcia <span class="math">u(B)</span></span><strong id="reg-se-intercept">—</strong></div>
            </div>
            <p class="small-note">Obliczenia według klasycznej regresji liniowej (najmniejszych kwadratów), przy założeniu niepewności tylko w kierunku y.</p>
          </details>
        </section>

        <section class="card">
          <h2>Jak wyznaczyć A i B?</h2>
          <div class="two-col compact-gap">
            <div class="mini-card">
              <h3>Metoda graficzna</h3>
              <p>Na dopasowanej prostej wybierz dwa odległe punkty <span class="math">P<sub>1</sub>(x<sub>1</sub>, y<sub>1</sub>)</span> i <span class="math">P<sub>2</sub>(x<sub>2</sub>, y<sub>2</sub>)</span>, a następnie oblicz:</p>
              <div class="equation compact"><span class="math">A = (y<sub>2</sub> − y<sub>1</sub>)/(x<sub>2</sub> − x<sub>1</sub>)</span></div>
              <p><span class="math">B</span> odczytujesz jako wartość <span class="math">y</span> dla <span class="math">x = 0</span>.</p>
              <p class="small-note">Nie używaj dwóch punktów pomiarowych — bierz punkty z narysowanej prostej.</p>
            </div>
            <div class="mini-card">
              <h3>Metoda najmniejszych kwadratów</h3>
              <p>Dla <span class="math">n</span> punktów:</p>
              ${CF.eq('<span class="math">A = ' + CF.frac("Σ(x<sub>i</sub> − x̄)(y<sub>i</sub> − ȳ)", "Σ(x<sub>i</sub> − x̄)<sup>2</sup>") + '</span>')}
              <div class="equation compact"><span class="math">B = ȳ − A x̄</span></div>
              <p class="small-note">Regresja minimalizuje sumę kwadratów odchyleń w kierunku osi y.</p>
            </div>
          </div>
        </section>

        ${check("graphs-1", "Punkty pomiarowe na wykresie należy:", [
          "połączyć linią łamaną, aby dokładnie pokazać każdy pomiar",
          "zaznaczyć, a przez ich układ poprowadzić gładką linię lub dopasowaną prostą",
          "połączyć tylko pierwszy i ostatni punkt",
          "pominąć, jeśli leżą blisko siebie"
        ], "b", "Linia łamana sugeruje, że między punktami znamy przebieg zależności. Zazwyczaj należy poprowadzić gładką linię lub prostą dopasowaną do wszystkich punktów.")}

        ${check("graphs-2", "W równaniu y = Ax + B współczynnik B odpowiada:", [
          "nachyleniu prostej",
          "wartości y dla x = 0, czyli przecięciu z osią OY",
          "współczynnikowi korelacji",
          "niepewności pomiaru"
        ], "b", "B to wyraz wolny — wartość y, gdy x = 0. A opisuje nachylenie.")}
      `;
    }
  });

  /* ============================================================
     11 — SPRAWOZDANIE
     ============================================================ */
  page({
    id: "report",
    num: "11",
    group: "Laboratorium",
    title: "Sprawozdanie — struktura, styl i szkielet",
    short: "Sprawozdanie",
    eyebrow: "Moduł 11 · Od wyników do tekstu",
    lead: "Sprawozdanie jest pracą badawczą, nie przepisywaniem instrukcji. Zbuduj je z właściwych części, użyj bezosobowego stylu i zadbaj o odniesienia do tabel oraz wykresów.",
    body: function () {
      return `
        <div class="module-intro">
          <div>
            <p class="eyebrow">Cele modułu</p>
            ${goalList([
              "znać wymagane części sprawozdania i kolejność,",
              "stosować bezosobowe formy czasownika w czasie przeszłym,",
              "poprawnie opisać tabele, wykresy, dyskusję błędów i wnioski."
            ])}
          </div>
          <aside class="formula-slip">
            <span class="formula-slip-label">Zasada</span>
            <p class="report-principle">„Odważono”, „miareczkowano”, „obliczono” — a nie „odważyłem”, „miareczkowałem”.</p>
          </aside>
        </div>

        ${callout("info", "Ważne", "Sprawozdanie przygotowuje się odręcznie, na papierze kancelaryjnym, zgodnie z wymaganiami prowadzącego. Szkic wygenerowany w tej aplikacji służy do uporządkowania treści i przepisania go własnoręcznie — nie zastępuje samodzielnej pracy.")}

        <section class="card">
          <h2>Struktura sprawozdania</h2>
          <div class="report-structure">
            <div class="report-part"><span>01</span><div><h3>Strona tytułowa</h3><p>Temat, cel, imię i nazwisko, kierunek, grupa, data wykonania i oddania.</p></div></div>
            <div class="report-part"><span>02</span><div><h3>Część teoretyczna</h3><p>Wstęp teoretyczny opracowany na podstawie podanych źródeł oraz cel ćwiczenia.</p></div></div>
            <div class="report-part"><span>03</span><div><h3>Karta wyników</h3><p>Oryginalna, wypełniona długopisem podczas zajęć i podpisana przez prowadzącego.</p></div></div>
            <div class="report-part"><span>04</span><div><h3>Wykonanie ćwiczenia</h3><p>Użyty sprzęt, szkło, odczynniki oraz opis przebiegu krok po kroku w stronie biernej.</p></div></div>
            <div class="report-part"><span>05</span><div><h3>Opracowanie wyników</h3><p>Wzory, jednostki, obliczenia, tabele i wykresy z numeracją oraz odniesieniami w tekście.</p></div></div>
            <div class="report-part"><span>06</span><div><h3>Dyskusja i wnioski</h3><p>Krytyczna ocena wyników, błędy, porównanie z wartościami tablicowymi, odpowiedź na cel.</p></div></div>
          </div>
        </section>

        <section class="card">
          <h2>Styl: bezosobowo, konkretnie, z jednostkami</h2>
          <div class="table-wrap">
            <table class="data-table style-table">
              <thead><tr><th>Zamiast</th><th>Napisz</th><th>Dlaczego</th></tr></thead>
              <tbody>
                <tr><td>„Wziąłem 0,1 g kwasu i wsypałem do butelki.”</td><td>„Odważono 0,1000 g kwasu benzoesowego i przeniesiono ilościowo do butelki.”</td><td>Bezosobowo, precyzyjnie, z jednostką.</td></tr>
                <tr><td>„Potem trochę mieszałem.”</td><td>„Zawartość wytrząsano przez 15 minut.”</td><td>Konkretny czas i czynność.</td></tr>
                <tr><td>„Wyszło K = 3.”</td><td>„Obliczono K = 3,02 ± 0,08.”</td><td>Wynik z niepewnością i jednostką, jeśli dotyczy.</td></tr>
                <tr><td>„Wykres pokazuje, że jest dobrze.”</td><td>„Na wykresie 1. zaobserwowano liniową zależność; współczynnik R² wyniósł 0,998.”</td><td>Odwołanie do numeru i konkretny parametr.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="card">
          <h2>Lista kontrolna</h2>
          <p>Odhacz elementy, które są gotowe. Lista zapisuje się lokalnie.</p>
          <div class="report-checklist" id="report-checklist">
            <label><input type="checkbox" data-report-check="title"><span>Strona tytułowa zawiera temat, cel, dane autora i daty.</span></label>
            <label><input type="checkbox" data-report-check="aim"><span>Cel ćwiczenia jest sformułowany własnymi słowami.</span></label>
            <label><input type="checkbox" data-report-check="theory"><span>Wstęp teoretyczny obejmuje wszystkie punkty zakresu wymaganych wiadomości.</span></label>
            <label><input type="checkbox" data-report-check="card"><span>Karta wyników jest oryginalna, wypełniona długopisem i podpisana.</span></label>
            <label><input type="checkbox" data-report-check="apparatus"><span>Wymieniono aparaturę, szkło i odczynniki.</span></label>
            <label><input type="checkbox" data-report-check="procedure"><span>Opis wykonania jest bezosobowy, w czasie przeszłym i krok po kroku.</span></label>
            <label><input type="checkbox" data-report-check="formulas"><span>Wzory mają objaśnione symbole i jednostki.</span></label>
            <label><input type="checkbox" data-report-check="tables"><span>Tabele mają numer, tytuł nad tabelą i odniesienie w tekście.</span></label>
            <label><input type="checkbox" data-report-check="graphs"><span>Wykresy mają opisane osie, jednostki, numer i tytuł pod wykresem.</span></label>
            <label><input type="checkbox" data-report-check="errors"><span>Obliczono błąd bezwzględny i względny oraz niepewność.</span></label>
            <label><input type="checkbox" data-report-check="discussion"><span>Dyskusja zawiera przyczyny odchyleń i krytyczną ocenę metody.</span></label>
            <label><input type="checkbox" data-report-check="conclusions"><span>Wnioski odpowiadają na cel ćwiczenia.</span></label>
            <label><input type="checkbox" data-report-check="references"><span>Zamieszczono spis źródeł.</span></label>
            <label><input type="checkbox" data-report-check="pages"><span>Strony są ponumerowane, a tekst staranny.</span></label>
          </div>
          <div class="checklist-progress"><div><span id="report-check-fill"></span></div><strong id="report-check-label">0 / 14</strong></div>
        </section>

        <section class="card report-builder-card">
          <div class="section-heading inline-heading">
            <div>
              <h2>Szkic sprawozdania</h2>
              <p>Uzupełnij pola. Wyniki zostaną pobrane z arkusza obliczeń, a dane z karty laboratoryjnej — z modułu 07.</p>
            </div>
            <span class="badge-soft">autozapis</span>
          </div>
          <div class="input-grid">
            <label class="field"><span class="field-label">Imię i nazwisko</span><input class="input" id="report-name" type="text" placeholder="np. Anna Kowalska"></label>
            <label class="field"><span class="field-label">Kierunek</span><input class="input" id="report-field" type="text" placeholder="np. farmacja"></label>
            <label class="field"><span class="field-label">Grupa</span><input class="input" id="report-group" type="text" placeholder="np. 2A"></label>
            <label class="field"><span class="field-label">Data wykonania</span><input class="input" id="report-date" type="date"></label>
            <label class="field wide"><span class="field-label">Temat</span><input class="input" id="report-topic" type="text" value="Współczynnik podziału substancji"></label>
            <label class="field wide"><span class="field-label">Cel ćwiczenia</span><textarea class="input textarea" id="report-aim" rows="3" placeholder="np. Ilościowe zbadanie rozdziału kwasu benzoesowego między wodę i toluen oraz wyznaczenie współczynnika podziału dla dwóch naważek."></textarea></label>
            <label class="field wide"><span class="field-label">Dyskusja — co zaobserwowano, jakie błędy, jakie przyczyny odchyleń</span><textarea class="input textarea" id="report-discussion" rows="5" placeholder="Wpisz własne wnioski..."></textarea></label>
            <label class="field wide"><span class="field-label">Wnioski — odpowiedź na cel</span><textarea class="input textarea" id="report-conclusions" rows="4" placeholder="Wpisz własne wnioski..."></textarea></label>
          </div>
          <div class="report-results-preview" id="report-results-preview">—</div>
          <div class="button-row">
            <button type="button" class="btn btn-primary" id="report-generate">Wygeneruj szkic</button>
            <button type="button" class="btn btn-ghost" id="report-download">Pobierz szkic .txt</button>
            <button type="button" class="btn btn-quiet" id="report-print">Podgląd do druku</button>
          </div>
        </section>

        ${check("report-1", "Który opis wykonania jest zgodny z wymaganiami?", [
          "„Wziąłem pipetę i nalałem 10 cm³ fazy wodnej.”",
          "„Pipetą odmierzono 10 cm³ fazy wodnej i przeniesiono do kolby stożkowej.”",
          "„Trochę tej wody przeniosłem do kolby.”",
          "„Faza wodna została przelana.”"
        ], "b", "Wymagany jest bezosobowy czas przeszły, konkretna czynność, szkło i objętość z jednostką.")}

        ${check("report-2", "Gdzie umieszcza się tytuł tabeli, a gdzie tytuł wykresu?", [
          "Oba pod obiektem",
          "Oba nad obiektem",
          "Tabela — nad tabelą; wykres — pod wykresem",
          "Tabela — pod tabelą; wykres — nad wykresem"
        ], "c", "Zgodnie ze skryptem opis tabeli zamieszcza się nad tabelą, a podpis wykresu pod wykresem.")}
      `;
    }
  });

  global.GUIDE = GUIDE;
})(window);
