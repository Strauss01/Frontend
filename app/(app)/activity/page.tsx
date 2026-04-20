"use client";

import {
  Activity, FileText, Search, MessageSquare,
  BookOpen, Shield, Download, Filter,
  Calendar, CheckCircle2, Newspaper,
} from "lucide-react";
import { Badge }  from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn }     from "@/lib/utils";
import { useActivity } from "@/features/activity/hooks";

const TYPE_CONFIG: Record<string, {
  icon: React.ElementType;
  bg: string;
  text: string;
  border: string;
  badge: "default" | "success" | "pending" | "warning" | "secondary" | "destructive";
}> = {
  document_upload:   { icon: FileText,      bg: "bg-indigo-50",  text: "text-indigo-600",  border: "border-indigo-100",  badge: "default"   },
  analysis_complete: { icon: CheckCircle2,  bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", badge: "success"   },
  search:            { icon: Search,        bg: "bg-sky-50",     text: "text-sky-600",     border: "border-sky-100",     badge: "pending"   },
  chat_session:      { icon: MessageSquare, bg: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-100",  badge: "secondary" },
  case_law:          { icon: BookOpen,      bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100",   badge: "warning"   },
  gazette:           { icon: Newspaper,     bg: "bg-teal-50",    text: "text-teal-600",    border: "border-teal-100",    badge: "success"   },
  diligence:         { icon: Shield,        bg: "bg-rose-50",    text: "text-rose-600",    border: "border-rose-100",    badge: "secondary" },
  export:            { icon: Download,      bg: "bg-slate-50",   text: "text-slate-600",   border: "border-slate-200",   badge: "secondary" },
};

function timeAgo(iso: string) {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function humaniseType(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ActivityPage() {
  const { data: activity = [], isLoading } = useActivity();

  const statCounts = {
    total:    activity.length,
    uploads:  activity.filter((e: any) => e.event_type === "document_upload").length,
    searches: activity.filter((e: any) => e.event_type === "search").length,
    chats:    activity.filter((e: any) => e.event_type === "chat_session").length,
  };

  return (
    <div className="mx-auto max-w-[1000px] space-y-6 p-6">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-slate-900">Activity Log</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Full audit trail of platform actions across your workspace
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter   className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total events",  value: statCounts.total,    icon: Activity,      from: "from-indigo-500",  to: "to-violet-600"  },
          { label: "Uploads",       value: statCounts.uploads,  icon: FileText,      from: "from-sky-500",     to: "to-cyan-500"    },
          { label: "Searches",      value: statCounts.searches, icon: Search,        from: "from-amber-500",   to: "to-orange-500"  },
          { label: "AI Counsel",    value: statCounts.chats,    icon: MessageSquare, from: "from-emerald-500", to: "to-teal-500"    },
        ].map(({ label, value, icon: Icon, from, to }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${from} ${to} shadow-sm`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              {isLoading
                ? <div className="skeleton h-6 w-10 rounded-md" />
                : <p className="font-mono text-xl font-bold text-slate-900">{value}</p>}
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Timeline ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="font-serif text-lg font-semibold text-slate-900">Recent Events</h2>
            <p className="mt-0.5 font-mono text-xs text-slate-400">
              {isLoading ? "Loading…" : `${activity.length} event${activity.length !== 1 ? "s" : ""} loaded`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="font-mono text-xs text-slate-400">
              {new Date().toLocaleDateString("en-ZA")}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-xl" style={{ animationDelay: `${i * 0.07}s` }} />
            ))}
          </div>
        ) : activity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Activity className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-600">No activity yet</p>
            <p className="mt-1 text-xs text-slate-400">
              Actions taken in this workspace will appear here.
            </p>
          </div>
        ) : (
          <div className="relative px-6 py-4">
            {/* Vertical timeline line */}
            <div className="absolute left-[52px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-100 via-slate-100 to-transparent" />

            <div className="space-y-1">
              {activity.map((event: any, i: number) => {
                const type = event.event_type ?? event.type ?? "export";
                const cfg  = TYPE_CONFIG[type] ?? TYPE_CONFIG["export"];
                const Icon = cfg.icon;

                return (
                  <div
                    key={event.id ?? i}
                    className="group relative flex items-start gap-4 rounded-2xl p-3 transition-all duration-150 hover:bg-slate-50"
                  >
                    {/* Icon node sits on the timeline line */}
                    <div className={cn(
                      "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-all duration-150 group-hover:scale-105",
                      cfg.bg,
                      cfg.border
                    )}>
                      <Icon className={cn("h-4 w-4", cfg.text)} />
                    </div>

                    {/* Content */}
                    <div className="flex min-w-0 flex-1 items-start justify-between gap-3 pt-0.5">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 leading-snug">
                          {event.description ?? event.details ?? humaniseType(type)}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {event.user_email && (
                            <span className="font-mono text-[11px] text-slate-400">
                              {event.user_email}
                            </span>
                          )}
                          {event.user_email && event.created_at && (
                            <span className="text-slate-300">·</span>
                          )}
                          {event.created_at && (
                            <span className="font-mono text-[11px] text-slate-400">
                              {timeAgo(event.created_at)}
                            </span>
                          )}
                          {event.document_name && (
                            <>
                              <span className="text-slate-300">·</span>
                              <span className="font-mono text-[11px] text-indigo-500 truncate max-w-[200px]">
                                {event.document_name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <Badge variant={cfg.badge} className="shrink-0 text-[10px]">
                        {humaniseType(type)}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Load more */}
        {activity.length > 0 && (
          <div className="border-t border-slate-100 px-6 py-4">
            <Button variant="ghost" size="sm" className="w-full text-slate-500 hover:text-indigo-600">
              Load more events
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}