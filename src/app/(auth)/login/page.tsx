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
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault()
    // TODO: Implement real authentication logic here.
    // This will involve calling a backend service to verify credentials
    // and set a session for the user.
    // For now, we'll simulate a successful login and redirect.
    router.push('/dashboard')
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Masuk</CardTitle>
        <CardDescription>
          Masukkan email Anda di bawah untuk masuk ke akun Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Lupa password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Masuk
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Belum punya akun?{' '}
          <Link href="/signup" className="underline">
            Daftar
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
