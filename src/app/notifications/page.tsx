import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationScheduler } from "@/components/notifications/scheduler";
import { NotificationLogTable } from "@/components/notifications/log-table";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <Header title="Notifications" />
      <main>
        <Tabs defaultValue="scheduler" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
            <TabsTrigger value="log">Notification Log</TabsTrigger>
          </TabsList>
          <TabsContent value="scheduler">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Schedule Notification</CardTitle>
                <CardDescription>
                  Schedule WhatsApp notifications for upcoming, due, and overdue payments.
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
                <CardTitle className="font-headline">Notification Log</CardTitle>
                <CardDescription>
                  Log of all notification attempts and their statuses.
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
