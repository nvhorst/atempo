const notes = [
  'a2',
  'a#2',
  'h2',
  'c3',
  'c#3',
  'd3',
  'd#3',
  'e3',
  'f3',
  'f#3',
  'g3',
  'g#3',
  'a3',
  'a#3',
  'h3',
  'c4',
  'c#4',
  'd4',
  'd#4',
  'e4',
];

//ODŚWIEŻENIE STATYSTYK - DYNAMICZNE, DLATEEGO W TYM PLIKU
function refreshCharts() {
  const numericStatsContainer = document.getElementById('numStatsDiv');
  numericStatsContainer.innerHTML = '';
  numericStatsContainer.appendChild(drawNumericStatContainer());
  numericStatsContainer.appendChild(window.resetButton);
  const chartStatsDiv = document.getElementById('chartStatsDiv');
  chartStatsDiv.innerHTML = '';
  chartStatsDiv.appendChild(
    drawStatChart(
      window.globalIntervalStats,
      chartStatsDiv.offsetWidth * 0.8,
      chartStatsDiv.offsetHeight * 0.9
    )
  );
}

//USTAW PARAMETRY DŹWIĘKU DO ODTWORZENIA
function applySoundSettings() {
  function selectOrRandomize(controlGroup, valueMapping = null) {
    const selectedKeys = Object.keys(controlGroup).filter(
      (key) => controlGroup[key] === 1
    );
    if (selectedKeys.length === 1) {
      return valueMapping ? valueMapping[selectedKeys[0]] : selectedKeys[0];
    }
    const randomIndex = Math.floor(Math.random() * selectedKeys.length);
    return valueMapping
      ? valueMapping[selectedKeys[randomIndex]]
      : selectedKeys[randomIndex];
  }

  //kolejność odtwarzania
  window.soundOrder = selectOrRandomize(window.soundControl.interval);
  if (window.soundOrder === 'up' && window.note2 <= window.note1) {
    [window.note1, window.note2] = [window.note2, window.note1]; // Swap
  } else if (window.soundOrder === 'down' && window.note1 <= window.note2) {
    [window.note1, window.note2] = [window.note2, window.note1]; // Swap
  }

  //długość dźwięku
  window.soundLength = selectOrRandomize(
    window.soundControl.length,
    window.lengthAndDelayValues
  );

  //opóźnienie drugiego dźwięku
  window.soundDelay = selectOrRandomize(
    window.soundControl.delay,
    window.lengthAndDelayValues
  );

  tones.volume = window.soundVolume / 100; //
  tones.release = window.soundLength * 400;
  tones.sustain = 0;
}

//FUNKCJA WYBORU INTERWAŁU (LOSOWANIE DWÓCH LICZB Z ZADANEGO ZAKRESU)
function pickRandomInterval(rangeMin, rangeMax, max, given = -1) {
  //od, do, w górę-w dół, maks ilość dźwięków do wyboru
  let i = 0;
  do {
    i++;
    num1 = Math.floor(Math.random() * max);
    num2 = Math.floor(Math.random() * max);
    if (i > 10000) {
      throw new Error('Przeliczony');
    }
  } while (
    !(
      Math.abs(num1 - num2) >= rangeMin &&
      Math.abs(num1 - num2) <= rangeMax &&
      ((window.checkedIntervals[Math.abs(num1 - num2)] === '1' &&
        given === -1) ||
        Math.abs(num1 - num2) == given)
    )
  );
  if (given === -1) window.intervalToGuess = Math.abs(num1 - num2);

  return [num1, num2];
}

//ZAGRAJ INTERWAŁ - NUTA 1 I NUTA 2; PARAMETRY DO OTWARZANIA: applySoundSettings()
function PlayInterval(note1, note2) {
  const firstNote = notes[note1];
  const secondNote = notes[note2];
  if (window.soundOrder === 'both') {
    keys[firstNote].dispatchEvent(new MouseEvent('click'));
    keys[secondNote].dispatchEvent(new MouseEvent('click'));
  } else {
    keys[firstNote].dispatchEvent(new MouseEvent('click'));
    setTimeout(() => {
      keys[secondNote].dispatchEvent(new MouseEvent('click'));
    }, 300 + (window.soundDelay - 1) * 500); //300 800 1100 - dopasowane do długości dźwięków
  }
}

