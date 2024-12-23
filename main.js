// KONTROLKI

//pamięć zadanego stanu interwałów
window.soundControl = {
  interval: { up: 1, down: 0, both: 0 },
  length: { short: 0, medium: 1, long: 0 },
  delay: { short: 0, medium: 1, long: 0 },
};

//wartości odpowiadające window.soundControl
window.lengthAndDelayValues = {
  short: 1,
  medium: 2,
  long: 3,
};

//ikonki odpowiadające window.soundControl
window.controlIcons = {
  interval: {
    up: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="0" hegiht="0" fill="black">
        <path d="M26.5 5.5H12.5a1 1 0 0 0 0 2h11.3L6.3 25a1 1 0 0 0 1.4 1.4L25 8.9v11.3a1 1 0 1 0 2 0V5.5a1 1 0 0 0-0.5-1z"/>
      </svg>`,
    down: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="black" transform="scale(1, -1)">
        <path d="M26.5 5.5H12.5a1 1 0 0 0 0 2h11.3L6.3 25a1 1 0 0 0 1.4 1.4L25 8.9v11.3a1 1 0 1 0 2 0V5.5a1 1 0 0 0-0.5-1z"/>
      </svg>`,
    both: '<img class="control-button-note-icon" src=/svg/n4b.svg alt="short">',
  },
  length: {
    short:
      '<img class="control-button-note-icon" src=/svg/n16u.svg alt="short">',
    medium:
      '<img class="control-button-note-icon" src=/svg/n8u.svg alt="medium">',
    long: '<img class="control-button-note-icon" src=/svg/n4u.svg alt="long">',
  },
  delay: {
    short:
      '<img class="control-button-pause-icon" src=/svg/p16.svg alt="short">',
    medium:
      '<img class="control-button-pause-icon" src=/svg/p8.svg alt="short">',
    long: '<img class="control-button-pause-icon" src=/svg/p4.svg alt="short">',
  },
};

// ZMIENNE GLOBALNE

window.defMaxError = 3;
window.defSoundVolume = 20;
window.soundVolume = 20;
window.soundLength = 2;
window.soundDelay = 2;
window.soundOrder = 1;
window.note1 = null; //pierwsza nuta
window.note2 = null; //druga nuta
window.intervalToGuess = null; //interwał (pierwsza nut-druga nuta)
window.errorIntervalCounter = 0;
window.maxError = 3; // maks ilość powtórzeń
window.checkedIntervals = '1111111111111'; //zaznaczone interwały;
window.buttonLabels = [
  '1cz',
  '2m',
  '2w',
  '3m',
  '3w',
  '4cz',
  'Try',
  '5cz',
  '6m',
  '6w',
  '7m',
  '7w',
  '8cz',
];

window.globalIntervalStats = Array.from(
  { length: window.buttonLabels.length },
  () => ({
    good: 0,
    bad1: 0, //błędnie kliknięty interwał - pomylony skutek
    bad2: 0, //błęnie rozpoznany interwał - pomylone źródło
  })
);

window.mainRefSize = 2.5;
window.isPortrait = window.innerHeight > window.innerWidth;
window.intervalButtonSize = 2.5;
window.radiusLarge = 5 * window.intervalButtonSize;
window.radiusSmall = 0.6 * window.radiusLarge;

// PRZYCISK RESET
const resetButton = document.createElement('button');
resetButton.innerHTML = '&nbsp0&nbsp';
resetButton.id = 'reset-btn';
resetButton.addEventListener('click', resetIntervalStats);
window.resetButton = resetButton;

// UAKTUALNIANIE INTERWAŁÓW ZGODNIE Z ZAZNACZENIEM
function updateCheckedIntervals(visibility) {
  for (let i = 0; i < 13; i++) {
    const checkbox = document.getElementById(`intervalCheckbox-${i}`);
    const button = document.getElementById(`intervalButton-${i}`);
    if (checkbox) {
      button.disabled = !checkbox.checked;
    }
    checkbox.style.display = visibility ? 'block' : 'none';
  }
}

