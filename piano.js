var tones = {
  context: new (window.AudioContext || window.webkitAudioContext)(),
  attack: 1,
  sustain: 300,
  release: 100,
  volume: 0.3,
  type: 'square',
  startNoteFreq: 55,
  semitoneRatio: 1.059463,

  playFrequency(freq) {
    const envelope = this.context.createGain();
    const osc = this.context.createOscillator();

    const currentTime = this.context.currentTime;

    envelope.gain.setValueAtTime(0, currentTime);
    envelope.gain.linearRampToValueAtTime(
      this.volume,
      currentTime + this.attack / 1000
    );
    this.sustain = 300;
    const sustainStart = currentTime + this.attack / 1000;
    const sustainEnd = sustainStart + this.sustain / 1000;
    envelope.gain.setValueAtTime(this.volume, sustainStart);

    envelope.gain.exponentialRampToValueAtTime(
      0.001,
      sustainEnd + this.release / 1000
    );
    envelope.connect(this.context.destination);

    osc.type = this.type || 'sawtooth';
    osc.frequency.setValueAtTime(freq, currentTime);
    osc.connect(envelope);

    osc.start();
    osc.stop(sustainEnd + this.release / 1000);
  },

  play(NoteName) {
    this.playFrequency(
      this.startNoteFreq *
        Math.pow(
          this.semitoneRatio,
          {
            c: 0,
            'c#': 1,
            db: 1,
            d: 2,
            'd#': 3,
            eb: 3,
            e: 4,
            f: 5,
            'f#': 6,
            gb: 6,
            g: 7,
            'g#': 8,
            ab: 8,
            a: 9,
            'a#': 10,
            b: 10,
            h: 11,
          }[NoteName.slice(0, -1).toLowerCase()] +
            (NoteName.slice(-1) - 1) * 12
        )
    );
  },
};

tones.context.createGain();
window.tones = tones;

// Declare keys as a global variable
var keys = {};
window.keys = keys; // Attach keys to the global window object

function piano() {
  const pianoDiv = document.createElement('div');
  tones.attack = 100;
  const attackColor = 'lawngreen';

  const notes = [
    'a2',
    'h2',
    'c3',
    'd3',
    'e3',
    'f3',
    'g3',
    'a3',
    'h3',
    'c4',
    'd4',
    'e4',
  ];
  const black_notes = ['c', 'd', 'f', 'g', 'a'];
  const margin = 0;
  const white_key_width =
    (0.5 * window.innerWidth) / (notes.length + margin * 2);
  const white_key_height = 5 * white_key_width;
  const black_key_width = 0.6 * white_key_width;
  const black_key_height = 0.6 * white_key_height;

  pianoDiv.style.height = `${white_key_height}px`;

  const keysContainer = document.createElement('div');
  keysContainer.style.position = 'relative';
  keysContainer.style.height = `${white_key_height}px`;
  keysContainer.style.width = `${white_key_width * notes.length}px`;
  pianoDiv.appendChild(keysContainer);

  // Track mouse state and the last key
  let isMouseDown = false;
  let lastKey = null;

  keysContainer.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    event.preventDefault(); // Prevent drag-and-drop behavior
  });

  keysContainer.addEventListener('mouseup', () => {
    isMouseDown = false;
    lastKey = null; // Reset last key on mouse release
  });

  keysContainer.addEventListener('mouseleave', () => {
    isMouseDown = false; // Reset state when mouse leaves the container
    lastKey = null;
  });

  for (let i = 0; i < notes.length; i++) {
    const key = makeKey(
      white_key_width * i,
      0,
      white_key_width,
      white_key_height,
      'white',
      notes[i]
    );
    keys[notes[i]] = key;
    keysContainer.appendChild(key);
  }

  notes.forEach((element, count) => {
    if (count < notes.length - 1 && black_notes.includes(element[0])) {
      const key = makeKey(
        white_key_width * (count + 1) - black_key_width * 0.5,
        0,
        black_key_width,
        black_key_height,
        'black',
        element[0] + '#' + element[1]
      );
      keys[element[0] + '#' + element[1]] = key;
      keysContainer.appendChild(key);
    }
  });

  function makeKey(x, y, width, height, color, note) {
    const key = document.createElement('div');
    key.style.width = `${width}px`;
    key.style.height = `${height}px`;
    key.style.position = 'absolute';
    key.style.left = `${x}px`;
    key.style.top = `${y}px`;
    key.style.backgroundColor = color;
    key.style.border = 'solid 1px black';
    key.style.transition = 'background-color 0.5s ease';
    key.note = note;

    // Play sound on mousedown
    key.addEventListener('mousedown', function (event) {
      tones.play(event.target.note);
      key.style.backgroundColor = attackColor;
      setTimeout(() => {
        key.style.backgroundColor = color;
      }, 300);
    });

    // Prevent default drag behavior
    key.addEventListener('dragstart', (event) => {
      event.preventDefault();
    });

    // Play sound on key entry during dragging
    key.addEventListener('mouseenter', function (event) {
      if (isMouseDown && lastKey !== key) {
        tones.play(event.target.note);
        key.style.backgroundColor = attackColor;
        setTimeout(() => {
          key.style.backgroundColor = color;
        }, 300);
        lastKey = key; // Update the last key
      }
    });

    return key;
  }
  return pianoDiv;
}
