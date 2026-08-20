import { cn } from "@carsxe/design-system/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <span className="inline-flex items-center">
      <img
        src="/logo-light.png"
        alt="CarsXE"
        className={cn("h-7 w-auto dark:hidden", className)}
      />
      <img
        src="/logo-dark.png"
        alt=""
        className={cn("hidden h-7 w-auto dark:block", className)}
      />
    </span>
  )
}
