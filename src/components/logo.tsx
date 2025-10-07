'use client'

import Link from "next/link";

export default function Logo() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "MyApp";
  return (
    <Link href="/" prefetch={true}>
      <div className="text-chart-5 p-2">
        <span className="ml-2 text-xl font-bold">{appName}</span>
      </div>
    </Link>
  )
}