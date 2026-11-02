const PAST: Record<string, string> = { create: 'created', update: 'updated', delete: 'deleted', restore: 'restored', convert: 'converted' };

const INTENT: Record<string, string> = { interested: 'interested', not_interested: 'not interested' };

// "leads.create" -> "Lead created". Email events read as what happened to the person: "Lead replied: interested".
// Unknown events fall back to the readable form of their name.
export function eventLabel(name: string, data?: unknown) {
  const [resource = name, action] = name.split('.');
  const singular = resource.endsWith('s') ? resource.slice(0, -1) : resource;

  let label: string;
  if (action === 'email') label = `Email sent to ${singular}`;
  else if (action === 'email_reply') {
    const intent = typeof data === 'object' && data !== null && 'intent' in data ? INTENT[String((data as { intent: unknown }).intent)] : undefined;
    label = `${singular} replied${intent ? `: ${intent}` : ''}`;
  } else label = `${singular} ${action ? (PAST[action] ?? action) : ''}`.trim();

  return label.charAt(0).toUpperCase() + label.slice(1);
}
