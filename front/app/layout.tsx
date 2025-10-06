import { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css"

export const metadata : Metadata = {
  title : "Next Project"
}

export default function Layout ({children} : Readonly < {children : ReactNode} >) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  )
}