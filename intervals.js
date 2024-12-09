// intervalHandler.js

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

function refreshCharts() {
  const numericStatsContainer = document.getElementById('numStatsDiv');
  numericStatsContainer.innerHTML = ''; // Clear the current chart
  numericStatsContainer.appendChild(drawNumericStatContainer());
  const chartStatsDiv = document.getElementById('chartStatsDiv');
  chartStatsDiv.innerHTML = ''; // Clear the current chart
  chartStatsDiv.appendChild(
    drawStatChart(
      window.globalIntervalStats,
      13,
      chartStatsDiv.offsetWidth * 0.9,
      chartStatsDiv.offsetHeight * 0.9
    )
  );
}

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

  // SET SOUND ORDER
  window.soundOrder = selectOrRandomize(window.soundControl.interval);
  if (window.soundOrder === 'up' && window.note2 <= window.note1) {
    [window.note1, window.note2] = [window.note2, window.note1]; // Swap
  } else if (window.soundOrder === 'down' && window.note1 <= window.note2) {
    [window.note1, window.note2] = [window.note2, window.note1]; // Swap
  }

  // SET SOUND LENGTH
  window.soundLength = selectOrRandomize(
    window.soundControl.length,
    window.lengthAndDelayValues
  );

  // SET SOUND DELAY
  window.soundDelay = selectOrRandomize(
    window.soundControl.delay,
    window.lengthAndDelayValues
  );
}

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

function PlayInterval(note1, note2) {
  const firstNote = notes[note1];
  const secondNote = notes[note2];
  tones.volume = 20 / 100; //
  tones.release = window.soundLength * 400;
  tones.sustain = 0;
  if (window.soundOrder === 'both') {
    keys[firstNote].dispatchEvent(new MouseEvent('mousedown'));
    keys[secondNote].dispatchEvent(new MouseEvent('mousedown'));
  } else {
    keys[firstNote].dispatchEvent(new MouseEvent('mousedown'));
    setTimeout(() => {
      keys[secondNote].dispatchEvent(new MouseEvent('mousedown'));
    }, 300 + (window.soundDelay - 1) * 500); //300 800 1100 - dopasowane do długości dźwięków
  }
}

