import { Header } from "@/components/layout/header";
import { TemplateGenerator } from "@/components/templates/template-generator";
import { TemplateList } from "@/components/templates/template-list";

export default function TemplatesPage() {
  return (
    <div className="flex flex-col gap-8">
      <Header title="Message Templates" />
      <main className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TemplateList />
        </div>
        <div className="lg:col-span-2">
          <TemplateGenerator />
        </div>
      </main>
    </div>
  );
}
