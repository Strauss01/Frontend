"use client";

import { useState } from "react";
import {
  Scale, Eye, EyeOff, ArrowRight,
  Loader2, ShieldCheck, Zap, BookOpen, FileSearch,
} from "lucide-react";
import { Button }   from "@/components/ui/button";
import { cn }       from "@/lib/utils";
import { useLogin } from "@/features/auth/hooks";

const FEATURES = [
  { icon: FileSearch, label: "AI Document Analysis",     desc: "Instant extraction from SA contracts & pleadings" },
  { icon: BookOpen,   label: "SA Case Law Intelligence", desc: "Search ZACC, ZASCA, SCA & High Court judgments"   },
  { icon: Zap,        label: "Risk & Compliance Scoring",desc: "Flag POPIA, Companies Act & Constitution issues"   },
];

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);

  const login   = useLogin();
  const loading = login.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login.mutate({ email, password });
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[520px] shrink-0 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-violet-400/10 blur-3xl translate-y-1/2 -translate-x-1/2" />
          {/* SA-inspired subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 border border-white/20">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-serif text-2xl font-semibold text-white leading-none">Statura</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-indigo-200 mt-0.5">
              South African Legal Intelligence
            </p>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="font-serif text-4xl font-semibold text-white leading-tight">
              The legal OS<br />for South Africa.
            </h2>
            <p className="mt-4 text-indigo-200 text-sm leading-relaxed max-w-sm">
              Statura unifies SA case law research, document intelligence,
              Government Gazette monitoring and AI-powered risk analysis for
              modern South African legal professionals.
            </p>
          </div>

          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/15">
                  <Icon className="h-4 w-4 text-indigo-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-indigo-300 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* SA flag stripe accent */}
          <div className="flex h-1.5 w-32 overflow-hidden rounded-full gap-0.5">
            <div className="flex-1 bg-[#007A4D]" />
            <div className="flex-1 bg-[#FFB612]" />
            <div className="flex-1 bg-[#DE3831]" />
            <div className="flex-1 bg-[#002395]" />
            <div className="flex-1 bg-white/60" />
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-indigo-300/70">
          <ShieldCheck className="h-3.5 w-3.5" />
          <p className="font-mono text-[10px] uppercase tracking-widest">
            POPIA compliant · End-to-end encrypted · Hosted in South Africa
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-100/60 blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-amber-100/50 blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative z-10 w-full max-w-[400px] animate-in">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-serif text-xl font-semibold text-slate-900">Statura</span>
              <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400">SA Legal Intelligence</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="font-serif text-3xl font-semibold text-slate-900">Welcome back</h1>
            <p className="mt-1.5 text-sm text-slate-500">Sign in to your workspace to continue.</p>
          </div>

          {login.isError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-in">
              {(login.error as Error)?.message ?? "Invalid credentials. Please try again."}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-500">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="advocate@chambers.co.za"
                required
                className={cn(
                  "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm shadow-sm",
                  "text-slate-900 placeholder:text-slate-300",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 hover:border-slate-300"
                )}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-500">
                  Password
                </label>
                <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className={cn(
                    "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-11 text-sm shadow-sm",
                    "text-slate-900 placeholder:text-slate-300",
                    "transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 hover:border-slate-300"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-indigo-600" />
              <span className="text-sm text-slate-600">Keep me signed in</span>
            </label>

            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
                : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Need access?{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}