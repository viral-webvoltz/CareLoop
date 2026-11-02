import { subscribe } from '@/modules/webhooks/services/event-store';

export const dynamic = 'force-dynamic';

const HEARTBEAT_MS = 25_000;

// Server-Sent Events: each verified webhook from the CRM is pushed to every open browser the moment it arrives.
export function GET(req: Request) {
  const encoder = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream({
    start(controller) {
      const send = (chunk: string) => controller.enqueue(encoder.encode(chunk));
      send('retry: 3000\n\n');
      const unsubscribe = subscribe((event) => send(`data: ${JSON.stringify(event)}\n\n`));
      const heartbeat = setInterval(() => send(': keep-alive\n\n'), HEARTBEAT_MS); // keeps proxies from closing an idle stream
      cleanup = () => {
        unsubscribe();
        clearInterval(heartbeat);
      };
      req.signal.addEventListener('abort', () => {
        cleanup();
        controller.close();
      });
    },
    cancel: () => cleanup(),
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive' },
  });
}
