import React from "react";

const steps = [
  "Analysing your event requirements...",
  "Searching global venue database...",
  "Matching budget and preferences...",
  "Crafting your personalised proposal...",
];

export default function LoadingState() {
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % steps.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        {/* Animated ring */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-border" />
          <div className="absolute inset-0 rounded-full border-2 border-t-gold border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-2 rounded-full border border-gold/20" />
          <span className="absolute inset-0 flex items-center justify-center text-gold text-xl">✦</span>
        </div>

        <p className="font-display text-lg text-offwhite mb-2">AI is planning your event</p>
        <p className="text-muted text-sm font-body transition-all duration-500">{steps[step]}</p>

        {/* Shimmer bars */}
        <div className="mt-6 space-y-3">
          {[80, 60, 70].map((w, i) => (
            <div
              key={i}
              className="shimmer-card h-3 rounded-full mx-auto"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
