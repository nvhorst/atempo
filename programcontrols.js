function elementControlContainer() {
  const container = document.createElement('div');
  container.id = 'elementControlContainer';

  Object.keys(window.soundControl).forEach((controlType) => {
    const controlSubContainer = document.createElement('div');
    controlSubContainer.classList.add('control-container');
    controlSubContainer.id = controlType;

    Object.keys(window.soundControl[controlType]).forEach((option) => {
      console.log('option=', option);
      const checkboxId = `${controlType}-${option}`;

      // Create div and checkbox
      const controlButton = document.createElement('div');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('checkbox');
      checkbox.dataset.group = controlType;
      checkbox.dataset.option = option;
      checkbox.checked = window.soundControl[controlType][option] === 1; // Set initial state
      checkbox.id = checkboxId;

      // Add content and styles to the div
      controlButton.innerHTML = `<label for="${checkboxId}" class="control-button-label">${window.controlIcons[controlType][option]}</label>`;
      controlButton.classList.add('control-button');

      // Append the checkbox to the div
      controlButton.prepend(checkbox);

      // Add click event to toggle checkbox state only for the div
      controlButton.addEventListener('click', (event) => {
        if (event.target !== checkbox && event.target.tagName !== 'LABEL') {
          event.preventDefault(); // Prevent default behavior for the div
          checkbox.checked = !checkbox.checked; // Toggle checkbox state
        }

        // Update the controlVars object
        window.soundControl[controlType][option] = checkbox.checked ? 1 : 0;

        // Ensure at least one checkbox remains selected in the group
        const groupCheckboxes = Array.from(
          document.querySelectorAll(`input[data-group="${controlType}"]`)
        );
        const selectedCount = groupCheckboxes.filter((cb) => cb.checked).length;

        if (selectedCount === 0) {
          // Undo the deselection if it's the last checkbox
          checkbox.checked = true;
          window.soundControl[controlType][option] = 1;
          // console.log(`Cannot deselect all options in group "${controlType}"`);
        }

        // Log the current state of the checkbox and group
        console.log(`${option} toggled to:`, checkbox.checked);
        console.log('Current group state:', window.soundControl[controlType]);
      });

      controlSubContainer.appendChild(controlButton);
    });

    container.appendChild(controlSubContainer);
  });

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
function elementMaxError(init) {
  const container = document.createElement('div');
  container.id = 'elementMaxError';

  const maxErrorLabel = document.createElement('label');
  maxErrorLabel.textContent = '\u274c';
  maxErrorLabel.className = 'main-label';
  container.appendChild(maxErrorLabel);

  ['0', '1', '2', '3', '4'].forEach((labelText, i) => {
    const radioContainer = document.createElement('div');
    radioContainer.className = 'radio-container';

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

function elementSoundVolume(init) {
  const container = document.createElement('div');
  container.id = 'elementSoundVolume';

  // Create label
  const soundVolumeLabel = document.createElement('label');
  soundVolumeLabel.innerHTML = `<img id="icon-speaker" src="../svg/speaker.svg" alt="Głośność" />`;
  soundVolumeLabel.className = 'main-label';
  container.appendChild(soundVolumeLabel);

  // Create dropdown
  const select = document.createElement('select');
  select.name = 'soundVolume';
  select.className = 'dropdown';

  // Create options
  ['20%', '40%', '60%', '80%', '100%'].forEach((labelText, i) => {
    const option = document.createElement('option');
    option.value = (i + 1) * 20; // Numerical value
    option.textContent = labelText; // Displayed text
    if ((i + 1) * 20 === init) option.selected = true;
    select.appendChild(option);
  });

  container.appendChild(select);

  // Add event listener
  select.addEventListener('change', () => {
    window.soundVolume = select.value;
    console.log('window.soundVolume=', window.soundVolume);
  });

  // Initialize soundVolume
  window.soundVolume = init;

  return container;
}
