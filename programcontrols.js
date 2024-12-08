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
  maxErrorLabel.className = 'control-subContainer-label';
  container.appendChild(maxErrorLabel);

  // Create the dropdown (select element)
  const select = document.createElement('select');
  select.id = 'maxErrorSelect';
  select.className = 'dropdown-select';

  // Add options to the dropdown
  ['0', '1', '2', '3', '4'].forEach((labelText, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = labelText;
    if (i === init) option.selected = true; // Pre-select the initial value
    select.appendChild(option);
  });

  // Add change event listener to the dropdown
  select.addEventListener('change', () => {
    window.maxError = select.value; // Update the global maxError
    window.refreshCharts(); // Call the refresh function
  });

  container.appendChild(select);

  // Initialize global variable
  window.maxError = init;

  return container;
}

function elementSoundVolume(init) {
  const container = document.createElement('div');
  container.id = 'elementSoundVolume';

  // Create label
  const soundVolumeLabel = document.createElement('label');
  soundVolumeLabel.innerHTML = `<img id="svg-icon-speaker" src="../svg/speaker.svg" alt="Głośność" />`;
  soundVolumeLabel.className = 'control-subContainer-label';
  container.appendChild(soundVolumeLabel);

  // Create dropdown
  const select = document.createElement('select');
  select.id = 'soundVolumeSelect';
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
