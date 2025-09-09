import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { templates } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function TemplateList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Saved Templates</CardTitle>
        <CardDescription>
          Your collection of WhatsApp message templates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {templates.map(template => (
            <Card key={template.id} className="shadow-none border">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-base font-semibold">{template.name}</CardTitle>
                            <CardDescription className="text-xs pt-1">Created on {new Date(template.createdAt).toLocaleDateString()}</CardDescription>
                        </div>
                        <Badge variant="outline" className="capitalize">{template.scenario}</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-md">{template.content}</p>
                </CardContent>
                <CardFooter className="gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                </CardFooter>
            </Card>
        ))}
      </CardContent>
    </Card>
  );
}
