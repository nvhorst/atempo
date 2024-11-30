function elementOrderSelect(init, P = 15) {
  const container = document.createElement('div');
  container.id = 'elementOrderSelect';

  const options = [
    { value: '1', label: '\u2197' }, // 2197
    { value: '2', label: '\u2198' }, // 2198
    { value: '3', label: '\u2928' }, // 2928
  ];

  options.forEach((option) => {
    const radioContainer = document.createElement('div');
    radioContainer.className = 'radio-container';
    radioContainer.style.marginBottom = `${P}px`;

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
    label.className = 'radio-label-note';

    radioContainer.appendChild(radio);
    radioContainer.appendChild(label);
    container.appendChild(radioContainer);
  });

  // Store reference for enable/disable functionality
  window.orderSelectContainer = container;

  window.disableOrderSelect = () => {
    container.style.pointerEvents = 'none'; // Disable all interactivity
    container.style.opacity = '0.5'; // Dim the container visually
  };

  window.enableOrderSelect = () => {
    container.style.pointerEvents = ''; // Re-enable interactivity
    container.style.opacity = '1'; // Restore original appearance
  };

  window.orderSelect = init.toString();
  return container;
}

function elementSoundLength(init, P = 15) {
  const container = document.createElement('div');
  container.id = 'elementSoundLength';

  const svgFilesDefault = ['/svg/n16u.svg', '/svg/n8u.svg', '/svg/n4u.svg'];
  const svgFilesAlternative = ['/svg/n16b.svg', '/svg/n8b.svg', '/svg/n4b.svg'];

  const imgElements = []; // Store image elements for dynamic updates

  svgFilesDefault.forEach((svgPath, i) => {
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
    label.setAttribute('for', `soundLength-${i + 1}`);
    label.className = 'radio-label-note';

    const img = document.createElement('img');
    img.src = svgPath;
    img.alt = `${i + 1}`;
    img.className = 'note-icon';
    img.style.height = '2rem'; // Default height
    label.appendChild(img);

    imgElements.push(img);

    radioContainer.appendChild(radio);
    radioContainer.appendChild(label);
    container.appendChild(radioContainer);
  });

  container.querySelectorAll('input[name="soundLength"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      window.soundLength = radio.value;
    });
  });

  window.updateSoundLengthIcons = (isAlternative) => {
    imgElements.forEach((img, i) => {
      img.src = isAlternative ? svgFilesAlternative[i] : svgFilesDefault[i];
      img.style.height = isAlternative ? '4rem' : '2rem';
    });
  };

  window.soundLength = init;
  return container;
}

function elementSoundDelay(init, P = 15) {
  const container = document.createElement('div');
  container.id = 'elementSoundDelay';

  [
    String.fromCodePoint(119103),
    String.fromCodePoint(119102),
    String.fromCodePoint(119101),
    'X',
  ].forEach((labelText, i) => {
    const radioContainer = document.createElement('div');
    radioContainer.className = 'radio-container';
    radioContainer.style.marginBottom = `${P}px`;

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'soundDelay';
    radio.value = i;
    radio.id = `soundDelay-${i}`;
    radio.className = 'radio-button';

    if ((i + 1) % 4 === init) radio.checked = true;

    const label = document.createElement('label');
    label.textContent = labelText;
    label.setAttribute('for', `soundDelay-${i}`);
    label.className = 'radio-label-note';

    radioContainer.appendChild(radio);
    radioContainer.appendChild(label);
    container.appendChild(radioContainer);
  });

  container.querySelectorAll('input[name="soundDelay"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      window.soundDelay = (parseInt(radio.value) + 1) % 4;
      console.log('window.soundDelay=', window.soundDelay);
      const isAlternative = radio.id === 'soundDelay-3'; // Check if "X!" is selected
      window.updateSoundLengthIcons(isAlternative);
      if (isAlternative) {
        window.disableOrderSelect(); // Disable entire OrderSelect
      } else {
        window.enableOrderSelect(); // Enable entire OrderSelect
      }
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

//MAKSYMALNA ILOŚĆ BŁĘDÓW
function elementMaxError(init, P = 15) {
  const container = document.createElement('div');
  container.id = 'elementMaxError';

  const maxErrorLabel = document.createElement('label');
  maxErrorLabel.textContent = '\u274c';
  maxErrorLabel.className = 'main-label';
  maxErrorLabel.style.marginBottom = `${P}px`;
  container.appendChild(maxErrorLabel);

  ['0', '1', '2', '3', '4'].forEach((labelText, i) => {
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

function elementSoundVolume(init, P = 15) {
  const container = document.createElement('div');
  container.id = 'elementSoundVolume';

  const soundVolumeLabel = document.createElement('label');
  soundVolumeLabel.innerHTML = `<img id="icon-speaker" src="../svg/speaker.svg" alt="Głośność" />`;
  soundVolumeLabel.className = 'main-label';
  soundVolumeLabel.style.marginBottom = `${P}px`;
  container.appendChild(soundVolumeLabel);

  ['20%', '40%', '60%', '80%', '100%'].forEach((labelText, i) => {
    const radioContainer = document.createElement('div');
    radioContainer.className = 'radio-container';
    radioContainer.style.marginBottom = `${P}px`;

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'soundVolume';
    radio.value = (i + 1) * 20;
    radio.id = `soundVolume-${i}`;
    radio.className = 'radio-button';

    if ((i + 1) * 20 === init) radio.checked = true;

    const label = document.createElement('label');
    label.textContent = labelText;
    label.setAttribute('for', `soundVolume-${i}`);
    label.className = 'radio-label';

    radioContainer.appendChild(radio);
    radioContainer.appendChild(label);
    container.appendChild(radioContainer);
  });
  container.querySelectorAll('input[name="soundVolume"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      window.soundVolume = radio.value;
      console.log('window.soundVolume=', window.soundVolume);
    });
    window.soundVolume = init;
  });
  return container;
}
