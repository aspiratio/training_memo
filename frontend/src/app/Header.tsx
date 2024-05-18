"use client"
import { monitorAuthState } from "@/utils/auth"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const locationColor = "text-yellow-100"

  useEffect(() => {
    // ユーザーがログインしているかどうかを監視する
    const unsubscribe = monitorAuthState((user) => {
      !user && router.push("/")
    })
    // コンポーネントがアンマウントされるときにリスナーをクリーンアップ
    return () => unsubscribe()
  }, [router])

  return (
    <header className="py-5 px-10 border-b">
      <nav className="text-2xl font-extrabold  flex justify-between items-center">
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
        <Link
          href="/history"
          className={pathname === "/history" ? locationColor : undefined}
        >
          History
        </Link>
      </nav>
    </header>
  )
}

export default Header
