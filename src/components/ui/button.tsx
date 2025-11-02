import { cn } from "@/lib/utils";
export function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "rounded-lg bg-primary text-white px-4 py-2 hover:opacity-90 transition",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
