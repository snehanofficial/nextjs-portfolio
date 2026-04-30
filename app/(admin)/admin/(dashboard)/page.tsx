import { Card } from "@/components/ui/card";
import { getAdminOverview } from "@/lib/dal/admin";

export default async function AdminOverviewPage() {
  const overview = await getAdminOverview();

  const stats = [
    { label: "Projects", value: overview.projectCount },
    { label: "Published projects", value: overview.publishedCount },
    { label: "Skills", value: overview.skillCount },
    { label: "Leads", value: overview.leadCount },
  ];

  return (
    <section className="grid gap-5 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="grid gap-2">
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">{stat.label}</p>
          <p className="text-4xl font-semibold text-neutral-950">{stat.value}</p>
        </Card>
      ))}
    </section>
  );
}
