"use client";

import { MatrixProvider } from "@/components/matrix/MatrixProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <MatrixProvider>{children}</MatrixProvider>;
}