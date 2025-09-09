'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  const router = useRouter()

  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault()
    // In a real app, you'd have actual signup logic here.
    // For this prototype, we'll just redirect to the dashboard.
    router.push('/dashboard')
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl font-headline">Daftar</CardTitle>
        <CardDescription>
          Masukkan informasi Anda untuk membuat akun
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="full-name">Nama Lengkap</Label>
            <Input id="full-name" placeholder="John Doe" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <Button type="submit" className="w-full">
            Buat akun
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Sudah punya akun?{" "}
          <Link href="/login" className="underline">
            Masuk
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
