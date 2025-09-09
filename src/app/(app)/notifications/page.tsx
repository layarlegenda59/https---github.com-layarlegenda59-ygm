
'use client';

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationScheduler } from "@/components/notifications/scheduler";
import { NotificationLogTable } from "@/components/notifications/log-table";
import { WhatsAppIntegration } from "@/components/notifications/whatsapp-integration";
import { useState } from "react";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("scheduler");
  
  return (
    <div className="flex flex-col gap-8">
      <Header title="Notifikasi" />
      <main>
        <Tabs defaultValue="scheduler" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
            <TabsTrigger value="scheduler">Penjadwal</TabsTrigger>
            <TabsTrigger value="log">Log Notifikasi</TabsTrigger>
            <TabsTrigger value="integration">Integrasi WhatsApp</TabsTrigger>
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
              </Header>
              <CardContent>
                <NotificationLogTable />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="integration">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Integrasi Bot WhatsApp</CardTitle>
                <CardDescription>
                  Hubungkan akun WhatsApp Anda untuk mengaktifkan pengiriman notifikasi otomatis.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <WhatsAppIntegration />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
