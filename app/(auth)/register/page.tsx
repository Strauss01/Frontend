"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-8 animate-in">
      <div className="space-y-2">
        <p className="text-xs font-mono text-gold-400 tracking-widest uppercase">
          Legal Intelligence Platform
        </p>
        <h1 className="font-serif text-4xl font-bold text-white">
          Create account
        </h1>
        <p className="text-muted-foreground">
          Join your firm's Statura workspace
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@firm.com"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tenant_id">Tenant ID</Label>
          <Input
            id="tenant_id"
            type="number"
            placeholder="Your organisation's tenant ID"
            {...register("tenant_id")}
          />
          {errors.tenant_id && (
            <p className="text-xs text-destructive">
              {errors.tenant_id.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Ask your administrator for your tenant ID, or{" "}
            <Link href="/tenant" className="text-gold-400 hover:underline">
              create a new workspace
            </Link>
            .
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role">Role (optional)</Label>
          <Input
            id="role"
            type="text"
            placeholder="e.g. member, admin"
            {...register("role")}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={register_.isPending}
        >
          {register_.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-gold-400 hover:text-gold-300 transition-colors underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