//GłÓWNY PRZYCISK - PLAY
function createMainPlayIntervalButton() {
  const mainExcerciseButton = document.createElement('div');
  mainExcerciseButton.id = 'mainButton';

  //kółeczko wokół bazy
  const circle = document.createElement('div');
  circle.id = 'mainButton-circle';
  mainExcerciseButton.appendChild(circle);

  //trójkącik jak hawajska
  const triangle = document.createElement('div');
  triangle.id = 'mainButton-triangle';
  circle.appendChild(triangle);

  //kwadracik
  const square = document.createElement('div');
  square.id = 'mainButton-square';
  circle.appendChild(square);

  let blinkInterval; // czy mruga? ==czy sprawdza statystyki?
  window.isPlaying = false;

  function startBlinking() {
    let isDim = false;
    blinkInterval = setInterval(() => {
      circle.style.backgroundColor = isDim ? '#007bff' : '#5dc7ff';
      isDim = !isDim;
    }, 900);
  }

  function stopBlinking() {
    clearInterval(blinkInterval);
    circle.style.backgroundColor = '#007bff';
  }

  circle.addEventListener('click', () => {
    if (isPlaying) {
      // Stop the blinking and show the triangle
      stopBlinking();
      triangle.style.display = 'block';
      square.style.display = 'none';
      window.svg.style.display = 'none';
      updateCheckedIntervals(true);
      enableElementCSS(document.getElementById('elementMaxError'));
      window.errorIntervalCounter = 0;
      refreshCharts();
    } else {
      // Start blinking and show the square
      startBlinking();
      triangle.style.display = 'none';
      square.style.display = 'block';
      window.svg.style.display = 'block';
      updateCheckedIntervals(false);
      disableElementCSS(document.getElementById('elementMaxError'));
    }
    window.isPlaying = !window.isPlaying;
  });

  return mainExcerciseButton;
}

// Attach the function to the global object
window.createMainPlayIntervalButton = createMainPlayIntervalButton;

//WYKONAJ POWTÓRKĘ INTERWAŁU
function scheduleReplay() {
  setTimeout(() => {
    PlayInterval(window.note1, window.note2); // Replay the current interval
  }, 700);
}

//ZAPLANUJ KOLEJNY INTERWAŁ
function scheduleNextInterval() {
  setTimeout(() => {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    mainButton.dispatchEvent(clickEvent);
  }, 700);
}

