
'use client';
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
      if(error) {
        console.error("Error fetching user:", error);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <Header title="Pengaturan" />
      <main>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Profil Pengguna</CardTitle>
            <CardDescription>
              Informasi ini terkait dengan akun Anda yang sedang masuk.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="flex items-center justify-center h-24">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : user ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input id="fullName" value={user.user_metadata?.full_name || ''} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user.email || ''} readOnly />
                </div>
              </div>
            ) : (
                <p className="text-muted-foreground text-center">Gagal memuat informasi pengguna.</p>
            )}
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button disabled>Simpan Perubahan</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
