import {
  FileText, Search, AlertTriangle, CheckCircle2,
  TrendingUp, Clock, Zap, ArrowRight, ArrowUpRight,
  BookOpen, Scale, Activity, MessageSquare,
} from "lucide-react";
import { Badge }   from "@/components/ui/badge";
import { Button }  from "@/components/ui/button";
import Link        from "next/link";

/* ── Mock data ───────────────────────────────── */
const STATS = [
  { label: "Documents Analyzed", value: "2,847", delta: "+12 today",   icon: FileText,       color: "gold"  },
  { label: "Active Searches",    value: "14",     delta: "3 critical",  icon: Search,         color: "blue"  },
  { label: "Risk Flags",         value: "7",      delta: "2 unresolved",icon: AlertTriangle,  color: "red"   },
  { label: "Resolved Cases",     value: "142",    delta: "+5 this week",icon: CheckCircle2,   color: "green" },
];

const DOCS = [
  { name: "Smith v. Acme Corp — Settlement Agreement",  type: "Contract",   risk: "high",   time: "2h ago",  status: "analyzed" },
  { name: "IP Transfer Agreement — TechVentures Ltd",   type: "IP",         risk: "medium", time: "4h ago",  status: "pending"  },
  { name: "Employment Contract — Sr. Counsel Hire",     type: "Employment", risk: "low",    time: "6h ago",  status: "analyzed" },
  { name: "NDA — Meridian Partners Acquisition",        type: "NDA",        risk: "medium", time: "8h ago",  status: "analyzed" },
  { name: "Board Resolution — Q4 Restructuring",        type: "Corporate",  risk: "low",    time: "1d ago",  status: "analyzed" },
];

const ALERTS = [
  { title: "High-Risk Clause Detected",  desc: "Uncapped liability in Smith v. Acme settlement", sev: "high",    time: "1h ago" },
  { title: "Deadline Approaching",        desc: "72-hr filing window — Meridian case",             sev: "warning", time: "3h ago" },
  { title: "New Case Law Match",          desc: "3 precedents found for IP Transfer Agreement",    sev: "info",    time: "5h ago" },
];

/* ── Page ─────────────────────────────────────── */
export default function DashboardPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-white">Intelligence Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{today}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/documents">
              <FileText className="h-4 w-4" /> Upload Document
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/chat">
              <MessageSquare className="h-4 w-4" /> New Analysis
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Documents table — 2 cols */}
        <div className="glass layer-reasoning rounded-2xl p-6 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-semibold text-white">Recent Documents</h2>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">Latest intelligence activity</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
          <div className="space-y-1">
            {DOCS.map((d, i) => <DocRow key={i} {...d} />)}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Alerts */}
          <div className="glass layer-risk rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-white">Alerts</h2>
              <Badge variant="destructive" className="text-[10px]">{ALERTS.length} active</Badge>
            </div>
            <div className="space-y-3">
              {ALERTS.map((a, i) => <AlertItem key={i} {...a} />)}
            </div>
          </div>

          {/* Quick actions */}
          <div className="glass layer-authority rounded-2xl p-6">
            <h2 className="font-serif text-base font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-1.5">
              {[
                { label: "Search Case Law",    href: "/caselaw",   icon: BookOpen  },
                { label: "Run Due Diligence",  href: "/diligence", icon: Scale     },
                { label: "View Activity Log",  href: "/activity",  icon: Activity  },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5 transition-all duration-200 hover:border-primary/20 hover:bg-white/10"
                >
                  <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">{label}</span>
                  <ArrowUpRight className="ml-auto h-3 w-3 text-primary opacity-0 transition-all group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Status ticker ── */}
      <div className="glass rounded-xl border border-primary/15 px-6 py-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex shrink-0 items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-primary">Live Status</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>AI Engine: <span className="text-green-400">Online</span></span>
            <span>Case Law DB: <span className="text-green-400">Updated 2h ago</span></span>
            <span>Gazette: <span className="text-green-400">Live</span></span>
            <span>Queue: <span className="text-yellow-400">3 documents</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ───────────────────────────── */

function StatCard({ label, value, delta, icon: Icon, color }: {
  label: string; value: string; delta: string;
  icon: React.ElementType; color: string;
}) {
  const palette: Record<string, { layer: string; text: string; bg: string }> = {
    gold:  { layer: "layer-authority", text: "text-yellow-400", bg: "bg-yellow-500/10" },
    blue:  { layer: "layer-reasoning", text: "text-blue-400",   bg: "bg-blue-500/10"   },
    red:   { layer: "layer-risk",      text: "text-red-400",    bg: "bg-red-500/10"    },
    green: { layer: "",                text: "text-green-400",  bg: "bg-green-500/10"  },
  };
  const { layer, text, bg } = palette[color] ?? palette.blue;

  return (
    <div className={`glass ${layer} rounded-2xl p-5`}>
      <div className="mb-3 flex items-start justify-between">
        <div className={`rounded-lg p-2 ${bg}`}>
          <Icon className={`h-4 w-4 ${text}`} />
        </div>
        <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/40" />
      </div>
      <p className="font-mono text-2xl font-semibold text-white">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1.5 font-mono text-xs ${text}`}>{delta}</p>
    </div>
  );
}

function DocRow({ name, type, risk, time, status }: {
  name: string; type: string; risk: string; time: string; status: string;
}) {
  const riskMap: Record<string, { variant: "destructive"|"warning"|"success"; label: string }> = {
    high:   { variant: "destructive", label: "High Risk" },
    medium: { variant: "warning",     label: "Medium"    },
    low:    { variant: "success",     label: "Low Risk"  },
  };
  const { variant, label } = riskMap[risk] ?? { variant: "outline" as const, label: risk };

  return (
    <div className="group flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-white/8 hover:bg-white/5">
      <div className="shrink-0 rounded-lg bg-white/5 p-2">
        <FileText className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-foreground transition-colors group-hover:text-white">{name}</p>
        <p className="mt-0.5 font-mono text-xs text-muted-foreground">{type} · {time}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant={variant} className="text-[10px]">{label}</Badge>
        {status === "analyzed"
          ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
          : <Clock        className="h-3.5 w-3.5 text-yellow-400" />}
      </div>
    </div>
  );
}

function AlertItem({ title, desc, sev, time }: {
  title: string; desc: string; sev: string; time: string;
}) {
  const cfg: Record<string, { color: string; bg: string; dot: string }> = {
    high:    { color: "text-red-400",    bg: "bg-red-500/10",    dot: "bg-red-400"    },
    warning: { color: "text-yellow-400", bg: "bg-yellow-500/10", dot: "bg-yellow-400" },
    info:    { color: "text-blue-400",   bg: "bg-blue-500/10",   dot: "bg-blue-400"   },
  };
  const { color, bg, dot } = cfg[sev] ?? cfg.info;

  return (
    <div className={`rounded-xl border border-white/5 p-3 ${bg}`}>
      <div className="flex items-start gap-2.5">
        <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
        <div>
          <p className={`text-xs font-medium ${color}`}>{title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground/50">{time}</p>
        </div>
      </div>
    </div>
  );
}