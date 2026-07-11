import { HTMLAttributes } from "react";

export function Box({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`border border-border ${className}`} {...props} />;
}
