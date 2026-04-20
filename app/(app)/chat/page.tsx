"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send, Bot, User, Sparkles, FileText,
  Scale, RotateCcw, Copy, ThumbsUp,
  ThumbsDown, Paperclip, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge }  from "@/components/ui/badge";
import { cn }     from "@/lib/utils";
import { useChat } from "@/features/chat/hooks";

const STARTERS = [
  {
    icon:   FileText,
    label:  "Summarise a SA contract",
    prompt: "Please summarise the key terms, obligations and risks in this South African contract.",
  },
  {
    icon:   Scale,
    label:  "Identify risk clauses",
    prompt: "Identify and explain any high-risk, unusual or non-standard clauses in this document under South African law.",
  },
  {
    icon:   Sparkles,
    label:  "Explain SA legal concept",
    prompt: "Explain the South African legal concept of ubuntu and its influence on constitutional jurisprudence.",
  },
  {
    icon:   FileText,
    label:  "POPIA compliance check",
    prompt: "Review this document for POPIA compliance issues — identify any data processing clauses that may be non-compliant.",
  },
  {
    icon:   Scale,
    label:  "Companies Act analysis",
    prompt: "Analyse this document for compliance with the Companies Act 71 of 2008 and identify any directorial duty issues.",
  },
  {
    icon:   Sparkles,
    label:  "Draft a clause",
    prompt: "Draft a South African law governed restraint of trade clause that is reasonable and enforceable.",
  },
];

export default function ChatPage() {
  const [input,  setInput]  = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, isLoading, reset } = useChat();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    sendMessage(trimmed);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleCopy(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-50">

      {/* ── Session topbar ── */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-xl px-6 py-3 shrink-0 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">AI Counsel</p>
            <div className="flex items-center gap-1.5">
              <div className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </div>
              <span className="font-mono text-[10px] text-emerald-600">
                Groq · LLaMA 3.1 · SA Law
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasMessages && (
            <Badge variant="secondary" className="font-mono text-[10px]">
              {messages.length} message{messages.length !== 1 ? "s" : ""}
            </Badge>
          )}
          {hasMessages && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
            >
              <RotateCcw className="h-3 w-3" /> New session
            </button>
          )}
        </div>
      </div>

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (

          /* ── Welcome state ── */
          <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-200 animate-float">
                <Scale className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 border-2 border-white shadow-sm">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>

            <h2 className="mt-6 font-serif text-2xl font-semibold text-slate-900">
              AI Counsel — South African Law
            </h2>
            <p className="mt-2 max-w-lg text-sm text-slate-500 leading-relaxed">
              Powered by Groq and trained on South African jurisprudence. Ask questions
              about SA contracts, the Constitution, POPIA, Companies Act, Labour law,
              case law, or upload a document for instant analysis.
            </p>

            <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {STARTERS.map(({ icon: Icon, label, prompt }) => (
                <button
                  key={label}
                  onClick={() => {
                    setInput(prompt);
                    textareaRef.current?.focus();
                  }}
                  className="group flex flex-col items-start gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                    <Icon className="h-4 w-4 text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition-colors leading-snug">
                    {label}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                "Constitutional law",
                "POPIA compliance",
                "Companies Act",
                "Labour disputes",
                "Contract analysis",
                "Delict / Tort",
                "Property law",
                "Insolvency",
                "Tax law",
                "B-BBEE",
              ].map((cap) => (
                <span
                  key={cap}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-[11px] text-slate-500 shadow-sm"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

        ) : (

          /* ── Conversation ── */
          <div className="mx-auto max-w-[820px] space-y-6 px-4 py-6 sm:px-6">
            {messages.map((msg: any, i: number) => (
              <div
                key={msg.id ?? i}
                className={cn(
                  "flex items-start gap-3 animate-in",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm",
                  msg.role === "user"
                    ? "bg-gradient-to-br from-slate-600 to-slate-800"
                    : "bg-gradient-to-br from-indigo-500 to-violet-600"
                )}>
                  {msg.role === "user"
                    ? <User className="h-4 w-4 text-white" />
                    : <Bot  className="h-4 w-4 text-white" />}
                </div>

                {/* Bubble */}
                <div className={cn(
                  "group relative max-w-[78%] rounded-2xl px-5 py-4 shadow-sm",
                  msg.role === "user"
                    ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-sm"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
                )}>
                  <p className={cn(
                    "text-sm leading-relaxed whitespace-pre-wrap",
                    msg.role === "user" ? "text-white" : "text-slate-700"
                  )}>
                    {msg.content}
                  </p>

                  <p className={cn(
                    "mt-2 font-mono text-[10px]",
                    msg.role === "user" ? "text-indigo-200" : "text-slate-400"
                  )}>
                    {msg.created_at
                      ? new Date(msg.created_at).toLocaleTimeString("en-ZA", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "just now"}
                  </p>

                  {/* AI message actions */}
                  {msg.role === "assistant" && (
                    <div className="absolute -bottom-9 left-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150">
                      <button
                        onClick={() => handleCopy(msg.content, i)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 font-mono text-[10px] text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 shadow-sm transition-all"
                      >
                        {copied === i
                          ? <><Check   className="h-3 w-3 text-emerald-500" /> Copied</>
                          : <><Copy    className="h-3 w-3" /> Copy</>}
                      </button>
                      <button className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 font-mono text-[10px] text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 shadow-sm transition-all">
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                      <button className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 font-mono text-[10px] text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 shadow-sm transition-all">
                        <ThumbsDown className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} className="h-10" />
          </div>
        )}
      </div>

      {/* ── Input bar ── */}
      <div className="shrink-0 border-t border-slate-200 bg-white/90 backdrop-blur-xl px-4 py-4 sm:px-6">
        <form onSubmit={handleSend} className="mx-auto max-w-[820px]">
          <div className={cn(
            "relative flex items-end gap-3 rounded-2xl border bg-white p-3 shadow-sm transition-all duration-200",
            "border-slate-200 hover:border-slate-300",
            "focus-within:border-indigo-400 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.08)]"
          )}>
            <button
              type="button"
              className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about SA law, a contract clause, POPIA, Companies Act…"
              rows={1}
              className="max-h-[180px] flex-1 resize-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none leading-relaxed"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-150",
                input.trim() && !isLoading
                  ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-2 text-center font-mono text-[10px] text-slate-400">
            <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px]">Enter</kbd> to send ·{" "}
            <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px]">Shift + Enter</kbd> for new line ·{" "}
            Powered by Groq · LLaMA 3.1 · SA jurisprudence
          </p>
        </form>
      </div>
    </div>
  );
}