function createMainPlayIntervalButton() {
  const mainExcerciseButton = document.createElement('div');
  mainExcerciseButton.id = 'mainButton';

  // Create the circle
  const circle = document.createElement('div');
  circle.id = 'mainButton-circle';
  mainExcerciseButton.appendChild(circle);

  // Create the triangle
  const triangle = document.createElement('div');
  triangle.id = 'mainButton-triangle';
  circle.appendChild(triangle);

  // Create the square
  const square = document.createElement('div');
  square.id = 'mainButton-square';
  circle.appendChild(square);

  let blinkInterval;
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

function scheduleReplay() {
  setTimeout(() => {
    PlayInterval(window.note1, window.note2); // Replay the current interval
  }, 700);
}

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

function createIntervalButton(index, label) {
  const intervalButton = document.createElement('button');
  intervalButton.textContent = label;
  intervalButton.id = `intervalButton-${index}`;
  intervalButton.classList.add('interval-button');

  // Add event listener to check if the button's index matches intervalToGuess
  intervalButton.addEventListener('mouseup', () => {
    intervalButton.style.backgroundColor = ''; // Revert to default background on mouseup
  });

  intervalButton.addEventListener('mousedown', function eventMouseDown() {
    if (window.intervalToGuess === null) {
      [window.note1, window.note2] = pickRandomInterval(0, 12, 20, index);
      applySoundSettings();
      PlayInterval(window.note1, window.note2);
      return;
    }
    // Determine the color based on the condition
    const color = index === window.intervalToGuess ? 'lawngreen' : 'red';

    // Immediately set the color without transition
    intervalButton.style.transition = 'none'; // Disable any existing transitions
    intervalButton.style.backgroundColor = color;

    if (index === window.intervalToGuess) {
      handleCorrectGuess(index);
    } else {
      handleIncorrectGuess(index);
    }

    refreshCharts();
    // Use a short timeout to allow re-rendering before applying transition
    setTimeout(() => {
      intervalButton.style.transition = 'background-color 1s ease-in'; // Add transition
      intervalButton.style.backgroundColor = ''; // Reset to the default color
    }, 10); // Slight delay to ensure the browser registers the immediate style change
  });
  window.refreshCharts = refreshCharts;

  function handleCorrectGuess(index) {
    window.globalIntervalStats[index].good += 1;
    window.globalIntervalStats[window.intervalToGuess].bad2 +=
      window.errorIntervalCounter;
    window.errorIntervalCounter = 0;
    window.intervalToGuess = null;
    scheduleNextInterval();
  }

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

  const intervalButtonWrapper = document.createElement('div');
  // Create the checkbox
  const intervalCheckbox = document.createElement('input');
  intervalCheckbox.type = 'checkbox';
  intervalCheckbox.classList.add('interval-checkbox');
  intervalCheckbox.id = `intervalCheckbox-${index}`;
  intervalCheckbox.checked = 'true';
  intervalCheckbox.addEventListener('change', (event) => {
    let intervalCheckedCount = 0;
    window.checkedIntervals = '';

    // First pass: Calculate intervalCheckedCount and update window.checkedIntervals
    for (let i = 0; i < 13; i++) {
      const checkbox = document.getElementById(`intervalCheckbox-${i}`);
      if (checkbox && checkbox.checked) {
        intervalCheckedCount++;
        window.checkedIntervals += '1';
      } else {
        window.checkedIntervals += '0';
      }
    }

    // Check if fewer than two checkboxes are checked
    if (intervalCheckedCount < 2) {
      event.preventDefault(); // Prevent the change
      intervalCheckbox.checked = true; // Force rechecking
      alert('Zostaw zaznaczone przynajmniej dwa interwały.');
      return; // Exit to prevent disabling any buttons
    }

    // Second pass: Enable/disable buttons based on checkbox states
    updateCheckedIntervals(true);
  });

  // Create a wrapper for button and checkbox
  intervalButtonWrapper.appendChild(intervalButton);
  intervalButtonWrapper.appendChild(intervalCheckbox);

  intervalButtonWrapper.style.whiteSpace = 'nowrap'; //żeby nie wyjeżdżało

  // Add the wrapper to the buttonRow
  return intervalButtonWrapper;
}

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

  // Extract container center and child groups
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

  // Create the SVG container
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', svgSize);
  svg.setAttribute('height', svgSize);

  // Use `transform: translate` to center the SVG
  svg.style.position = 'absolute';
  svg.style.top = '50%';
  svg.style.left = '50%';
  svg.style.transform = 'translate(-50%, -50%)';
  svg.style.zIndex = -'-9999';
  svg.style.pointerEvents = 'none';

  // Calculate SVG size and offsets for centering

  // Center the SVG viewBox
  const viewBoxX = cx - r - padding; //- padding;
  const viewBoxY = cy - r - padding; //- padding;
  const viewBoxSize = svgSize;

  // Create the SVG container
  svg.setAttribute('width', svgSize);
  svg.setAttribute('height', svgSize);
  svg.setAttribute(
    'viewBox',
    `${viewBoxX} ${viewBoxY} ${viewBoxSize} ${viewBoxSize}`
  );

  // Add original arc
  const { path: originalArc, textElement: originalText } = createArcPath(
    startAngle,
    endAngle,
    'orange',
    text,
    'btn_Repeat',
    () => {
      // window.globalIntervalStats[window.intervalToGuess].bad2++;
      window.errorIntervalCounter++;
      scheduleReplay();
      refreshCharts(false);
    }
  );
  svg.appendChild(originalArc);
  svg.appendChild(originalText);

  // Add vertically mirrored arc
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

  // Append the SVG to the parent container
  parentContainer.appendChild(svg);
}
