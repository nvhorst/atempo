function updateCSSRulesFromArray(elementSizes) {
  var sheet = document.styleSheets[0];
  var rules = sheet.cssRules || sheet.rules; // Support modern and older browsers
  elementSizes.forEach(function (entry) {
    var selector = entry[0]; // CSS selector
    var property = entry[1]; // CSS property
    var value = entry[2]; // CSS value
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      if (rule.selectorText === selector) {
        // Update the specific CSS property
        rule.style[property] = value;
        break; // Exit the loop once the rule is updated
      }
    }
  });
}

//CZY ELEMENT WYSTAJE?
function isOverflowing(element) {
  return {
    horizontal: element.scrollWidth > element.clientWidth,
    vertical: element.scrollHeight > element.clientHeight,
    any:
      element.scrollWidth > element.clientWidth ||
      element.scrollHeight > element.clientHeight,
  };
}

//PRZELICZ LAYOUT
function getElementCSS() {
  //nagłówek: infoDiv i soundVolumeDiv
  const infoDiv = document.getElementById('infoDiv');
  infoDiv.style.flexDirection = isOverflowing(
    document.getElementById('pianoContainer')
  ).vertical
    ? 'row'
    : 'column';

  const elementSoundVolume = document.getElementById('elementSoundVolume');

  elementSoundVolume.style.flexDirection =
    isOverflowing(document.getElementById('pianoContainer')).vertical &&
    infoDiv.style.flexDirection === 'row'
      ? 'row'
      : 'column';

  //przelicz główne koordynaty
  window.unitToPixel = !isPortrait ? window.innerHeight : window.innerWidth;
  window.unitToPixel /= 100;
  window.optimumWheelDiameter =
    document.getElementById('mainContainer').offsetHeight * 0.9;

  //skoryguj wielkość optimumWheelDiameter jeśli jest zła
  const mainDivWidth = document
    .getElementById('mainContainer')
    .getBoundingClientRect().width;
  let controlsDivWidth = document.getElementById('controlsDiv');
  controlsDivWidth =
    mainRefSize * intervalButtonSize * window.unitToPixel * 3 +
    mainRefSize * 2 * window.unitToPixel;

  const controlsDivColumnGap =
    window.mainRefSize * window.intervalButtonSize * window.unitToPixel;
  if (
    controlsDivWidth +
      window.optimumWheelDiameter +
      controlsDivColumnGap * 2.5 >
    mainDivWidth
  ) {
    optimumWheelDiameter =
      mainDivWidth - controlsDivWidth - 2.5 * controlsDivColumnGap;
  }

  //przelicz wartości referencyjne - taką wartością jest intervalButtonSize!
  window.intervalButtonSize =
    window.optimumWheelDiameter / window.unitToPixel / window.mainRefSize / 6;
  window.radiusLarge = 5 * window.intervalButtonSize;
  window.radiusSmall = 0.6 * window.radiusLarge;
  window.strokeWidth = `${4 * window.unitToPixel}px`;

  //uaktualniej rozmiar kontenera
  window.intervalButtonsContainer.style.width = `${
    mainRefSize *
    window.unitToPixel *
    (window.radiusLarge + window.intervalButtonSize)
    // ==(6 * window.intervalButtonSize)
  }px`;

  intervalButtonsContainer.style.height = intervalButtonsContainer.style.width;

  return [
    ['#mainContainer', 'column-gap', `${controlsDivColumnGap}px`],
    [
      '#mainButton',
      'width',
      `${mainRefSize * window.intervalButtonSize * 2 * window.unitToPixel}px`,
    ], //1.5
    [
      '#mainButton',
      'height',
      `${mainRefSize * window.intervalButtonSize * 2 * window.unitToPixel}px`,
    ], //1.5
    [
      '#mainButton-triangle',
      'border-top-width',
      `${mainRefSize * 1 * window.unitToPixel}px`,
    ], //2
    [
      '#mainButton-triangle',
      'border-bottom-width',
      `${mainRefSize * 1 * window.unitToPixel}px`,
    ], //2
    [
      '#mainButton-triangle',
      'border-left-width',
      `${mainRefSize * 1.8 * window.unitToPixel}px`,
    ], //2

    [
      '#mainButton-square',
      'width',
      `${mainRefSize * 1.25 * window.unitToPixel}px`,
    ], //2
    [
      '#mainButton-square',
      'height',
      `${mainRefSize * 1.25 * window.unitToPixel}px`,
    ], //2

    [
      '.interval-button',
      'height',
      `${mainRefSize * intervalButtonSize * window.unitToPixel}px`,
    ], //5
    [
      '.interval-button',
      'width',
      `${mainRefSize * intervalButtonSize * window.unitToPixel}px`,
    ], //5
    [
      '.btn-sector-text',
      'font-size',
      `${mainRefSize * 1 * window.unitToPixel}px`,
    ], //2.5

    [
      '.interval-button',
      'font-size',
      `${
        ((mainRefSize * window.intervalButtonSize) / 2.5) * window.unitToPixel
      }px`,
    ], //1.5
    [
      '.interval-checkbox',
      'width',
      `${
        ((mainRefSize * window.intervalButtonSize) / 2.5) * window.unitToPixel
      }px`,
    ],
    [
      '.interval-checkbox',
      'height',
      `${
        ((mainRefSize * window.intervalButtonSize) / 2.5) * window.unitToPixel
      }px`,
    ],
    ['#controlsDiv', 'gap', `${mainRefSize * 0.75 * window.unitToPixel}px`],
    [
      '#elementControlContainer',
      'column-gap',
      `${mainRefSize * 1 * window.unitToPixel}px`,
    ], //2
    ['#controlsDiv', 'column-gap', `${mainRefSize * window.unitToPixel}px`], //2
    [
      '.control-subContainer',
      'gap',
      `${mainRefSize * 0.5 * window.unitToPixel}px`,
    ], //6
    [
      '.control-subContainer-label',
      'font-size',
      `${mainRefSize * 2 * window.unitToPixel}px`,
    ], //1.5 sterowanie

    ['.control-button', 'width', `${mainRefSize * 3 * window.unitToPixel}px`], //6
    ['.control-button', 'height', `${mainRefSize * 3 * window.unitToPixel}px`], //6
    [
      '.control-button',
      'padding',
      `${(mainRefSize / 4) * window.unitToPixel}px`,
    ], //1
    [
      '.control-button-label',
      'font-size',
      `${mainRefSize * 2 * window.unitToPixel}px`,
    ], //2.5

    [
      '.control-button-label svg',
      'width',
      `${mainRefSize * 1.5 * window.unitToPixel}px`,
    ], //2.5

    [
      '.control-button-label svg',
      'height',
      `${mainRefSize * 1.5 * window.unitToPixel}px`,
    ], //2.5
    [
      '.control-button-label',
      'margin-left',
      `${(mainRefSize / 8) * window.unitToPixel}px`,
    ], //1
    [
      '.control-button-note-icon',
      'height',
      `${mainRefSize * 2.1 * window.unitToPixel}px`,
    ], //2.5

    [
      '.control-button-note-icon',
      'margin-left',
      `${mainRefSize * 0.3 * window.unitToPixel}px`,
    ], //2.5
    ['.control-checkbox', 'width', `${mainRefSize * 1 * window.unitToPixel}px`],
    [
      '.control-checkbox',
      'height',
      `${mainRefSize * 1 * window.unitToPixel}px`,
    ],
    [
      '#maxErrorSelect, #soundVolumeSelect',
      'font-size',
      `${((mainRefSize * intervalButtonSize) / 2.5) * window.unitToPixel}px`,
    ],

    [
      '.stat-interval-label',
      'font-size',
      `${mainRefSize * window.unitToPixel}px`,
    ], //1
    [
      'span',
      'font-size',
      `${((mainRefSize * intervalButtonSize) / 2.5) * window.unitToPixel}px`,
    ], //1
    ['#reset-btn', 'font-size', `${mainRefSize * 2 * window.unitToPixel}px`], //2
    ['#reset-btn', 'width', `${mainRefSize * 4 * window.unitToPixel}px`], //2
    ['#reset-btn', 'height', `${mainRefSize * 4 * window.unitToPixel}px`], //2
    ['#stat-label-container', 'font-size', `13px`], //2
    ['#infoDiv', 'font-size', `${mainRefSize * window.unitToPixel}px`], //2
    [
      '#numStatTable',
      'font-size',
      `${mainRefSize * 1.5 * window.unitToPixel}px`,
    ], //2
    [
      '#numStatTable',
      'border-radius',
      `${
        (mainRefSize * window.unitToPixel * 0.5 * intervalButtonSize) / 2.5
      }px`,
    ], //2
    [
      '#numStatTable',
      'border-width',
      `${
        (mainRefSize * window.unitToPixel * 0.125 * intervalButtonSize) / 2.5
      }px`,
    ], //2
    [
      '#svg-icon-speaker',
      'width',
      `${mainRefSize * window.unitToPixel * 2.5}px`,
    ], //2
    [
      '#svg-icon-speaker',
      'height',
      `${mainRefSize * window.unitToPixel * 2.5}px`,
    ], //2
  ];
}
