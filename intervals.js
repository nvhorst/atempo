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
  const numericStatsContainer = document.getElementById('numeric-stats');
  numericStatsContainer.innerHTML = ''; // Clear the current chart
  numericStatsContainer.appendChild(drawNumericStatContainer());
  const statsContainer = document.getElementById('stats');
  statsContainer.innerHTML = ''; // Clear the current chart
  statsContainer.appendChild(drawStatChart(window.globalIntervalStats));
}

function pickRandomInterval(rangeMin, rangeMax, condition, max, given = -1) {
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
  switch (condition.toString()) {
    case '1': // Pierwsza liczba mniejsza lub równa drugiej
      return num1 <= num2 ? [num1, num2] : [num2, num1];

    case '2': // Pierwsza liczba większa lub równa drugiej
      return num1 >= num2 ? [num1, num2] : [num2, num1];

    case '3': // Dowolna kolejność
      return [num1, num2];

    default:
      throw new Error('Nieznany warunek. Użyj 1, 2 lub 3.');
  }
}

function PlayInterval(note1, note2) {
  const firstNote = notes[note1];
  const secondNote = notes[note2];

  tones.volume = soundVolume / 100;
  tones.release = soundLength * 400;
  tones.sustain = Echo.checked ? 300 : 0;

  if (soundDelay == 0) {
    keys[firstNote].dispatchEvent(new MouseEvent('mousedown'));
    keys[secondNote].dispatchEvent(new MouseEvent('mousedown'));
  } else {
    keys[firstNote].dispatchEvent(new MouseEvent('mousedown'));
    setTimeout(() => {
      keys[secondNote].dispatchEvent(new MouseEvent('mousedown'));
    }, 300 + (soundDelay - 1) * 500); //300 800 1100 - dopasowane do długości dźwięków
  }
}

