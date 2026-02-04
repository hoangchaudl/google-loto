
import { GameState, Participant } from '../types';

type EventCallback = (data: any) => void;

/**
 * MockSocket simulates a real-time WebSocket connection.
 * It uses BroadcastChannel to allow synchronization between different tabs/windows
 * of the same browser, making it a "functional" multiplayer demo.
 */
class MockSocket {
  private channel: BroadcastChannel;
  private listeners: Record<string, EventCallback[]> = {};

  constructor(sessionId: string) {
    this.channel = new BroadcastChannel(`loto-session-${sessionId}`);
    this.channel.onmessage = (event) => {
      const { type, data } = event.data;
      if (this.listeners[type]) {
        this.listeners[type].forEach(cb => cb(data));
      }
    };
  }

  on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event: string, data: any) {
    // Local trigger
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
    // Remote trigger (other tabs)
    this.channel.postMessage({ type: event, data });
  }

  disconnect() {
    this.channel.close();
  }
}

export const createSocket = (sessionId: string) => new MockSocket(sessionId);
