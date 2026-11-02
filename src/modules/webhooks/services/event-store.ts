import 'server-only';
import type { StoredEvent } from '../types';

const MAX_EVENTS = 50;

type Listener = (event: StoredEvent) => void;

// ponytail: in-memory, per instance and lost on restart. Fine for one Node process; a serverless or multi-instance host would persist events
// and fan them out through a shared channel (Redis pub/sub, Postgres LISTEN/NOTIFY).
const g = globalThis as unknown as { __careloopEvents?: StoredEvent[]; __careloopListeners?: Set<Listener> };
const events = (g.__careloopEvents ??= []);
const listeners = (g.__careloopListeners ??= new Set<Listener>());

export function addEvent(event: StoredEvent) {
  if (events.some((e) => e.id === event.id)) return; // the CRM retries failed deliveries; the same id must not show twice
  events.unshift(event);
  events.length = Math.min(events.length, MAX_EVENTS);
  listeners.forEach((listener) => listener(event));
}

export const listEvents = (limit = 20) => events.slice(0, limit);

// Returns the unsubscribe function.
export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}
