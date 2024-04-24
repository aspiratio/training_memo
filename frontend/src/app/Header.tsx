"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Header = () => {
  const pathname = usePathname()
  const locationColor = "text-yellow-100"

  return (
    <header className="py-5 px-10 border-b">
      <nav className="text-2xl font-extrabold  flex justify-between items-center">
        <Link href="/" className={pathname === "/" ? locationColor : undefined}>
          Top
        </Link>
        <Link
          href="/record"
          className={pathname === "/record" ? locationColor : undefined}
        >
          Record
        </Link>
        <Link
          href="/menu"
          className={pathname === "/menu" ? locationColor : undefined}
        >
          Menu
        </Link>
      </nav>
    </header>
  )
}

export default Header