function createMainButton() {
  const mainExcerciseButton = document.createElement('div');
  mainExcerciseButton.id = 'mainButton';

  // Create the circle
  const circle = document.createElement('div');
  circle.id = 'circle';
  mainExcerciseButton.appendChild(circle);

  // Create the triangle
  const triangle = document.createElement('div');
  triangle.id = 'triangle';
  circle.appendChild(triangle);

  // Create the square
  const square = document.createElement('div');
  square.id = 'square';
  circle.appendChild(square);

  let blinkInterval;
  window.isPlaying = false;

  // Style the button container
  mainExcerciseButton.style.position = 'relative';
  mainExcerciseButton.style.width = '120px';
  mainExcerciseButton.style.height = mainExcerciseButton.style.width;
  mainExcerciseButton.style.borderRadius = '50%';
  // mainExcerciseButton.style.margin = 'auto 10px';
  mainExcerciseButton.style.cursor = 'pointer'; //

  // Style the circle
  circle.style.position = 'absolute';
  circle.style.width = '100%';
  circle.style.height = '100%';
  circle.style.backgroundColor = '#007bff';
  circle.style.borderRadius = '50%';
  circle.style.border = '0px solid red';
  circle.style.transition = 'background-color 1s';

  // Style the triangle
  triangle.style.position = 'absolute';
  triangle.style.top = '50%';
  triangle.style.left = '55%';
  triangle.style.transform = 'translate(-50%, -50%)';
  triangle.style.width = '0';
  triangle.style.height = '0';
  triangle.style.borderTop = '20px solid transparent';
  triangle.style.borderBottom = '20px solid transparent';
  triangle.style.borderLeft = '35px solid white';

  // Style the square
  square.style.position = 'absolute';
  square.style.top = '50%';
  square.style.left = '50%';
  square.style.transform = 'translate(-50%, -50%)';
  square.style.width = '25px';
  square.style.height = '25px';
  square.style.backgroundColor = 'white';
  square.style.display = 'none'; // Initially hidden

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
window.createMainButton = createMainButton;

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
  intervalButton.classList.add('interval_button');

  // Add event listener to check if the button's index matches intervalToGuess
  intervalButton.addEventListener('mouseup', () => {
    intervalButton.style.backgroundColor = ''; // Revert to default background on mouseup
  });

  intervalButton.addEventListener('mousedown', function eventMouseDown() {
    if (window.intervalToGuess === null) {
      [window.note1, window.note2] = pickRandomInterval(
        0,
        12,
        orderSelect,
        20,
        index
      );
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
  intervalCheckbox.id = `intervalCheckbox-${index}`;
  intervalCheckbox.checked = 'true';
  intervalCheckbox.style.display = 'block'; // Ensure it appears below the button

  // Prevent deselecting if only two checkboxes remain selected
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

  intervalCheckbox.style.margin = 'auto';
  intervalCheckbox.style.display = 'inline-block';
  intervalCheckbox.style.transform = 'scale(2.5)';
  intervalButtonWrapper.style.whiteSpace = 'nowrap'; //żeby nie wyjeżdżało

  // Add the wrapper to the buttonRow
  return intervalButtonWrapper;
}

function arrangeButtonsInDoubleClock(container, radius, spacing) {
  const firstChildren = [];
  const secondChildren = [];

  // Separate first and second children, skipping mainButton
  Array.from(container.children).forEach((child) => {
    if (child === mainButton) return; // Skip mainButton
    const [first, second] = child.children;
    if (first) firstChildren.push(first);
    if (second) secondChildren.push(second);
  });

  const arrangeCircle = (elements, radius, centerX, centerY) => {
    const numElements = elements.length;
    const angleIncrement = 360 / numElements;

    elements.forEach((element, index) => {
      const angle = index * angleIncrement - 90; // Start at "noon"
      const radians = (angle * Math.PI) / 180;

      const x = centerX + radius * Math.cos(radians);
      const y = centerY + radius * Math.sin(radians);

      // Account for the dimensions of the element to ensure proper centering
      const elementWidth = element.offsetWidth;
      const elementHeight = element.offsetHeight;

      element.style.position = 'absolute';
      element.style.left = `${x - elementWidth / 2}px`;
      element.style.top = `${y - elementHeight / 2}px`;
    });
  };

  // Calculate container center
  const containerRect = container.getBoundingClientRect();
  const containerCenterX = containerRect.width / 2;
  const containerCenterY = containerRect.height / 2;

  // Arrange children
  arrangeCircle(
    firstChildren,
    radius + spacing,
    containerCenterX,
    containerCenterY
  );
  arrangeCircle(secondChildren, radius, containerCenterX, containerCenterY);

  // Add a dot to indicate the center
  let theDot = document.getElementById('the_dot');
  if (!theDot) {
    theDot = document.createElement('div');
    theDot.id = 'the_dot';
    theDot.style.position = 'absolute';
    theDot.style.width = '0px';
    theDot.style.height = '0px';
    theDot.style.borderRadius = '50%';
    theDot.style.transform = 'translate(-50%, -50%)'; // Center precisely
    container.appendChild(theDot);
  }
  theDot.style.left = `${containerCenterX}px`;
  theDot.style.top = `${containerCenterY}px`;
}

function adjustContainerSize(container) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  // Collect all second-level children (positioned elements)
  const elements = [];
  Array.from(container.children).forEach((child) => {
    if (child !== mainButton) elements.push(...child.children);
  });

  // Calculate bounding box for elements
  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const relativeLeft = rect.left - containerRect.left;
    const relativeTop = rect.top - containerRect.top;
    const relativeRight = rect.right - containerRect.left;
    const relativeBottom = rect.bottom - containerRect.top;

    minX = Math.min(minX, relativeLeft);
    minY = Math.min(minY, relativeTop);
    maxX = Math.max(maxX, relativeRight);
    maxY = Math.max(maxY, relativeBottom);
  });

  // Adjust container size
  container.style.width = `${maxX - minX}px`;
  container.style.height = `${maxY - minY}px`;

  // Calculate new center
  const newCenterX = (maxX - minX) / 2;
  const newCenterY = (maxY - minY) / 2;

  // Move all second-level children and the dot
  const theDot = document.getElementById('the_dot');
  if (theDot) {
    const oldLeft = parseFloat(theDot.style.left || 0);
    const oldTop = parseFloat(theDot.style.top || 0);
    const offsetX = newCenterX - oldLeft;
    const offsetY = newCenterY - oldTop;

    // Move dot
    theDot.style.left = `${newCenterX}px`;
    theDot.style.top = `${newCenterY}px`;

    // Move elements
    elements.forEach((element) => {
      const currentLeft = parseFloat(element.style.left || 0);
      const currentTop = parseFloat(element.style.top || 0);
      element.style.left = `${currentLeft + offsetX}px`;
      element.style.top = `${currentTop + offsetY}px`;
    });
  }
}

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
    path.setAttribute('class', 'btn_sector');
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
    textElement.setAttribute('class', 'btn_sector_text');
    textElement.setAttribute('x', textX);
    textElement.setAttribute('y', textY);
    textElement.setAttribute('text-anchor', 'middle');
    textElement.setAttribute('dominant-baseline', 'middle');
    textElement.setAttribute('fill', 'black');
    textElement.setAttribute('font-size', '18');
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

  const padding = strokeWidth / 2;
  const svgSize = (r + padding) * 2;

  // Create the SVG container
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', svgSize);
  svg.setAttribute('height', svgSize);
  svg.setAttribute('viewBox', `0 0 ${svgSize} ${svgSize}`);

  // Use `transform: translate` to center the SVG
  svg.style.position = 'absolute';
  svg.style.top = '50%';
  svg.style.left = '50%';
  svg.style.transform = 'translate(-50%, -50%)';
  svg.style.zIndex = -'-9999';
  svg.style.pointerEvents = 'none';

  // Calculate SVG size and offsets for centering

  // Center the SVG viewBox
  const viewBoxX = cx - r - padding;
  const viewBoxY = cy - r - padding;
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

// Call the function to create an arc
// Create an arc between hour 10 (-60°) and hour 14 (+60°), with noon (0°) at the top
