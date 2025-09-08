"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function SplashScreen() {
  const [isDone, setIsDone] = useState(false);
  const splashRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    if (!splashRef.current || !logoRef.current || !svgRef.current) return;

    const ctx = gsap.context(() => {
      // Prepare text
      const letters = logoRef.current!.textContent!.split("");
      logoRef.current!.innerHTML = letters
        .map((l) => `<span class="inline-block opacity-0">${l}</span>`)
        .join("");
      const letterSpans = logoRef.current!.querySelectorAll("span");

      // Get SVG paths for animation
      const purplePath = svgRef.current!.querySelector(".purple-path");
      const greenPath = svgRef.current!.querySelector(".green-path");

      // Set initial states
      gsap.set(letterSpans, { opacity: 0, y: 20 });
      gsap.set(logoRef.current, { opacity: 0 });
      gsap.set([purplePath, greenPath], {
        fill: "none",
        stroke: "#374151",
        strokeWidth: 1,
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          setIsDone(true);
        },
      });

      // Get path lengths
      const purpleLength = (purplePath as SVGPathElement).getTotalLength();
      const greenLength = (greenPath as SVGPathElement).getTotalLength();

      // Set initial stroke dash properties
      gsap.set(purplePath, {
        strokeDasharray: purpleLength,
        strokeDashoffset: purpleLength,
      });
      gsap.set(greenPath, {
        strokeDasharray: greenLength,
        strokeDashoffset: greenLength,
      });

      // Draw stroke paths first
      tl.to(purplePath, {
        strokeDashoffset: 0,
        duration: 1,
        ease: "power2.inOut",
      })
        .to(
          greenPath,
          {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: "power2.inOut",
          },
          "-=0.3",
        )
        // Fill purple path
        .to(purplePath, {
          fill: "#7a5ea1",
          duration: 0.8,
          ease: "power2.inOut",
        })
        // Fill green path
        .to(
          greenPath,
          {
            fill: "#95c17b",
            duration: 0.6,
            ease: "power2.inOut",
          },
          "-=0.4",
        )
        // Show and animate text after SVG is filled
        .to(logoRef.current, {
          opacity: 1,
          duration: 0.3,
        })
        .to(letterSpans, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "power3.out",
        })
        // Hold for a moment then fade out
        .to(splashRef.current, {
          opacity: 0,
          duration: 1,
          delay: 1.5,
        });
    }, splashRef);

    return () => ctx.revert();
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={splashRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8 bg-neutral-100"
    >
      <svg
        ref={svgRef}
        width="64px"
        height="64px"
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        className="iconify iconify--twemoji"
        preserveAspectRatio="xMidYMid meet"
      >
        
        <g id="SVGRepo_iconCarrier">
          <path
            className="purple-path"
            d="M6 4c3 0 5 2 8 6s7.957 7.191 12 8c5 1 9 5 9 11c0 4.897-3.846 7-9 7c-5 0-9-3-14-8S2 14 2 10s1-6 4-6z"
            fill="none"
            stroke="none"
          ></path>
          <path
            className="green-path"
            d="M3.515 0c1.248 0 1.248 1.248 1.248 2.495c0 1.764 1.248 1.129 2.496 1.129C8.505 3.624 11 6 11 6H7.258c-1.248 0 0 2.614-1.248 2.614S4.762 7.426 3.515 7.426S2 11 2 11s-1.604-4.153.267-6.024C3.515 3.728 1.02 0 3.515 0z"
            fill="none"
            stroke="none"
          ></path>
        </g>
      </svg>
      <h1
        ref={logoRef}
        className="text-5xl font-extrabold tracking-wide text-neutral-800 opacity-0"
      >
        AEp Store
      </h1>
    </div>
  );
}
