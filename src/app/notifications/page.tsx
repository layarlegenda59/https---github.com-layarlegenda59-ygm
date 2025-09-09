import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationScheduler } from "@/components/notifications/scheduler";
import { NotificationLogTable } from "@/components/notifications/log-table";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <Header title="Notifikasi" />
      <main>
        <Tabs defaultValue="scheduler" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="scheduler">Penjadwal</TabsTrigger>
            <TabsTrigger value="log">Log Notifikasi</TabsTrigger>
          </TabsList>
          <TabsContent value="scheduler">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Jadwalkan Notifikasi</CardTitle>
                <CardDescription>
                  Jadwalkan notifikasi WhatsApp untuk pembayaran yang akan datang, jatuh tempo, dan terlambat.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <NotificationScheduler />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="log">
             <Card>
              <CardHeader>
                <CardTitle className="font-headline">Log Notifikasi</CardTitle>
                <CardDescription>
                  Log semua upaya notifikasi dan statusnya.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationLogTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
