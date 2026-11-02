import type { Metadata } from 'next';
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { Providers } from '@/components/providers/Providers';
import { SITE } from '@/config/site';
import './globals.css';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display' });
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body' });
const code = JetBrains_Mono({ subsets: ['latin'], variable: '--font-code' });

export const metadata: Metadata = {
  title: { default: `${SITE.name} | Relio CRM integration demo`, template: `%s | ${SITE.name}` },
  description: SITE.tagline,
  robots: { index: false, follow: false }, // a demo, not a public site
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${code.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
