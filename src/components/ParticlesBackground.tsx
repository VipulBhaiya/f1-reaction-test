// src/components/ParticlesBackground.tsx
import React, { useEffect, useMemo, useState } from "react";
import Particles from "@tsparticles/react";
import type { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { initParticlesEngine } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";

const ParticlesBackground: React.FC = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    let isMounted = true;

    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      if (isMounted) setInit(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const options: ISourceOptions = useMemo(() => ({
    background: {
      color: "#0a0a0a", // Carbon fiber-like black
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "trail",
        },
        resize: true,
      },
      modes: {
        trail: {
          delay: 0.1,
          quantity: 2,
          particles: {
            color: { value: "#ff1801" }, // Ferrari red
            move: {
              speed: 5,
              direction: "right",
              outModes: { default: "destroy" },
            },
          },
        },
      },
    },
    particles: {
      color: { value: ["#ff1801", "#ffffff", "#ffcc00"] },
      links: {
        enable: true,
        color: "#ff1801",
        distance: 120,
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2.5,
        direction: "none",
        outModes: { default: "bounce" },
      },
      number: {
        value: 100,
        density: { enable: true, area: 1000 },
      },
      opacity: { value: 0.6 },
      shape: { type: ["circle", "edge"] }, // Mix of circles and lines
      size: { value: { min: 1, max: 4 } },
    },
    detectRetina: true,
  }), []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    />
  );
};

export default ParticlesBackground;
