function drawStatChart(intervalStats, maxX, maxY) {
  const maxValue = Math.max(
    ...intervalStats.map((stat) => Math.max(stat.good, stat.bad1, stat.bad2))
  );
  //USTAW SKALĘ WYKRESU
  let baseUnit = maxY / 27;
  console.log('maxX=', maxX);
  // console.log('baseUnit=', baseUnit);
  // console.log('maxX=', maxX);
  // console.log('maxY=', maxY);
  const statTopSpacing = baseUnit; // Add spacing above the highest grid line
  const statChartHeight = baseUnit * 25; // Fixed height for the chart
  const statMinGridSpacing = baseUnit * 2; // Minimum spacing between grid lines
  const statGridLineSpacing = (statChartHeight - statTopSpacing) / maxValue;

  //USTAW CO ILE POWINNA BYĆ JEDNOSTKA
  const skipFactor =
    statGridLineSpacing < statMinGridSpacing
      ? Math.ceil(statMinGridSpacing / statGridLineSpacing)
      : 1;
  const statNumGridLines = maxValue > 0 ? Math.ceil(maxValue / skipFactor) : 0;

  const statChartContainer = document.createElement('div');
  statChartContainer.id = 'stat-chart-container';
  statChartContainer.style.width = maxX;
  // statChartContainer.style.height = maxY * 0.9;

  const statGridContainer = document.createElement('div');
  statGridContainer.id = 'stat-grid-container';

  const statLabelContainer = document.createElement('div');
  statLabelContainer.id = 'stat-label-container';

  statChartContainer.appendChild(statGridContainer);
  statChartContainer.appendChild(statLabelContainer);

  const isGlobalEmpty = window.globalIntervalStats.every(
    (item) => item.good === 0 && item.bad1 === 0 && item.bad2 === 0
  );
  if (isGlobalEmpty) {
    return statChartContainer;
  }

  for (let i = 0; i <= statNumGridLines; i++) {
    if (i * skipFactor > maxValue) continue;
    const statGridValue = i * skipFactor;

    const statGridLine = document.createElement('div');
    statGridLine.classList.add('stat-grid-line');

    const statGridPosition =
      ((statChartHeight - baseUnit * 2 - statTopSpacing) / maxValue) *
      statGridValue;
    statGridLine.style.bottom = `${statGridPosition}px`;
    statGridContainer.appendChild(statGridLine);

    // Add label only if value is not 0
    if (i !== 0) {
      const gridLabel = document.createElement('div');
      gridLabel.classList.add('stat-grid-label');
      gridLabel.style.bottom = `${statGridPosition}px`;
      gridLabel.textContent = statGridValue;
      statGridContainer.appendChild(gridLabel);
    }
  }

  intervalStats.forEach((stat, i) => {
    const intervalGroup = document.createElement('div');
    intervalGroup.classList.add('stat-interval-group');

    const intervalArea = document.createElement('div');
    intervalArea.classList.add('stat-interval-area');

    const scaleFactor =
      maxValue > 0
        ? (statChartHeight - 2 * baseUnit - statTopSpacing) / maxValue
        : 0;
    const goodHeight = stat.good * scaleFactor;
    const bad1Height = stat.bad1 * scaleFactor;
    const bad2Height = stat.bad2 * scaleFactor;

    const goodBar = document.createElement('div');
    goodBar.classList.add('stat-bar', 'stat-good-bar');
    goodBar.style.height = `${goodHeight}px`;
    goodBar.title = `${stat.good}`;
    intervalArea.appendChild(goodBar);

    const bad1Bar = document.createElement('div');
    bad1Bar.classList.add('stat-bar', 'stat-bad1-bar');
    bad1Bar.style.height = `${bad1Height}px`;
    bad1Bar.title = `${stat.bad1}`;
    intervalArea.appendChild(bad1Bar);

    const bad2Bar = document.createElement('div');
    bad2Bar.classList.add('stat-bar', 'stat-bad2-bar');
    bad2Bar.style.height = `${bad2Height}px`;
    bad2Bar.title = `${stat.bad2}`;
    intervalArea.appendChild(bad2Bar);
    intervalGroup.appendChild(intervalArea);

    const label = document.createElement('div');
    label.classList.add('stat-interval-label');
    label.textContent = window.buttonLabels[i];
    statLabelContainer.appendChild(label);
    statGridContainer.appendChild(intervalGroup);
  });

  return statChartContainer;
}

function drawNumericStatContainer() {
  const numericStatContainer = document.createElement('div');

  // Create and style each span element
  const totalRight = document.createElement('span');
  const totalWrong = document.createElement('span');
  const totalCount = document.createElement('span');
  const insertBrake = document.createElement('span');
  const totalPercentRight = document.createElement('span');
  const totalIncorrectGuess = document.createElement('span');
  // const mostRight = document.createElement('span');
  // const mostWrong = document.createElement('span');
  // const mostMistaken = document.createElement('span');

  // Set the font size and display style for all spans
  [
    totalRight,
    totalWrong,
    totalCount,
    insertBrake,
    totalPercentRight,
    totalIncorrectGuess,
    // mostRight,
    // mostWrong,
    // mostMistaken,
  ].forEach((span) => {
    numericStatContainer.appendChild(span);
  });

  const totalGood = window.globalIntervalStats.reduce(
    (sum, stat) => sum + stat.good,
    0
  );

  const totalBad2 =
    window.globalIntervalStats.reduce((sum, stat) => sum + stat.bad2, 0) +
    window.errorIntervalCounter; //te o których jeszcze nie wie użytkownik;

  totalRight.innerHTML = `\u{2B50} ${totalGood} (${
    totalBad2 + totalGood > 0
      ? (100 * (totalGood / (totalBad2 + totalGood))).toFixed(0)
      : '---'
  }%)`;
  totalWrong.innerHTML = `\u{1F494} ${totalBad2}`;
  totalCount.innerHTML = `\u{2B50}+\u{1F494} ${totalGood + totalBad2}`;
  insertBrake.innerHTML = '&nbsp';
  totalIncorrectGuess.innerHTML = `\u{274C} ${
    window.errorIntervalCounter > window.maxError
      ? '*'
      : window.errorIntervalCounter
  } / ${window.maxError}`;

  function getIntervalForHighest(field) {
    const maxFieldIndex = window.globalIntervalStats.reduce(
      (maxIndex, stat, index, stats) => {
        return stat[field] > stats[maxIndex][field] ? index : maxIndex;
      },
      0
    );

    return window.globalIntervalStats[maxFieldIndex][field] === 0
      ? '---'
      : window.buttonLabels[maxFieldIndex];
  }

  // mostRight.innerHTML = getIntervalForHighest('good');
  // mostWrong.innerHTML = getIntervalForHighest('bad2');
  // mostMistaken.innerHTML = getIntervalForHighest('bad1');

  return numericStatContainer;
}

function resetIntervalStats() {
  // Reset globalIntervalStats
  window.globalIntervalStats = Array.from(
    { length: window.buttonLabels.length },
    () => ({
      good: 0,
      bad1: 0,
      bad2: 0,
    })
  );
  const numericStatsContainer = document.getElementById('numStatsDiv');
  numericStatsContainer.innerHTML = ''; // Clear the current chart
  numericStatsContainer.appendChild(drawNumericStatContainer());
  numericStatsContainer.appendChild(window.resetButton);

  const chartStatsContainer = document.getElementById('chartStatsDiv');
  chartStatsContainer.innerHTML = ''; // Clear the current chart
  chartStatsContainer.appendChild(drawStatChart(window.globalIntervalStats));
}
