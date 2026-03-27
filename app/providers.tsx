'use client';

// Providers wrapper — NextAuth has been removed.
// This file is kept as a passthrough in case future providers are added.
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
