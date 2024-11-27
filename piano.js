var tones = {
  context: new (window.AudioContext || window.webkitAudioContext)(),
  attack: 1, //narastanie dźwięku
  sustain: 300, //podtrzymanie dźwięku
  release: 100,
  volume: 0.3,
  type: 'sine',
  startNoteFreq: 55,
  semitoneRatio: 1.059463,

  playFrequency(freq) {
    const envelope = this.context.createGain();
    const osc = this.context.createOscillator();

    const currentTime = this.context.currentTime;

    // Attack phase: ramp up to the volume
    envelope.gain.setValueAtTime(0, currentTime);
    envelope.gain.linearRampToValueAtTime(
      this.volume,
      currentTime + this.attack / 1000
    );

    // Sustain phase: hold the volume
    const sustainStart = currentTime + this.attack / 1000;
    const sustainEnd = sustainStart + this.sustain / 1000;
    envelope.gain.setValueAtTime(this.volume, sustainStart);

    // Release phase: ramp down to 0
    envelope.gain.linearRampToValueAtTime(0, sustainEnd + this.release / 1000);
    envelope.connect(this.context.destination);

    // Configure oscillator
    osc.type = this.type || 'sine'; // Default type to "sine"
    osc.frequency.setValueAtTime(freq, currentTime);
    osc.connect(envelope);

    // Start and stop the oscillator
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

// Initialize context in Chrome
tones.context.createGain();

// Attach tones to the global window object
window.tones = tones;

// Piano functionality without require
function piano() {
  tones.attack = 100;
  tones.release = 300; // czas trwania
  tones.type = 'sawtooth';
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
  ]; //nutki na klawiaturze
  const black_notes = ['c', 'd', 'f', 'g', 'a']; // które nutki mają czarny klawisz
  const margin = 3; // obszar sąsiadujący między klawiaturą a brzegami ekranu
  const white_key_width = window.innerWidth / (notes.length + margin * 2);

  const keys = {}; // Store keys by note name for reference

  for (let i = 0; i < notes.length; i++) {
    const key = makeKey(
      white_key_width * (margin + i),
      100,
      white_key_width,
      5 * white_key_width,
      'white',
      notes[i]
    );
    keys[notes[i]] = key; // Save the key reference
  }

  const black_key_width = 0.6 * white_key_width;

  notes.forEach((element, count) => {
    if (count < notes.length - 1 && black_notes.includes(element[0])) {
      //-1 >> nie rysuj  czarnego klawisza jeśli miałby być klawiszem ostatnim
      const key = makeKey(
        white_key_width * (margin + count + 1) - black_key_width * 0.5,
        100,
        black_key_width,
        2.75 * white_key_width,
        'black',
        element[0] + '#' + element[1]
      );
      keys[element[0] + '#' + element[1]] = key; // Save the key reference
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
    key.style.transition = 'background-color 0.5s ease'; // Add CSS transition for fade effect
    key.note = note;

    key.addEventListener('mousedown', function (event) {
      // Play the tone
      tones.play(event.target.note);

      // Change background color for fade-in effect
      key.style.backgroundColor = attackColor;

      // Reset to original color for fade-out effect after 500ms
      setTimeout(() => {
        key.style.backgroundColor = color;
      }, tones.sustain);
    });

    document.body.appendChild(key);
    return key;
  }
}
