// UI Sound Effects Manager
class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
    }

    // Create audio context for sound generation
    createBeep(frequency = 800, duration = 100, volume = 0.1) {
        if (!this.enabled) return;

        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (error) {
            console.warn('Audio not supported:', error);
        }
    }

    // UI interaction sounds
    playClick() {
        this.createBeep(1200, 50, 0.05);
    }

    playHover() {
        this.createBeep(600, 30, 0.03);
    }

    playSend() {
        this.createBeep(1000, 80, 0.06);
        setTimeout(() => this.createBeep(1200, 60, 0.04), 100);
    }

    playReceive() {
        this.createBeep(800, 100, 0.05);
        setTimeout(() => this.createBeep(1000, 80, 0.04), 80);
    }

    playError() {
        this.createBeep(400, 150, 0.08);
    }

    playNotification() {
        this.createBeep(1400, 60, 0.05);
        setTimeout(() => this.createBeep(1600, 60, 0.04), 100);
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }
}

export const soundManager = new SoundManager();
