import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  weight?: 300 | 400 | 500 | 600 | 700;
  size?: number;
  style?: CSSProperties;
}

/** Material Symbols Outlined wrapper. */
export const Icon = ({ name, className, filled, weight = 400, size, style }: IconProps) => {
  const variation = `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`;
  return (
    <span
      aria-hidden
      className={cn("material-symbols-outlined select-none", className)}
      style={{
        fontVariationSettings: variation,
        fontSize: size ? `${size}px` : undefined,
        ...style,
      }}
    >
      {name}
    </span>
  );
};
