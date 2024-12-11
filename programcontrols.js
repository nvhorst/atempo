//GŁÓWNA FUNKCJA BUDUJĄCA STEROWANIE Z TABELEK
function elementControlContainer() {
  const container = document.createElement('div');
  container.id = 'elementControlContainer';

  Object.keys(window.soundControl).forEach((controlType) => {
    const controlSubContainer = document.createElement('div');
    controlSubContainer.classList.add('control-subContainer');
    controlSubContainer.id = controlType;

    Object.keys(window.soundControl[controlType]).forEach((option) => {
      const checkboxId = `${controlType}-${option}`;

      // Create div and checkbox
      const controlButton = document.createElement('div');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('control-checkbox');
      checkbox.dataset.group = controlType;
      checkbox.dataset.option = option;
      checkbox.checked = window.soundControl[controlType][option] === 1; // Set initial state
      checkbox.id = checkboxId;

      controlButton.innerHTML = `<label for="${checkboxId}" class="control-button-label">${window.controlIcons[controlType][option]}</label>`;
      controlButton.classList.add('control-button');
      controlButton.prepend(checkbox);

      controlButton.addEventListener('click', (event) => {
        if (event.target !== checkbox && event.target.tagName !== 'LABEL') {
          event.preventDefault();
          checkbox.checked = !checkbox.checked; // Toggle checkbox state
        }

        window.soundControl[controlType][option] = checkbox.checked ? 1 : 0;

        // Ensure at least one checkbox remains selected in the group
        const groupCheckboxes = Array.from(
          document.querySelectorAll(`input[data-group="${controlType}"]`)
        );
        const selectedCount = groupCheckboxes.filter((cb) => cb.checked).length;

        if (selectedCount === 0) {
          // GDY ZOSTAŁ JEDEN
          checkbox.checked = true;
          window.soundControl[controlType][option] = 1;
        }
        // console.log(`${option} toggled to:`, checkbox.checked);
        // console.log('Current group state:', window.soundControl[controlType]);
      });

      controlSubContainer.appendChild(controlButton);
    });

    container.appendChild(controlSubContainer);
  });

  return container;
}

//DEZAKTYWACJA PRZYCISKÓW (ODZNACZENIE)
function disableElementCSS(container) {
  // Disable interaction visually
  container.style.pointerEvents = 'none';
  container.style.opacity = '0.5';

  const inputs = container.querySelectorAll('input');
  inputs.forEach((input) => {
    input.setAttribute('disabled', 'true');
  });
}

//REAKTYWACJA PRZYCISKÓW
function enableElementCSS(container) {
  container.style.pointerEvents = '';
  container.style.opacity = '1';

  const inputs = container.querySelectorAll('input');
  inputs.forEach((input) => {
    input.removeAttribute('disabled');
  });
}

//MAKSYMALNA ILOŚĆ BŁĘDÓW
function elementMaxError(init) {
  const container = document.createElement('div');
  container.id = 'elementMaxError';

  const maxErrorLabel = document.createElement('label');
  maxErrorLabel.textContent = '\u274c';
  maxErrorLabel.className = 'control-subContainer-label';
  maxErrorLabel.setAttribute('for', 'maxErrorSelect');
  container.appendChild(maxErrorLabel);

  //dropdown
  const select = document.createElement('select');
  select.id = 'maxErrorSelect';
  select.className = 'dropdown-select';

  //wybory
  ['0', '1', '2', '3', '4'].forEach((labelText, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = labelText;
    if (i === init) option.selected = true;
    select.appendChild(option);
  });

  //logika
  select.addEventListener('change', () => {
    window.maxError = select.value;
    window.refreshCharts();
  });

  container.appendChild(select);
  window.maxError = init;

  return container;
}

//GŁOŚNOŚĆ DŹWIĘKU
function elementSoundVolume(init) {
  const container = document.createElement('div');
  container.id = 'elementSoundVolume';

  //etykieta
  const soundVolumeLabel = document.createElement('label');
  soundVolumeLabel.innerHTML = `<img id="svg-icon-speaker" src="../svg/speaker.svg" alt="Głośność" />`;
  soundVolumeLabel.className = 'control-subContainer-label';
  soundVolumeLabel.setAttribute('for', 'soundVolumeSelect');
  container.appendChild(soundVolumeLabel);

  //dropdown
  const select = document.createElement('select');
  select.id = 'soundVolumeSelect';
  select.className = 'dropdown';

  //wybory
  ['20%', '40%', '60%', '80%', '100%'].forEach((labelText, i) => {
    console.log('i=', i);
    const option = document.createElement('option');
    option.value = (i + 1) * 20; //numer
    option.textContent = labelText; //tekst
    if ((i + 1) * 20 === init) option.selected = true;
    select.appendChild(option);
  });

  container.appendChild(select);

  //logika
  select.addEventListener('change', () => {
    window.soundVolume = select.value;
  });

  window.soundVolume = init;

  return container;
}
