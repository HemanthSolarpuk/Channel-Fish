import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatMessage {
  role: "system" | "user";
  text: string;
}

export function WorkflowChat({ messages }: { messages: ChatMessage[] }) {
  const [input, setInput] = useState("");

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full shrink-0">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Ubik Workflow Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-xs p-2 rounded-lg max-w-[95%] ${
              msg.role === "system"
                ? "bg-secondary text-secondary-foreground"
                : "bg-primary/15 text-foreground ml-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-border flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this order..."
          className="text-xs h-8"
        />
        <Button size="icon" className="h-8 w-8 shrink-0">
          <Send className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
