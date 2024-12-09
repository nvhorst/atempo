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

function getElementCSS() {
  window.unitToPixel = !isPortrait ? window.innerHeight : window.innerWidth;
  window.unitToPixel /= 100;
  window.strokeWidth = `${4 * window.unitToPixel}px`;
  return [
    [
      '#mainContainer',
      'column-gap',
      `${mainRefSize * 2 * window.unitToPixel}px`,
    ],
    ['#mainButton', 'width', `${mainRefSize * 5 * window.unitToPixel}px`], //1.5
    ['#mainButton', 'height', `${mainRefSize * 5 * window.unitToPixel}px`], //1.5
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
      `${mainRefSize * 1 * window.unitToPixel}px`,
    ], //2
    [
      '#mainButton-square',
      'height',
      `${mainRefSize * 1 * window.unitToPixel}px`,
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
      `${mainRefSize * 1 * window.unitToPixel}px`,
    ], //1.5
    [
      '.interval-checkbox',
      'width',
      `${mainRefSize * 1 * window.unitToPixel}px`,
    ],
    [
      '.interval-checkbox',
      'height',
      `${mainRefSize * 1 * window.unitToPixel}px`,
    ],

    [
      '#elementControlContainer',
      'column-gap',
      `${mainRefSize * 1 * window.unitToPixel}px`,
    ], //2
    [
      '#controlsDiv',
      'column-gap',
      `${mainRefSize * 0.0 * window.unitToPixel}px`,
    ], //2
    [
      '.control-subContainer',
      'gap',
      `${mainRefSize * 1 * window.unitToPixel}px`,
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
      `${mainRefSize * 1 * window.unitToPixel}px`,
    ],

    [
      '.stat-interval-label',
      'font-size',
      `${mainRefSize * window.unitToPixel}px`,
    ], //1
    ['span', 'font-size', `${mainRefSize * 1 * window.unitToPixel}px`], //1
    ['#reset-btn', 'font-size', `${mainRefSize * 2 * window.unitToPixel}px`], //2
  ];
}
