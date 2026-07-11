import { ButtonHTMLAttributes } from "react";

type Variant = "solid" | "outline" | "ghost";

const variants: Record<Variant, string> = {
  solid: "bg-foreground text-background border border-foreground hover:opacity-85",
  outline: "border border-border hover:border-foreground",
  ghost: "border border-transparent hover:border-border text-muted hover:text-foreground",
};

export function Button({
  variant = "outline",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`px-3 py-1.5 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
