export async function sendLeadNotificationEmail(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    throw new Error("Resend environment variables are not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `New portfolio lead: ${input.subject}`,
      text: [
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        "",
        input.message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    throw new Error("Resend email request failed.");
  }
}
