# Współczynnik podziału — interaktywny przewodnik

Samodzielna aplikacja edukacyjna do ćwiczenia **„Współczynnik podziału substancji”** z chemii fizycznej. Łączy teorię, protokół laboratoryjny, arkusz obliczeń, rachunek błędów, wykresy, szkielet sprawozdania i test końcowy.

## Uruchomienie

Aplikacja nie wymaga instalacji ani połączenia z internetem.

1. Otwórz plik `index.html` w przeglądarce (dwuklik albo „Otwórz za pomocą”).
2. Jeśli przeglądarka blokuje zapis danych dla plików lokalnych, uruchom prosty serwer w tym katalogu:

```bash
python3 -m http.server 8000
```

Następnie otwórz `http://localhost:8000`.

> Wszystkie pliki są lokalne. Nie ma zewnętrznych bibliotek, CDN ani śledzenia.

## Co zawiera

### Teoria

- **01 Potencjał chemiczny** — aktywność, współczynnik aktywności, wyprowadzenie stałego stosunku stężeń; rozszerzenie o stany standardowe i prawo Debye’a–Hückla.
- **02 Prawo podziału Nernsta** — warunki stosowalności, K, D, logP i logD; wyprowadzenie termodynamiczne, równanie van ’t Hoffa i reguła faz.
- **03 Dysocjacja i asocjacja** — pełne prawo Ostwalda, kalkulator α, dimeryzacja kwasu benzoesowego, związek `K₂ = √(2K_as)·K_monomer` i tabela rozpoznawania mechanizmu.
- **04 Wzór roboczy** — interaktywny kreator wzoru z poprawek, interpretacja jednostek.
- **05 Ekstrakcja** — jednostopniowa i wielostopniowa, symulator porcji, tabela porównawcza, ekstrakcja przeciwprądowa i zastosowania.
- **06 Aktywność biologiczna** — logP, przykładowe wartości, wpływ pH na D, tabela udziału form, logD, reguła Lipinskiego, QSAR Hanscha i mapa lipofilowości.

### Laboratorium i opracowanie

- **07 Wykonanie ćwiczenia** — sprzęt, odczynniki, bezpieczeństwo, protokół 7 kroków, karta wyników miareczkowania.
- **08 Obliczenia krok po kroku** — od V(NaOH) przez c_w, bilans masy, α, K₁ i K₂; dane przykładowe można zastąpić własnymi.
- **09 Błędy i niepewności** — błąd bezwzględny/względny, niepewność typu A i B, współczynnik Studenta, kalkulator.
- **10 Wykresy i regresja** — zasady wykresu, edytowalna tabela punktów, dopasowanie prostej, R², niepewności parametrów.
- **11 Sprawozdanie** — struktura, styl bezosobowy, lista kontrolna, szkic do druku lub pobrania.

### Utrwalenie

- **12 Test końcowy** — 18 pytań z wyjaśnieniami, wynik i automatyczne oznaczenie modułu po uzyskaniu ≥ 80 %.
- **13 Ściągawka i zakres** — wzory, definicje, lista wymagań i wydruk.

## Zapis danych

- Postęp, wpisane wyniki i szkic sprawozdania są zapisywane w `localStorage` przeglądarki.
- Klucz: `chemia-fizyczna-przewodnik-v1`.
- W panelu bocznym znajduje się przycisk **„Wyczyść postęp i dane”**.
- Aplikacja nie wysyła danych na żaden serwer.

## Struktura plików

```
przewodnik/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── tools.js          # obliczenia, formatowanie, statystyka, wykresy
│   ├── content.js        # nawigacja, start, moduły 01–06
│   ├── content-lab.js    # moduły 07–11
│   ├── content-final.js  # test, ściągawka, zakres
│   └── app.js            # routing, symulacje, interakcje, modal, quiz
└── README.md
```

Dokument źródłowy zakresu wiadomości: [`../ZAKRES_WIADOMOSCI.md`](../ZAKRES_WIADOMOSCI.md).

## Źródło i zastrzeżenia

Materiał opracowano na podstawie skryptu *Chemia fizyczna — ćwiczenia laboratoryjne. Skrypt dla studentów farmacji, analityki medycznej, biotechnologii i chemii kosmetycznej*, rozdz. 3 oraz 14–16.

- Przewodnik jest materiałem pomocniczym; nie zastępuje instrukcji prowadzącego, szkolenia BHP ani kart charakterystyki substancji.
- Dane w arkuszu obliczeń są **przykładowe** i wyraźnie oznaczone. Do sprawozdania należy wpisać własne wyniki.
- Wzór `K₂ = √c_t/[c_w(1−α)]` odtwarza zapis operacyjny ze skryptu. Jego wynik ma umowny wymiar; w ćwiczeniu porównuje się wartości dla obu naważek, a nie interpretuje jako bezwymiarową stałą termodynamiczną.
- Szkic sprawozdania jest pomocą redakcyjną. Sprawozdanie należy napisać odręcznie i własnymi słowami.
