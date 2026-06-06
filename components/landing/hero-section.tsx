"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
const AnimatedSphere = dynamic(
  () => import("./animated-sphere").then((mod) => mod.AnimatedSphere),
  { ssr: false },
);
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/ui/auth-button";
import { site } from "@/lib/site";

const words = ["create", "share", "see", "grow"];

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <MotionSphereBackground />

      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(8)].map((_, i) => (
          <MotionGridLine key={`h-${i}`} axis="h" index={i} />
        ))}
        {[...Array(12)].map((_, i) => (
          <MotionGridLine key={`v-${i}`} axis="v" index={i} />
        ))}
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
        <div
          className={`mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
            <span className="w-8 h-px bg-foreground/30" />
            {site.tagline}
          </span>
        </div>

        <div className="mb-12">
          <h1
            className={`text-[clamp(3rem,12vw,10rem)] font-display leading-[0.9] tracking-tight transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <span className="block">Short links</span>
            <span className="block">
              you can{" "}
              <span className="relative inline-block">
                <span key={wordIndex} className="inline-flex">
                  {words[wordIndex].split("").map((char, i) => (
                    <span
                      key={`${wordIndex}-${i}`}
                      className="inline-block animate-char-in"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-foreground/10" />
              </span>
            </span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-end">
          <p
            className={`text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {site.description}
          </p>

          <div
            className={`flex flex-col sm:flex-row items-start gap-4 transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <AuthButton className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group">
              <>
                Get started — Sign in
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </>
            </AuthButton>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base rounded-full border-foreground/20 hover:bg-foreground/5"
              asChild
            >
              <a href="#developers">View API examples</a>
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-24 left-0 right-0 transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex gap-16 marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16">
              {[
                { value: "230M+", label: "requests per day" },
                { value: "20ms", label: "typical redirect speed" },
                { value: "0%", label: "errors under load" },
                { value: "6", label: "data points per click" },
                { value: "99.9%", label: "uptime guaranteed" },
                { value: "∞", label: "links you can create" },
                { value: "<1s", label: "link creation time" },
              ].map((stat) => (
                <MotionStat
                  key={`${stat.label}-${stat.value}-${i}`}
                  stat={stat}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MotionSphereBackground() {
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] opacity-40 pointer-events-none" aria-hidden="true">
      <AnimatedSphere />
    </div>
  );
}

function MotionGridLine({ axis, index }: { axis: "h" | "v"; index: number }) {
  if (axis === "h") {
    return (
      <div
        className="absolute h-px bg-foreground/10"
        style={{ top: `${12.5 * (index + 1)}%`, left: 0, right: 0 }}
      />
    );
  }
  return <MotionGridLineV index={index} />;
}

function MotionGridLineV({ index }: { index: number }) {
  return (
    <div
      className="absolute w-px bg-foreground/10"
      style={{ left: `${8.33 * (index + 1)}%`, top: 0, bottom: 0 }}
    />
  );
}

function MotionStat({ stat }: { stat: { value: string; label: string } }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="text-4xl lg:text-5xl font-display">{stat.value}</span>
      <span className="text-sm text-muted-foreground">{stat.label}</span>
    </div>
  );
}
