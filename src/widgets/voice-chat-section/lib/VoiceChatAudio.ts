import { HubConnection } from '@microsoft/signalr';

export class VoiceChatAudio {
  private stream?: MediaStream;
  private mediaRecorder?: MediaRecorder;
  private audioContext: AudioContext;
  private audioPlayers: Map<string, AudioWorkletNode>;
  
  constructor() {
    this.audioContext = new AudioContext();
    this.audioPlayers = new Map();
  }

  async startCapturing(connection: HubConnection): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
        },
        video: false
      });

      // Check browser support for WebM/Opus
      const mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        throw new Error('WebM/Opus not supported in this browser');
      }

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: mimeType,
        bitsPerSecond: 32000
      });

      this.mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          try {
            const base64String = await this.blobToBase64(event.data);
            await connection.invoke("SendVoiceSignal", base64String);
          } catch (error) {
            console.error('Error processing audio data:', error);
          }
        }
      };

      this.mediaRecorder.start(20);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  async playAudio(userId: string, audioData: string): Promise<void> {
    if (!audioData) {
      throw new Error('No audio data received.');
    }

    try {
      // Ensure audio context is in running state
      if (this.audioContext.state !== 'running') {
        await this.audioContext.resume();
      }

      // Add base64 padding if necessary
      const paddedData = this.padBase64String(audioData);

      // Convert base64 to ArrayBuffer
      const binaryString = atob(paddedData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create blob with explicit MIME type
      const blob = new Blob([bytes], { type: 'audio/webm;codecs=opus' });
      if (blob.size === 0) {
        throw new Error('Generated audio blob is empty');
      }

      // Use WebAudio API for better control and lower latency
      return new Promise(async (resolve, reject) => {
        try {
          const arrayBuffer = await blob.arrayBuffer();
          const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
          
          const source = this.audioContext.createBufferSource();
          source.buffer = audioBuffer;
          
          // Add a small gain node to prevent any potential clipping
          const gainNode = this.audioContext.createGain();
          gainNode.gain.value = 0.95;
          
          source.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          source.onended = () => {
            source.disconnect();
            gainNode.disconnect();
            resolve();
          };

          source.start(0);
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  private padBase64String(input: string): string {
    const padding = input.length % 4;
    if (padding) {
      return input + '='.repeat(4 - padding);
    }
    return input;
  }

  stopCapturing(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = undefined;
    this.mediaRecorder = undefined;
  }

  dispose(): void {
    this.stopCapturing();
    this.audioContext.close();
    this.audioPlayers.clear();
  }
}