// GŁÓWNA FUNKCJA RYSUJĄCA
function drawMainWindow() {
  // WYMIARY
  // document.documentElement.style.height = document.body.clientHeight;
  // document.documentElement.style.width = window.width;

  // UCHWYTY KONTENERÓW
  const pianoContainer = document.getElementById('pianoContainer');
  const divPiano = document.getElementById('pianoDiv');
  const divSound = document.getElementById('soundDiv');
  const divInfo = document.getElementById('infoDiv');
  const divMain = document.getElementById('mainDiv');
  const divControls = document.getElementById('controlsDiv');
  const divChartStats = document.getElementById('chartStatsDiv');
  const divNumStats = document.getElementById('numStatsDiv');
  divPiano.innerHTML = '';
  divMain.innerHTML = '';
  divControls.innerHTML = '';
  divChartStats.innerHTML = '';
  divNumStats.innerHTML = '';

  // STEROWANIE
  const controlContainer = elementControlContainer();
  divControls.appendChild(controlContainer);

  const mainContainer = document.getElementById('mainContainer');

  // POLE ILOŚCI BŁĘDÓW
  if (!mainContainer.querySelector('#elementMaxError')) {
    const maxErrorContainer = elementMaxError(defMaxError);
    divControls.appendChild(maxErrorContainer);
  }

  // POLE GŁOŚNOŚCI
  soundDiv.innerHTML = '';
  const soundVolumeContainer = elementSoundVolume(defSoundVolume);
  divSound.appendChild(soundVolumeContainer);
  const infoDivContainer = document.createElement('div');
  infoDivContainer.id = 'infoDiv';
  infoDiv.innerHTML =
    '<p>&copy 2024 v0.1&nbsp</p><p>Nikodem Horst&nbsp</p><p>(nvhorst@gmail)&nbsp</p><p><a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC BY-NC-ND</a>&nbsp</p><p><a href="https://github.com/nvhorst/atempo">GitHub</a></p>';
  // `W=${window.innerWidth} x H=${window.innerHeight}`;

  //STATYSTYKI
  const statsChart = drawStatChart(
    window.globalIntervalStats,
    divChartStats.offsetWidth * 0.8,
    divChartStats.offsetHeight * 0.9
  );
  divChartStats.appendChild(statsChart);

  const statsNumeric = drawNumericStatContainer();
  divNumStats.appendChild(statsNumeric);
  divNumStats.appendChild(resetButton);

  // PRZYCISKI STEROWANIA INTERWAŁAMI
  // GŁÓWNY PRZYCISK
  const intervalButtonsContainer = document.createElement('div');
  intervalButtonsContainer.id = 'interval-buttons-container';

  const mainIntervalPlayButton = createMainPlayIntervalButton();
  mainIntervalPlayButton.style.left = '50%';
  mainIntervalPlayButton.style.top = '50%';
  mainIntervalPlayButton.style.transform = 'translate(-50%, -50%)';

  intervalButtonsContainer.appendChild(mainIntervalPlayButton);

  window.intervalButtonsContainer = intervalButtonsContainer;

  // LOGIKA GŁÓWNEGO PRZYCISKU
  mainIntervalPlayButton.addEventListener('click', () => {
    if (window.isPlaying === false) {
      window.intervalToGuess = null;
      return;
    }
    if (window.intervalToGuess !== null) return;

    //wybierz nuty, odśwież licznik i statystyki, zastosuj ustawienia i zagraj
    [window.note1, window.note2] = pickRandomInterval(0, 12, 20);
    window.errorIntervalCounter = 0;
    window.refreshCharts();
    applySoundSettings(); //zastosuj ustawienia z kontrolek (controlsDiv)
    PlayInterval(window.note1, window.note2);
  });

  //PRZYCISKI INERWAŁÓW
  buttonLabels.forEach((label, index) => {
    const elementIntervalButton = createIntervalButton(index, label);
    intervalButtonsContainer.appendChild(elementIntervalButton);
  });

  divMain.appendChild(intervalButtonsContainer);
  divMain.style.position = 'relative';

  //KLAWIATURA
  const pianoKeyboard = piano(
    pianoContainer.clientHeight * 0.8,
    pianoContainer.clientWidth * 0.9
  );
  divPiano.appendChild(pianoKeyboard);

  //PRZELICZ LAYOUT
  updateCSSRulesFromArray(getElementCSS());

  //UŁÓŻ PRZYCISKI PROMIENIŚCIE
  arrangeButtonsInDoubleClock(
    intervalButtonsContainer,
    mainRefSize * window.radiusSmall * window.unitToPixel,
    mainRefSize * window.radiusLarge * window.unitToPixel
  );

  addArcSegmentWithMirror(
    intervalButtonsContainer,
    intervalButtonsContainer.getBoundingClientRect().width / 2,
    intervalButtonsContainer.getBoundingClientRect().height / 2,
    intervalButtonsContainer.getBoundingClientRect().height / 4,
    -30,
    30,
    window.strokeWidth,
    '\u21BA',
    '>>'
  );
  window.svg.style.display = 'none';
}

applySoundSettings();
drawMainWindow();

window.addEventListener('resize', () => {
  window.isPortrait = window.innerHeight > window.innerWidth;
  drawMainWindow();
});
