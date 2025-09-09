
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type Status = 'loading' | 'unauthenticated' | 'authenticated' | 'error';

export function WhatsAppIntegration() {
  const [status, setStatus] = useState<Status>('loading');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const generateQrCode = () => {
    setStatus('loading');
    // Simulate API call to get a new QR code
    setTimeout(() => {
      const timestamp = new Date().getTime();
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://wa.me/628123456789?text=connect-${timestamp}`);
      setStatus('unauthenticated');
    }, 1500);
  };

  const checkAuthStatus = () => {
     // In a real app, you'd poll your backend to check if the QR was scanned.
     // Here we'll simulate it.
     if (status === 'unauthenticated' && qrCodeUrl) {
         const interval = setInterval(() => {
            // Randomly "authenticate" after a while
            if (Math.random() > 0.7) {
                setStatus('authenticated');
                clearInterval(interval);
            }
         }, 3000);
         return () => clearInterval(interval);
     }
  }

  useEffect(() => {
    generateQrCode();
  }, []);

  useEffect(checkAuthStatus, [status, qrCodeUrl]);

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center gap-4 h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Memuat status koneksi...</p>
            </div>
          )}

          {status === 'unauthenticated' && (
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-lg font-semibold">Hubungkan WhatsApp Anda</h3>
              <p className="text-sm text-muted-foreground">
                Pindai kode QR ini dari aplikasi WhatsApp di ponsel Anda untuk menghubungkan bot notifikasi.
              </p>
              <div className="p-4 border rounded-md bg-white">
                {qrCodeUrl ? (
                    <Image
                        src={qrCodeUrl}
                        alt="WhatsApp QR Code"
                        width={250}
                        height={250}
                        data-ai-hint="qr code"
                    />
                ) : <div className="h-[250px] w-[250px] bg-gray-200 animate-pulse rounded-md" />}
              </div>
              <Button variant="outline" onClick={generateQrCode}>
                Buat Kode QR Baru
              </Button>
            </div>
          )}

          {status === 'authenticated' && (
             <div className="flex flex-col items-center justify-center gap-4 h-64">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <h3 className="text-xl font-bold">Terhubung</h3>
                <p className="text-muted-foreground">Bot WhatsApp berhasil terhubung.</p>
                <Button variant="destructive" onClick={() => setStatus('unauthenticated')}>Putuskan Koneksi</Button>
             </div>
          )}
           
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center gap-4 h-64">
                <AlertCircle className="h-16 w-16 text-destructive" />
                <h3 className="text-xl font-bold">Gagal Terhubung</h3>
                <p className="text-muted-foreground">Tidak dapat memuat kode QR. Silakan coba lagi.</p>
                <Button onClick={generateQrCode}>Coba Lagi</Button>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
