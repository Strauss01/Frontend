"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Scale, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRegister } from "@/features/auth/hooks";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  tenant_id: z.coerce
    .number({ invalid_type_error: "Must be a number" })
    .int()
    .positive("Must be a positive number"),
  role: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const register_ = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "member" },
  });

  const onSubmit = (values: FormValues) => register_.mutate(values);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-100/60 blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-violet-100/50 blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-200">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-serif text-xl font-semibold text-slate-900">Statura</span>
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400">SA Legal Intelligence</p>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-slate-900">Create account</h1>
          <p className="mt-1.5 text-sm text-slate-500">Join your firm's Statura workspace.</p>
        </div>

        {/* Error */}
        {register_.isError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {(register_.error as Error)?.message ?? "Registration failed. Please try again."}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-500">
              Email address
            </label>
            <input
              type="email"
              placeholder="advocate@chambers.co.za"
              autoComplete="email"
              {...register("email")}
              className={cn(
                "h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm text-slate-900 placeholder:text-slate-300 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 hover:border-slate-300",
                errors.email ? "border-red-300" : "border-slate-200"
              )}
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-500">
              Password
            </label>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              {...register("password")}
              className={cn(
                "h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm text-slate-900 placeholder:text-slate-300 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 hover:border-slate-300",
                errors.password ? "border-red-300" : "border-slate-200"
              )}
            />
            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
          </div>

          {/* Tenant ID */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-500">
              Tenant ID
            </label>
            <input
              type="number"
              placeholder="Your organisation's tenant ID"
              {...register("tenant_id")}
              className={cn(
                "h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm text-slate-900 placeholder:text-slate-300 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 hover:border-slate-300",
                errors.tenant_id ? "border-red-300" : "border-slate-200"
              )}
            />
            {errors.tenant_id && <p className="text-xs text-red-600">{errors.tenant_id.message}</p>}
            <p className="text-xs text-slate-400">
              Ask your administrator for your tenant ID.
            </p>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-500">
              Role <span className="text-slate-300">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="member"
              {...register("role")}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm shadow-sm text-slate-900 placeholder:text-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 hover:border-slate-300"
            />
          </div>

          <Button type="submit" className="h-11 w-full" disabled={register_.isPending}>
            {register_.isPending
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
              : <>Create account <ArrowRight className="h-4 w-4" /></>}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
            Sign in
          </Link>
        </p>

        <div className="mt-8 flex items-center justify-center gap-2 text-slate-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          <p className="font-mono text-[10px] uppercase tracking-widest">
            POPIA compliant · Hosted in South Africa
          </p>
        </div>
      </div>
    </div>
  );
}