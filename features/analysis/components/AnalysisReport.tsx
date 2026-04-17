"use client";

import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, BookOpen, Quote, Lightbulb, BarChart2 } from "lucide-react";
import type { Analysis } from "@/features/analysis/types";

interface Props {
  analysis: Analysis;
}

export function AnalysisReport({ analysis }: Props) {
  const score = Math.round(analysis.confidence_score * 100);
  const chartData = [{ value: score, fill: "hsl(43, 96%, 56%)" }];

  return (
    <div className="space-y-6 animate-in">
      {/* Confidence score header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-5 rounded-lg border border-border bg-card">
        <div className="w-28 h-28 shrink-0 mx-auto sm:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="100%"
              barSize={10}
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" cornerRadius={5} background={{ fill: "hsl(215 28% 17%)" }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
            Confidence Score
          </p>
          <p className="font-serif text-5xl font-bold text-white">{score}%</p>
          <p className="text-sm text-muted-foreground mt-2">
            {score >= 80
              ? "High confidence — strong legal foundation."
              : score >= 60
              ? "Moderate confidence — some areas merit closer review."
              : "Low confidence — significant review recommended."}
          </p>
        </div>
      </div>

      {/* Summary */}
      <Section icon={<BookOpen className="h-4 w-4" />} title="Summary">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {analysis.summary}
        </p>
      </Section>

      <Separator />

      {/* Issues */}
      {analysis.issues.length > 0 && (
        <>
          <Section icon={<AlertCircle className="h-4 w-4" />} title="Identified Issues">
            <ul className="space-y-2">
              {analysis.issues.map((issue, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                  <span className="font-mono text-destructive shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  {issue}
                </li>
              ))}
            </ul>
          </Section>
          <Separator />
        </>
      )}

      {/* IRAC */}
      <Section icon={<Lightbulb className="h-4 w-4" />} title="IRAC Analysis">
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              { key: "issue", label: "Issue" },
              { key: "rule", label: "Rule" },
              { key: "application", label: "Application" },
              { key: "conclusion", label: "Conclusion" },
            ] as const
          ).map(({ key, label }) => (
            <div
              key={key}
              className="rounded-lg border border-border bg-muted/30 p-4 space-y-1.5"
            >
              <p className="text-[11px] font-mono text-gold-400 uppercase tracking-widest">
                {label}
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {analysis.irac[key]}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Citations */}
      {analysis.citations.length > 0 && (
        <>
          <Separator />
          <Section icon={<Quote className="h-4 w-4" />} title="Citations">
            <ul className="space-y-2">
              {analysis.citations.map((cite, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-sm text-muted-foreground font-mono"
                >
                  <span className="text-primary shrink-0">[{i + 1}]</span>
                  {cite}
                </li>
              ))}
            </ul>
          </Section>
        </>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <h3 className="font-serif text-base font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}
