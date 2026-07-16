export function playStartSound() {
  const AudioContextClass =
    window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioContextClass();

  // A short ascending three-note chime, evoking a "game show ding" feel
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  const noteDuration = 0.15;

  notes.forEach((frequency, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    const startTime = ctx.currentTime + i * noteDuration;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + noteDuration);
  });
}