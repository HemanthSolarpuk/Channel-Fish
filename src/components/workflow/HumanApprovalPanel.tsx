import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface HumanApprovalPanelProps {
  title?: string;
  quickActions: string[];
  placeholder: string;
}

export function HumanApprovalPanel({
  title,
  quickActions,
  placeholder,
}: HumanApprovalPanelProps) {
  const [draft, setDraft] = useState("");

  const appendQuickAction = (action: string) => {
    setDraft((current) => (current.trim() ? `${current}\n${action}` : action));
  };

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-3 space-y-3">
      {title ? <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{title}</p> : null}

      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <Button
            key={action}
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2 text-[11px]"
            onClick={() => appendQuickAction(action)}
          >
            {action}
          </Button>
        ))}
      </div>

      <Textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        className="min-h-[72px] resize-none bg-background/70 text-sm"
      />

      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          className="h-7 shrink-0 gap-1.5 px-2.5 text-[11px]"
          disabled={!draft.trim()}
        >
          <Send className="h-3.5 w-3.5" />
          Send
        </Button>
      </div>
    </div>
  );
}
