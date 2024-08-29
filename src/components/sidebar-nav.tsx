"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { SidebarNavItem } from "../types/index.s";
import { cn } from "../lib/utils";

export interface DocsSidebarNavProps {
  items: SidebarNavItem[];
}

export function DocsSidebarNav({ items }: DocsSidebarNavProps) {
  const pathname = usePathname();

  return items.length ? (
    <div className="sidebar">
      {items.map((item, index) => (
        <div key={index} className={cn("pb-8")}>
          {/* Use Link for top-level items with href */}
          {item.href ? (
            <Link
              href={`/view/${item.href}`}
              className={cn(
                "flex-col w-full items-center rounded-md p-2 hover:underline",
                {
                  "bg-muted": pathname === `/view/${item.href}`,
                }
              )}
            >
              {item.title}
            </Link>
          ) : (
            <>
              <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">
                {item.title}
              </h4>
              {/* Render nested items if available */}
              {item.items && (
                <DocsSidebarNavItems items={item.items} pathname={pathname} />
              )}
            </>
          )}
        </div>
      ))}
    </div>
  ) : null;
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[];
  pathname: string | null;
}

export function DocsSidebarNavItems({
  items,
  pathname,
}: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="sidebar-items">
      {items.map((item, index) =>
        !item.disabled && item.href ? (
          <Link
            key={index}
            href="#"
            className={cn(
              "flex-col w-full items-center rounded-md p-2 hover:underline",
              {
                "bg-muted": pathname === `/view/${item.href}`,
              }
            )}
            rel={item.external ? "noreferrer" : ""}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {item.title}
          </Link>
        ) : (
          <span
            key={index}
            style={{ display: "flex", flexDirection: "column" }}
            className="flex w-full items-center rounded-md p-2 opacity-60"
          >
            {item.title}
          </span>
        )
      )}
    </div>
  ) : null;
}
