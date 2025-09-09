
'use client';

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationLogTable } from "@/components/notifications/log-table";
import { WhatsAppIntegration } from "@/components/notifications/whatsapp-integration";
import { useState } from "react";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("log");
  
  return (
    <div className="flex flex-col gap-8">
      <Header title="Notifikasi" />
      <main>
        <Tabs defaultValue="log" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="log">Log Notifikasi</TabsTrigger>
            <TabsTrigger value="integration">Integrasi WhatsApp</TabsTrigger>
          </TabsList>
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
