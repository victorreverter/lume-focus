export class AudioController {
    private ctx: AudioContext | null = null;
    private gainNode: GainNode | null = null;
    private audioBuffer: AudioBuffer | null = null;
    private sourceNode: AudioBufferSourceNode | null = null;
    private audioUrl: string = '/assets/audio/lofi-loop.mp3';

    constructor() {
        this.prefetchAudio();
    }

    private async prefetchAudio() {
        try {
            const response = await fetch(this.audioUrl);
            const arrayBuffer = await response.arrayBuffer();
            // Initialize an offline or base context just to decode if needed,
            // but usually context must be created after user interaction.
            // We'll decode when initialized.
            this.audioBufferData = arrayBuffer;
        } catch (e) {
            console.error('Failed to pre-fetch audio', e);
        }
    }
    private audioBufferData: ArrayBuffer | null = null;

    async init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            this.ctx = new AudioCtx();
            this.gainNode = this.ctx.createGain();
            this.gainNode.connect(this.ctx.destination);
            this.gainNode.gain.value = 0; // initialize silent
        }

        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }

        if (!this.audioBuffer && this.audioBufferData) {
            this.audioBuffer = await this.ctx.decodeAudioData(this.audioBufferData.slice(0));
        }
    }

    async playFadeIn(rampSeconds: number = 1) {
        await this.init();
        if (this.ctx && this.gainNode && this.audioBuffer) {
            if (!this.sourceNode) {
                this.sourceNode = this.ctx.createBufferSource();
                this.sourceNode.buffer = this.audioBuffer;
                this.sourceNode.loop = true;
                this.sourceNode.connect(this.gainNode);
                this.sourceNode.start(0);
            }

            // Linearly ramp volume from 0 to 1
            this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
            this.gainNode.gain.linearRampToValueAtTime(1, this.ctx.currentTime + rampSeconds);
        }
    }

    stopFadeOut(rampSeconds: number = 1) {
        if (this.ctx && this.gainNode) {
            // Linearly ramp volume to 0 to prevent sharp cuts
            this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
            this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + rampSeconds);

            // Optionally stop the source node after fading out
            setTimeout(() => {
                if (this.gainNode?.gain.value === 0 && this.sourceNode) {
                    this.sourceNode.stop();
                    this.sourceNode.disconnect();
                    this.sourceNode = null;
                }
            }, rampSeconds * 1000 + 100);
        }
    }
}

// Export a singleton instance
export const audioController = new AudioController();
