import { GlassCard } from "@/components/ui/glass-card";

export function ArgumentSimulator({ simulation }: any) {
  if (!simulation) return null;

  return (
    <div className="space-y-4">

      <GlassCard className="p-5">
        <h2 className="font-semibold">⚖️ Outcome Prediction</h2>
        <p className="text-sm text-white/70 mt-2">
          Likely: {simulation.judicial_view?.leaning}
        </p>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <GlassCard className="p-5 border-blue-500/20">
          <h3 className="text-blue-300 font-semibold">Applicant</h3>
          {simulation.applicant?.arguments?.map((a: any, i: number) => (
            <div key={i} className="mt-3 p-3 bg-white/5 rounded-xl">
              <p>{a.point}</p>
            </div>
          ))}
        </GlassCard>

        <GlassCard className="p-5 border-red-500/20">
          <h3 className="text-red-300 font-semibold">Respondent</h3>
          {simulation.respondent?.arguments?.map((a: any, i: number) => (
            <div key={i} className="mt-3 p-3 bg-white/5 rounded-xl">
              <p>{a.point}</p>
            </div>
          ))}
        </GlassCard>

      </div>
    </div>
  );
}