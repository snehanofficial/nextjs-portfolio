"use client";

import { useActionState } from "react";

import { submitLeadAction } from "@/app/(public)/_actions/contact";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { emptyActionState } from "@/lib/validation/common";

export function ContactForm() {
  const [state, action] = useActionState(submitLeadAction, emptyActionState);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          error={state.fieldErrors?.name?.[0]}
          label="Name"
          name="name"
          placeholder="Your name"
        />
        <Input
          error={state.fieldErrors?.email?.[0]}
          label="Email"
          name="email"
          placeholder="you@example.com"
          type="email"
        />
      </div>
      <Input
        error={state.fieldErrors?.subject?.[0]}
        label="Subject"
        name="subject"
        placeholder="Let’s build something"
      />
      <Textarea
        error={state.fieldErrors?.message?.[0]}
        label="Message"
        name="message"
        placeholder="Share a few details about the project or opportunity."
      />
      <FormMessage state={state} />
      <SubmitButton pendingLabel="Sending...">Send message</SubmitButton>
    </form>
  );
}
