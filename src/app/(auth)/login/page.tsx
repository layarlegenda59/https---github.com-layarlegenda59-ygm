
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
    <Card className="mx-auto max-w-md shadow-lg">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <CardTitle className="text-3xl font-headline font-bold text-foreground">Selamat Datang</CardTitle>
        <CardDescription className="text-base text-muted-foreground leading-relaxed">
          Masuk ke sistem manajemen debitur YGM untuk mengelola data dan notifikasi dengan mudah
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">Alamat Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              className="h-12"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Kata Sandi</Label>
              <Link href="/" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Lupa kata sandi?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              required
              placeholder="Masukkan kata sandi Anda" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="h-12"
            />
          </div>
          <Button type="submit" className="w-full h-12 text-base font-medium" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sedang masuk...
              </>
            ) : (
              "Masuk ke Dashboard"
            )}
          </Button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Belum memiliki akun?{' '}
            <Link href="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
