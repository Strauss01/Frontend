export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(222_47%_8%)] via-[hsl(222_47%_6%)] to-[hsl(215_60%_10%)]" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 39px,
              hsl(215 28% 22% / 0.5) 39px,
              hsl(215 28% 22% / 0.5) 40px
            ), repeating-linear-gradient(
              90deg,
              transparent,
              transparent 39px,
              hsl(215 28% 22% / 0.5) 39px,
              hsl(215 28% 22% / 0.5) 40px
            )`,
          }}
        />
        {/* Gold accent orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(43 96% 56%) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 text-center space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 text-gold-400 text-sm font-mono tracking-widest uppercase">
            <div className="w-8 h-px bg-gold-400" />
            Legal Intelligence
            <div className="w-8 h-px bg-gold-400" />
          </div>
          <h1 className="font-serif text-5xl font-bold text-white leading-tight">
            Statura
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            AI-powered analysis for complex legal documents. Surface issues,
            structure arguments, and build with confidence.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {["IRAC Analysis", "Citation Extraction", "Confidence Scoring"].map(
              (feature) => (
                <div
                  key={feature}
                  className="rounded-lg border border-border bg-card/50 backdrop-blur p-3 text-center"
                >
                  <p className="text-xs text-muted-foreground font-mono">{feature}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
