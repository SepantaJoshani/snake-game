export class AudioSystem {
  private audioContext: AudioContext;
  private isMuted: boolean;
  private masterVolume: number;

  // Background music properties
  private musicGainNode: GainNode | null;
  private musicOscillators: OscillatorNode[];
  private musicPlaying: boolean;
  private musicVolume: number;

  constructor() {
    // Initialize Web Audio API
    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    this.isMuted = false;
    this.masterVolume = 0.3; // Default volume (30%)

    // Initialize music properties
    this.musicGainNode = null;
    this.musicOscillators = [];
    this.musicPlaying = false;
    this.musicVolume = 0.15; // Background music at 15% (lower than sound effects)

    // Load mute state from localStorage
    const savedMuted = localStorage.getItem("snake-audio-muted");
    if (savedMuted !== null) {
      this.isMuted = JSON.parse(savedMuted);
    }
  }

  /**
   * Resume audio context (required for user interaction)
   */
  public resumeAudioContext(): void {
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  /**
   * Toggle mute state
   */
  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    localStorage.setItem("snake-audio-muted", JSON.stringify(this.isMuted));

    // Update background music volume
    this.updateMusicVolume();
  }

  /**
   * Get current mute state
   */
  public isMutedState(): boolean {
    return this.isMuted;
  }

  /**
   * Set master volume (0.0 to 1.0)
   */
  public setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Play eat sound effect (higher pitched, pleasant)
   */
  public playEatSound(): void {
    if (this.isMuted) return;

    this.resumeAudioContext();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Connect audio nodes
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Create a pleasant "eat" sound - quick chirp with frequency sweep
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      1200,
      this.audioContext.currentTime + 0.1
    );

    // Volume envelope - quick fade in and out
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      this.masterVolume * 0.5,
      this.audioContext.currentTime + 0.02
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.15
    );

    // Play for 150ms
    const currentTime = this.audioContext.currentTime;
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.15);
  }

  /**
   * Play collision sound effect (lower pitched, dramatic)
   */
  public playCollisionSound(): void {
    if (this.isMuted) return;

    this.resumeAudioContext();

    // Create a more dramatic collision sound with multiple oscillators
    this.createCollisionOscillator(200, 0.6); // Low rumble
    this.createCollisionOscillator(150, 0.4); // Even lower bass

    // Add a sharp "crack" sound
    setTimeout(() => {
      this.createCollisionOscillator(800, 0.3, "sawtooth", 0.05);
    }, 50);
  }

  /**
   * Helper method to create collision sound oscillators
   */
  private createCollisionOscillator(
    frequency: number,
    volume: number,
    type: OscillatorType = "triangle",
    duration: number = 0.3
  ): void {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime
    );

    // Slight frequency drop for impact effect
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 0.7,
      this.audioContext.currentTime + duration
    );

    // Volume envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      this.masterVolume * volume,
      this.audioContext.currentTime + 0.01
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    const currentTime = this.audioContext.currentTime;
    oscillator.start(currentTime);
    oscillator.stop(currentTime + duration);
  }

  /**
   * Play a subtle UI sound (for menu interactions, toggles)
   */
  public playUISound(): void {
    if (this.isMuted) return;

    this.resumeAudioContext();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Soft, brief UI sound
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(
      800,
      this.audioContext.currentTime + 0.08
    );

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      this.masterVolume * 0.2,
      this.audioContext.currentTime + 0.01
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.08
    );

    const currentTime = this.audioContext.currentTime;
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.08);
  }

  /**
   * Start background music loop
   */
  public startBackgroundMusic(): void {
    if (this.musicPlaying) return;

    this.resumeAudioContext();

    // Create gain node for music volume control
    this.musicGainNode = this.audioContext.createGain();
    this.musicGainNode.connect(this.audioContext.destination);

    // Set initial volume (respects mute state)
    this.musicGainNode.gain.setValueAtTime(
      this.isMuted ? 0 : this.musicVolume,
      this.audioContext.currentTime
    );

    // Create a simple, pleasant melody loop
    this.createMusicLoop();
    this.musicPlaying = true;
  }

  /**
   * Stop background music
   */
  public stopBackgroundMusic(): void {
    if (!this.musicPlaying) return;

    // Fade out music before stopping
    if (this.musicGainNode) {
      const currentTime = this.audioContext.currentTime;
      this.musicGainNode.gain.setValueAtTime(
        this.musicGainNode.gain.value,
        currentTime
      );
      this.musicGainNode.gain.linearRampToValueAtTime(0, currentTime + 0.5);
    }

    // Stop all oscillators after fade out
    setTimeout(() => {
      this.musicOscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator may already be stopped
        }
      });
      this.musicOscillators = [];
      this.musicGainNode?.disconnect();
      this.musicGainNode = null;
      this.musicPlaying = false;
    }, 500);
  }

  /**
   * Check if background music is currently playing
   */
  public isMusicPlaying(): boolean {
    return this.musicPlaying;
  }

  /**
   * Update music volume based on mute state
   */
  public updateMusicVolume(): void {
    if (this.musicGainNode) {
      const targetVolume = this.isMuted ? 0 : this.musicVolume;
      this.musicGainNode.gain.setValueAtTime(
        targetVolume,
        this.audioContext.currentTime
      );
    }
  }

  /**
   * Create a looping melodic background music pattern
   */
  private createMusicLoop(): void {
    // Musical notes in Hz (C major pentatonic scale)
    const notes = {
      C4: 261.63,
      D4: 293.66,
      E4: 329.63,
      G4: 392.0,
      A4: 440.0,
      C5: 523.25,
    };

    // Simple, relaxing melody pattern
    const melody = [
      { note: notes.C4, duration: 0.5 },
      { note: notes.E4, duration: 0.5 },
      { note: notes.G4, duration: 0.5 },
      { note: notes.A4, duration: 0.5 },
      { note: notes.G4, duration: 0.5 },
      { note: notes.E4, duration: 0.5 },
      { note: notes.D4, duration: 0.75 },
      { note: notes.C4, duration: 0.75 },
    ];

    // Calculate total loop duration
    const loopDuration = melody.reduce((sum, note) => sum + note.duration, 0);

    // Schedule notes in the loop
    const scheduleLoop = (startTime: number) => {
      let currentTime = startTime;

      melody.forEach((note) => {
        const oscillator = this.audioContext.createOscillator();
        const noteGain = this.audioContext.createGain();

        oscillator.connect(noteGain);
        noteGain.connect(this.musicGainNode!);

        // Use sine wave for smooth, pleasant sound
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(note.note, currentTime);

        // Add subtle vibrato
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        lfo.frequency.setValueAtTime(5, currentTime); // 5 Hz vibrato
        lfoGain.gain.setValueAtTime(2, currentTime); // ±2 Hz depth
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);

        // Envelope for smooth attack and release
        noteGain.gain.setValueAtTime(0, currentTime);
        noteGain.gain.linearRampToValueAtTime(0.08, currentTime + 0.05); // Attack
        noteGain.gain.linearRampToValueAtTime(
          0.05,
          currentTime + note.duration - 0.1
        ); // Sustain
        noteGain.gain.linearRampToValueAtTime(0, currentTime + note.duration); // Release

        // Start and stop note
        oscillator.start(currentTime);
        oscillator.stop(currentTime + note.duration);
        lfo.start(currentTime);
        lfo.stop(currentTime + note.duration);

        this.musicOscillators.push(oscillator);

        currentTime += note.duration;
      });

      // Schedule next loop iteration
      if (this.musicPlaying) {
        setTimeout(() => {
          if (this.musicPlaying) {
            scheduleLoop(this.audioContext.currentTime);
          }
        }, loopDuration * 1000);
      }
    };

    // Start the first loop
    scheduleLoop(this.audioContext.currentTime);
  }
}
