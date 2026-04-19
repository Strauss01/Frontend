"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, FileText, Bot, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { askQuestion } from "@/lib/services";
import { useDocuments } from "@/features/documents/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message { role: "user" | "assistant"; content: string; }

export default function ChatPage() {
  const { data: documents } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const selectedDoc = documents?.find((d: any) => d.id === selectedDocId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { mutate: ask, isPending } = useMutation({
    mutationFn: () => askQuestion(selectedDocId!, input, messages),
    onMutate: () => {
      setMessages(prev => [...prev, { role: "user", content: input }]);
      setInput("");
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    },
    onError: () => toast.error("Failed to get response."),
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedDocId || isPending) return;
    ask();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] space-y-4 animate-in">
      <div>
        <p className="text-xs font-mono text-gold-400 tracking-widest uppercase mb-1">AI Chat</p>
        <h1 className="font-serif text-3xl font-bold text-white">Chat with Documents</h1>
        <p className="text-muted-foreground mt-1">Ask legal questions about any uploaded document.</p>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Document selector */}
        <div className="w-56 shrink-0 space-y-2 overflow-y-auto">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest px-1">Documents</p>
          {documents?.map((doc: any) => (
            <button
              key={doc.id}
              onClick={() => { setSelectedDocId(doc.id); setMessages([]); }}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left text-sm transition-all",
                selectedDocId === doc.id
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border hover:border-primary/30 text-muted-foreground"
              )}
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate text-xs">{doc.title}</span>
            </button>
          ))}
          {!documents?.length && (
            <p className="text-xs text-muted-foreground px-1">No documents uploaded.</p>
          )}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selectedDocId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Select a document to start chatting</p>
              </div>
            </div>
          ) : (
            <>
              {/* Document badge */}
              <div className="flex items-center gap-2 px-4 py-2 mb-3 rounded-lg bg-primary/10 border border-primary/20">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-mono text-primary truncate">{selectedDoc?.title}</span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <Bot className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">Ask anything about this document</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {["Summarise this document", "What are the key obligations?", "What are the risks?", "Identify any red flags"].map(q => (
                        <button
                          key={q}
                          onClick={() => { setInput(q); }}
                          className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="h-3.5 w-3.5 text-primary" />
                      </div>
                    )}
                    <div className={cn(
                      "max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground"
                    )}>
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isPending && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="bg-card border border-border rounded-xl px-4 py-3">
                      <div className="flex gap-1">
                        {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="flex gap-2 mt-2">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask a legal question about this document…"
                  disabled={isPending}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isPending}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
