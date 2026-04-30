import { LeadStatusForm } from "@/components/admin/lead-status-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getAdminLeads } from "@/lib/dal/admin";

export default async function AdminLeadsPage() {
  const leads = await getAdminLeads();

  return (
    <div className="grid gap-5">
      {leads.length === 0 ? (
        <Card>
          <p className="text-sm text-neutral-600">No leads have been captured yet.</p>
        </Card>
      ) : null}
      {leads.map((lead) => (
        <Card key={lead.id} className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-neutral-950">{lead.subject}</h2>
              <Badge tone={lead.status === "NEW" ? "warning" : "success"}>{lead.status}</Badge>
            </div>
            <div className="text-sm text-neutral-600">
              <p>{lead.name}</p>
              <p>{lead.email}</p>
              <p>{formatDate(lead.createdAt)}</p>
            </div>
            <p className="text-sm leading-7 text-neutral-700">{lead.message}</p>
            {lead.notificationError ? (
              <p className="text-sm text-red-600">
                Notification issue: {lead.notificationError}
              </p>
            ) : null}
          </div>
          <LeadStatusForm id={lead.id} notes={lead.notes} status={lead.status} />
        </Card>
      ))}
    </div>
  );
}
