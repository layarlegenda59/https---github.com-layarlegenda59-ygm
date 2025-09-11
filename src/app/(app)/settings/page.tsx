
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <Header title="Pengaturan">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Pengguna
        </Button>
      </Header>
      <main>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Manajemen Pengguna</CardTitle>
                <CardDescription>Tambah, ubah, atau hapus kredensial untuk pengguna pendana.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border p-8 text-center text-muted-foreground">
                    <p>Fungsionalitas untuk manajemen pengguna akan ditambahkan di sini.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