//UTWÓRZ POJEDYNCZY PRZYCISK INTERWAŁU
function createIntervalButton(index, label) {
  const intervalButton = document.createElement('button');
  intervalButton.textContent = label;
  intervalButton.id = `intervalButton-${index}`;
  intervalButton.classList.add('interval-button');

  intervalButton.addEventListener('mouseenter', function eventMouseEnter() {
    intervalButton.style.background = 'blue';
    intervalButton.style.color = 'white';
  });

  intervalButton.addEventListener('mouseleave', function eventMouseLeave() {
    intervalButton.style.background = '';
    intervalButton.style.color = '';
  });

  intervalButton.addEventListener('click', function eventMouseClick() {
    if (window.intervalToGuess === null) {
      [window.note1, window.note2] = pickRandomInterval(0, 12, 20, index);
      applySoundSettings();
      PlayInterval(window.note1, window.note2);
      return;
    }
    const color = index === window.intervalToGuess ? 'lawngreen' : 'red'; //kliknięcie OK - zielone, nieOK - czerwone

    intervalButton.style.backgroundColor = color;

    if (index === window.intervalToGuess) {
      handleCorrectGuess(index);
    } else {
      handleIncorrectGuess(index);
    }

    refreshCharts();

    setTimeout(() => {
      intervalButton.style.transition = 'background-color 3s ease';
      intervalButton.style.backgroundColor = '#fff4cd'; //kolor bieżący
      intervalButton.style.color = 'black'; // kolor bieżący
    }, 10); // opóźnienie żeby przeglądarka ogarnęła
    setTimeout(() => {
      intervalButton.style.transition = ''; // zeruj
    }, 3000);
  });
  window.refreshCharts = refreshCharts;

  //akcja: poprawny wybór
  function handleCorrectGuess(index) {
    window.globalIntervalStats[index].good += 1;
    window.globalIntervalStats[window.intervalToGuess].bad2 +=
      window.errorIntervalCounter;
    window.errorIntervalCounter = 0;
    window.intervalToGuess = null;
    scheduleNextInterval();
  }

  //akcja: niepoprawny wybór
  function handleIncorrectGuess(index) {
    window.globalIntervalStats[index].bad1++;

    if (window.maxError > 0) {
      window.errorIntervalCounter++;
      if (window.errorIntervalCounter <= window.maxError) {
        scheduleReplay();
      } else {
        window.globalIntervalStats[window.intervalToGuess].bad2 +=
          window.errorIntervalCounter;
        window.intervalToGuess = null;
        window.errorIntervalCounter = 0;
        scheduleNextInterval();
      }
    } else {
      window.globalIntervalStats[window.intervalToGuess].bad2 += 1;
      window.intervalToGuess = null;
      window.errorIntervalCounter = 0;
      scheduleNextInterval();
    }
  }

  //wrapper do PRZYCISKU I CHECKBOXA INTERWAŁU
  const intervalButtonWrapper = document.createElement('label');
  intervalButtonWrapper.style.whiteSpace = 'nowrap'; //żeby nie wyjeżdżało
  intervalButtonWrapper.setAttribute('for', `intervalCheckbox-${index}`);

  const intervalCheckbox = document.createElement('input');
  intervalCheckbox.type = 'checkbox';
  intervalCheckbox.classList.add('interval-checkbox');
  intervalCheckbox.id = `intervalCheckbox-${index}`;
  intervalCheckbox.checked = 'true';
  intervalCheckbox.addEventListener('change', (event) => {
    let intervalCheckedCount = 0;
    window.checkedIntervals = '';

    // uaktualniej wartość globalną window.checkedIntervals zgodnie ze stanem checkboxów
    for (let i = 0; i < 13; i++) {
      const checkbox = document.getElementById(`intervalCheckbox-${i}`);
      if (checkbox && checkbox.checked) {
        intervalCheckedCount++;
        window.checkedIntervals += '1';
      } else {
        window.checkedIntervals += '0';
      }
    }

    // czy zaznaczone mniej niż 2 (jeden ma być zawsze załączony!)
    if (intervalCheckedCount < 2) {
      event.preventDefault();
      intervalCheckbox.checked = true;
      alert('Zostaw zaznaczone przynajmniej dwa interwały.');
      return;
    }

    // uaktualnij stan przycisków zgodnie z wartością window.checkedIntervals
    updateCheckedIntervals(true);
  });

  //dołącz do wrappera
  intervalButtonWrapper.appendChild(intervalButton);
  intervalButtonWrapper.appendChild(intervalCheckbox);

  return intervalButtonWrapper;
}

//ułóż przyciski na tarczy

const arrangeButtonsInDoubleClock = (container, radius1, radius2) => {
  const collectChildren = (container, mainButton) => {
    const firstChildren = [];
    const secondChildren = [];
    Array.from(container.children).forEach((child) => {
      if (child === mainButton) return; // Skip mainButton
      const [first, second] = child.children;
      if (first) firstChildren.push(first);
      if (second) secondChildren.push(second);
    });
    return { firstChildren, secondChildren };
  };

  const arrangeCircle = (elements, radius, centerX, centerY) => {
    const angleIncrement = 360 / elements.length;
    elements.forEach((element, index) => {
      const angle = (index * angleIncrement - 90) * (Math.PI / 180); // Radians
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const elementWidth =
        element.offsetWidth ||
        parseInt(window.getComputedStyle(element).width, 10);
      const elementHeight =
        element.offsetHeight ||
        parseInt(window.getComputedStyle(element).height, 10);

      element.style.left = `${(x - elementWidth) / 2}px`;
      element.style.top = `${(y - elementHeight) / 2}px`;
    });
  };

  //ustal parametry rodzica do pozycjonowania przycisków
  const { firstChildren, secondChildren } = collectChildren(
    container,
    mainButton
  );
  const { width, height, left, top } = container.getBoundingClientRect();
  let centerX = width;
  let centerY = height;

  arrangeCircle(firstChildren, radius2, centerX, centerY);
  arrangeCircle(secondChildren, radius1, centerX, centerY);
};

