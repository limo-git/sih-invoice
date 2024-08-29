import Link from "next/link";
import React from "react";
import { cn } from "../lib/utils";

interface MdxCardProps extends React.HTMLAttributes<HTMLDivElement> {
  href?: string;
  disabled?: boolean;
}

export const MdxCard: React.FC<MdxCardProps> = ({
  href,
  className,
  children,
  disabled,
  ...props
}) => {
  const cardClasses = cn(
    "group relative rounded-lg border p-6 shadow-md transition-shadow hover:shadow-lg",
    disabled && "cursor-not-allowed opacity-60",
    className
  );

  return (
    <div className="mx-auto max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
      <div className={cardClasses} {...props}>
        <div className="flex flex-col justify-between space-y-4">
          {children}
        </div>
        {href && (
          <Link href={disabled ? "#" : href}>
            <a className="absolute inset-0" tabIndex={disabled ? -1 : undefined}>
              <span className="sr-only">View</span>
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};
