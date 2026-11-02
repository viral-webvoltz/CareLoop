export type Tone = 'neutral' | 'info' | 'success' | 'warning';

export const STATUS_TONE: Record<string, Tone> = { new: 'info', contacted: 'warning', qualified: 'success', unqualified: 'neutral' };

// Pipeline order and the colour each stage uses in the bar and dots.
export const STATUS_ORDER = ['new', 'contacted', 'qualified', 'unqualified'] as const;
export const STATUS_COLOR: Record<string, string> = { new: 'bg-primary', contacted: 'bg-warning', qualified: 'bg-success', unqualified: 'bg-muted/50' };
export const STATUS_HELP: Record<string, string> = {
  new: 'Waiting for the clinic to reply',
  contacted: 'Introduction email sent',
  qualified: 'Replied with interest',
  unqualified: 'Not interested',
};