//dodaj dwa przyciski łukowe (widoczne po kliknięciu play)
function addArcSegmentWithMirror(
  parentContainer,
  cx,
  cy,
  r,
  startAngle,
  endAngle,
  strokeWidth,
  text,
  mirroredText
) {
  const svgNS = 'http://www.w3.org/2000/svg';

  // Helper function to create an arc
  function createArcPath(
    startAngle,
    endAngle,
    color,
    text,
    btn_label,
    onClickCallback
  ) {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    // Calculate start and end points
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    // Determine the large arc flag
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    // Create the SVG path data
    const pathData = `M ${x1},${y1} A ${r},${r} 0 ${largeArcFlag} 1 ${x2},${y2}`;

    // Create the arc path
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('id', btn_label);
    path.setAttribute('class', 'btn-sector');
    path.setAttribute('stroke', color);
    path.setAttribute('d', pathData);
    path.setAttribute('stroke-width', strokeWidth);
    path.setAttribute('pointer-events', 'auto');
    path.addEventListener('click', onClickCallback);

    // Add the text centered on the arc
    const midAngle = (startRad + endRad) / 2;
    const textRadius = r; // Adjust text position to middle of arc
    const textX = cx + textRadius * Math.cos(midAngle);
    const textY = cy + textRadius * Math.sin(midAngle);

    const textElement = document.createElementNS(svgNS, 'text');
    textElement.setAttribute('class', 'btn-sector-text');
    textElement.setAttribute('x', textX);
    textElement.setAttribute('y', textY);
    textElement.setAttribute('text-anchor', 'middle');
    textElement.setAttribute('dominant-baseline', 'middle');
    textElement.setAttribute('fill', 'black');
    textElement.setAttribute('pointer-events', 'auto');
    textElement.textContent = text;

    textElement.addEventListener('mouseover', () => {
      path.setAttribute('stroke', 'blue');
    });

    textElement.addEventListener('mouseout', () => {
      path.setAttribute('stroke', color);
    });

    textElement.addEventListener('click', onClickCallback);

    return { path, textElement };
  }

  const padding = parseFloat(strokeWidth) / 2;

  const svgSize = (r + padding) * 2;

  //utwórz kontener SVG
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', svgSize);
  svg.setAttribute('height', svgSize);

  // centruj SVG
  svg.style.position = 'absolute';
  svg.style.top = '50%';
  svg.style.left = '50%';
  svg.style.transform = 'translate(-50%, -50%)';
  svg.style.zIndex = -'-9999';
  svg.style.pointerEvents = 'none';

  // srodek SVG - obliczenia
  const viewBoxX = cx - r - padding;
  const viewBoxY = cy - r - padding;
  const viewBoxSize = svgSize;

  svg.setAttribute(
    'viewBox',
    `${viewBoxX} ${viewBoxY} ${viewBoxSize} ${viewBoxSize}`
  );

  // DODAJ ŁUK
  const { path: originalArc, textElement: originalText } = createArcPath(
    startAngle,
    endAngle,
    'orange',
    text,
    'btn_Repeat',
    () => {
      window.errorIntervalCounter++;
      scheduleReplay();
      refreshCharts(false);
    }
  );
  svg.appendChild(originalArc);
  svg.appendChild(originalText);

  // DODAJ ŁUK LUSTRZANY
  const mirroredStartAngle = 180 - endAngle;
  const mirroredEndAngle = 180 - startAngle;
  const { path: mirroredArc, textElement: mirroredTextElement } = createArcPath(
    mirroredStartAngle,
    mirroredEndAngle,
    'red',
    mirroredText,
    'btn_Skip',
    () => {
      window.globalIntervalStats[window.intervalToGuess].bad2 += 1;
      window.intervalToGuess = null;
      window.errorIntervalCounter = 0;
      scheduleNextInterval();
      refreshCharts(true);
    }
  );

  svg.appendChild(mirroredArc);
  svg.appendChild(mirroredTextElement);

  window.svg = svg;

  parentContainer.appendChild(svg);
}
