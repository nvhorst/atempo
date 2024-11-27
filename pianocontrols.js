function elementOrderSelect(init, P = 15) {
  const container = document.createElement('div');
  container.id = 'elementOrderSelect';

  const orderLabel = document.createElement('label');
  orderLabel.textContent = 'Kierunek';
  orderLabel.className = 'main-label';
  orderLabel.style.marginBottom = `${P}px`; // Apply spacing from parameter P
  container.appendChild(orderLabel);

  const options = [
    { value: '1', label: 'w górę' },
    { value: '2', label: 'w dół' },
    { value: '3', label: 'do góry i w dół' },
  ];

  options.forEach((option) => {
    const radioContainer = document.createElement('div');
    radioContainer.className = 'radio-container';
    radioContainer.style.marginBottom = `${P}px`; // Optional, override P dynamically

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'orderSelect';
    radio.value = option.value;
    radio.id = `orderSelect-${option.value}`;
    radio.className = 'radio-button';

    if (option.value === init.toString()) radio.checked = true;

    const label = document.createElement('label');
    label.textContent = option.label;
    label.setAttribute('for', `orderSelect-${option.value}`);
    label.className = 'radio-label';

    radioContainer.appendChild(radio);
    radioContainer.appendChild(label);
    container.appendChild(radioContainer);
  });

  container.querySelectorAll('input[name="orderSelect"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      window.orderSelect = radio.value;
    });
  });

  window.orderSelect = init.toString();
  return container;
}

// DŁUGOŚĆ DŹWIĘKU
function elementSoundLength(init, P = 15) {
  const container = document.createElement('div');
  container.id = 'elementSoundLength';

  const lengthLabel = document.createElement('label');
  lengthLabel.textContent = 'Długość dźwięku';
  lengthLabel.className = 'main-label';
  lengthLabel.style.marginBottom = `${P}px`;
  container.appendChild(lengthLabel);

  ['krótki', 'średni', 'długi'].forEach((labelText, i) => {
    const radioContainer = document.createElement('div');
    radioContainer.className = 'radio-container';
    radioContainer.style.marginBottom = `${P}px`;

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'soundLength';
    radio.value = i + 1;
    radio.id = `soundLength-${i + 1}`;
    radio.className = 'radio-button';

    if (i + 1 === init) radio.checked = true;

    const label = document.createElement('label');
    label.textContent = labelText;
    label.setAttribute('for', `soundLength-${i + 1}`);
    label.className = 'radio-label';

    radioContainer.appendChild(radio);
    radioContainer.appendChild(label);
    container.appendChild(radioContainer);
  });

  container.querySelectorAll('input[name="soundLength"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      window.soundLength = radio.value;
    });
  });

  window.soundLength = init;
  return container;
}

// ODSTĘP DO DRUGIEGO DŹWIĘKU
function elementSoundDelay(init, P = 15) {
  const container = document.createElement('div');
  container.id = 'elementSoundDelay';

  const durationLabel = document.createElement('label');
  durationLabel.textContent = 'Przerwa';
  durationLabel.className = 'main-label';
  durationLabel.style.marginBottom = `${P}px`;
  container.appendChild(durationLabel);

  ['bez (dwudźwięk)', 'krótka', 'średnia', 'długa'].forEach((labelText, i) => {
    const radioContainer = document.createElement('div');
    radioContainer.className = 'radio-container';
    radioContainer.style.marginBottom = `${P}px`;

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'soundDelay';
    radio.value = i;
    radio.id = `soundDelay-${i}`;
    radio.className = 'radio-button';

    if (i === init) radio.checked = true;

    const label = document.createElement('label');
    label.textContent = labelText;
    label.setAttribute('for', `soundDelay-${i}`);
    label.className = 'radio-label';

    radioContainer.appendChild(radio);
    radioContainer.appendChild(label);
    container.appendChild(radioContainer);
  });

  container.querySelectorAll('input[name="soundDelay"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      window.soundDelay = parseInt(radio.value, 10);
    });
  });

  window.soundDelay = init;
  return container;
}

function disableElementCSS(container) {
  // Disable interaction visually
  container.style.pointerEvents = 'none';
  container.style.opacity = '0.5';

  // Disable all input elements within the container
  const inputs = container.querySelectorAll('input');
  inputs.forEach((input) => {
    input.setAttribute('disabled', 'true');
  });
}

function enableElementCSS(container) {
  // Re-enable interaction visually
  container.style.pointerEvents = '';
  container.style.opacity = '1';

  // Enable all input elements within the container
  const inputs = container.querySelectorAll('input');
  inputs.forEach((input) => {
    input.removeAttribute('disabled');
  });
}

function elementMaxError(init, P = 15) {
  const container = document.createElement('div');
  container.id = 'elementMaxError';

  const maxErrorLabel = document.createElement('label');
  maxErrorLabel.textContent = 'Ilość błędów';
  maxErrorLabel.className = 'main-label';
  maxErrorLabel.style.marginBottom = `${P}px`;
  container.appendChild(maxErrorLabel);

  ['0', '1', '2', '3', '4', '5'].forEach((labelText, i) => {
    const radioContainer = document.createElement('div');
    radioContainer.className = 'radio-container';
    radioContainer.style.marginBottom = `${P}px`;

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'maxError';
    radio.value = i;
    radio.id = `maxError-${i}`;
    radio.className = 'radio-button';

    if (i === init) radio.checked = true;

    const label = document.createElement('label');
    label.textContent = labelText;
    label.setAttribute('for', `maxError-${i}`);
    label.className = 'radio-label';

    radioContainer.appendChild(radio);
    radioContainer.appendChild(label);
    container.appendChild(radioContainer);
  });

  container.querySelectorAll('input[name="maxError"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      window.maxError = radio.value;
      window.refreshCharts();
    });
  });

  window.maxError = init;
  return container;
}

// ECHO
function elementEcho(init) {
  const container = document.createElement('div');
  container.id = 'elementEcho';

  const echoCheckbox = document.createElement('input');
  echoCheckbox.type = 'checkbox';
  echoCheckbox.className = 'checkbox';
  echoCheckbox.value = init;
  echoCheckbox.id = 'echoCheckbox'; // Assign an id to the checkbox

  const echoLabel = document.createElement('label');
  echoLabel.textContent = 'Echo';
  echoLabel.className = 'main-label';
  echoLabel.setAttribute('for', 'echoCheckbox'); // Associate label with checkbox using 'for'

  container.appendChild(echoCheckbox); // Append checkbox first
  container.appendChild(echoLabel); // Append label second

  window.Echo = echoCheckbox;
  return container;
}

function elementSoundVolume(init) {
  const container = document.createElement('div');
  container.id = 'elementSoundVolume';

  const volumeLabel = document.createElement('label');
  volumeLabel.textContent = 'Głośność';
  volumeLabel.className = 'main-label';

  const volumeValue = document.createElement('span');
  volumeValue.className = 'range-value';

  const soundVolume = document.createElement('input');
  soundVolume.type = 'range';
  soundVolume.className = 'range-slider';
  soundVolume.min = 0;
  soundVolume.max = 100;
  soundVolume.step = 10;
  soundVolume.value = init;

  soundVolume.addEventListener('input', () => {
    volumeValue.textContent = soundVolume.value;
  });

  volumeValue.textContent = soundVolume.value;

  container.appendChild(volumeLabel);
  container.appendChild(soundVolume);
  container.appendChild(volumeValue);

  window.soundVolume = soundVolume;
  return container;
}
