
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
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
       toast({
        title: "Gagal Masuk",
        description: error.message,
        variant: "destructive",
      });
    } else {
       toast({
        title: "Berhasil Masuk",
        description: "Anda akan diarahkan ke dasbor.",
      });
      router.push('/dashboard');
      router.refresh(); // To re-fetch server components with user session
    }
    setLoading(false);
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
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="/" className="ml-auto inline-block text-sm underline">
                Lupa password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              required
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Masuk"}
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
