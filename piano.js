var tones = {
  context: new (window.AudioContext || window.webkitAudioContext)(),
  attack: 1,
  sustain: 300,
  release: 100,
  volume: 0.3,
  type: 'square',
  startNoteFreq: 55,
  semitoneRatio: 1.059463,

  playSemitoneFrequency(freq) {
    const obwiednia = this.context.createGain();
    const osc = this.context.createOscillator();

    const currentTime = this.context.currentTime;

    obwiednia.gain.setValueAtTime(0, currentTime);
    obwiednia.gain.linearRampToValueAtTime(
      this.volume,
      currentTime + this.attack / 1000
    );
    this.sustain = 300;
    const sustainStart = currentTime + this.attack / 1000;
    const sustainEnd = sustainStart + this.sustain / 1000;
    obwiednia.gain.setValueAtTime(this.volume, sustainStart);

    obwiednia.gain.exponentialRampToValueAtTime(
      0.001,
      sustainEnd + this.release / 1000
    );
    obwiednia.connect(this.context.destination);

    osc.type = this.type || 'sawtooth';
    osc.frequency.setValueAtTime(freq, currentTime);
    osc.connect(obwiednia);
    osc.start();
    osc.stop(sustainEnd + this.release / 1000);
  },

  play(NoteName) {
    this.playSemitoneFrequency(
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

function piano(parentHeight, parentWidth) {
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
  const blackNotes = ['c', 'd', 'f', 'g', 'a'];
  const margin = 0;

  if ((parentHeight / 5) * (notes.length + margin * 2) > parentWidth) {
    parentHeight = (5 * parentWidth) / (notes.length + margin * 2);
  }

  const whiteKeyHeight = parentHeight; /// (notes.length + margin * 2);
  const whiteKeyWidth = whiteKeyHeight / 5;

  const blackKeyWidth = 0.6 * whiteKeyWidth;
  const blackKeyHeight = 0.6 * whiteKeyHeight;

  pianoDiv.style.height = `${whiteKeyHeight}px`;

  const keysContainer = document.createElement('div');
  keysContainer.style.position = 'relative';
  keysContainer.style.height = `${whiteKeyHeight}px`;
  keysContainer.style.width = `${whiteKeyWidth * notes.length}px`;
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
    lastKey = null;
  });

  keysContainer.addEventListener('mouseleave', () => {
    isMouseDown = false; // Reset state when mouse leaves the container
    lastKey = null;
  });

  for (let i = 0; i < notes.length; i++) {
    const key = appendKey(
      whiteKeyWidth * i,
      0,
      whiteKeyWidth,
      whiteKeyHeight,
      'white',
      notes[i]
    );
    keys[notes[i]] = key;
    keysContainer.appendChild(key);
  }

  notes.forEach((element, count) => {
    if (count < notes.length - 1 && blackNotes.includes(element[0])) {
      const key = appendKey(
        whiteKeyWidth * (count + 1) - blackKeyWidth * 0.5,
        0,
        blackKeyWidth,
        blackKeyHeight,
        'black',
        element[0] + '#' + element[1]
      );
      keys[element[0] + '#' + element[1]] = key;
      keysContainer.appendChild(key);
    }
  });

  function appendKey(x, y, width, height, color, note) {
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

    key.addEventListener('mousedown', function (event) {
      tones.play(event.target.note);
      key.style.backgroundColor = attackColor;
      setTimeout(() => {
        key.style.backgroundColor = color;
      }, 300);
    });

    key.addEventListener('dragstart', (event) => {
      event.preventDefault();
    });

    key.addEventListener('mouseenter', function (event) {
      if (isMouseDown && lastKey !== key) {
        tones.play(event.target.note);
        key.style.backgroundColor = attackColor;
        setTimeout(() => {
          key.style.backgroundColor = color;
        }, 300);
        lastKey = key; // Prevent dragging!
      }
    });

    return key;
  }
  return pianoDiv;
}
