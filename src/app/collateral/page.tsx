'use client';
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileUp, Car, FileText, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { collaterals as allCollaterals } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function CollateralPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredCollaterals = allCollaterals.filter(c =>
        c.debtorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="flex flex-col gap-8">
      <Header title="Collateral">
        <Button variant="outline">
          <FileUp className="mr-2 h-4 w-4" />
          Import Data
        </Button>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Collateral
        </Button>
      </Header>
      <main>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Collateral Assets</CardTitle>
                <CardDescription>Manage collateral assets including vehicles and leases.</CardDescription>
                <div className="pt-4">
                    <Input
                        placeholder="Filter by debtor or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="hidden sm:table-cell">Debtor</TableHead>
                                <TableHead className="text-right">Value</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCollaterals.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        {item.type === 'vehicle' ? <Car className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                                        <span className="capitalize">{item.type}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{item.description}</TableCell>
                                <TableCell className="hidden sm:table-cell">{item.debtorName}</TableCell>
                                <TableCell className="text-right">${item.value.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
