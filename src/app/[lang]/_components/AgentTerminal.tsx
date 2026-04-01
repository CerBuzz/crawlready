"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { AgentStepResult, AgentStepStatus, AgentTestResult } from "@/lib/types";

// --- Terminal line model ---

interface TerminalLine {
  text: string;
  type: "header" | "action" | "result" | "substep" | "blank" | "verdict";
  status?: AgentStepStatus;
}

const STEP_LABELS: Record<string, string> = {
  discovery: "Discovery",
  navigation: "Navigation",
  contact: "Contact Discovery",
  agent_ready_forms: "Agent-Ready Forms",
  form_operability: "Agent-Ready Forms", // legacy compat
  structured_data: "Structured Data",
  verdict: "Verdict",
};

const STATUS_ICON: Record<AgentStepStatus, string> = {
  pass: "\u2713",
  partial: "\u25CF",
  fail: "\u2717",
};

function stepToLines(step: AgentStepResult, index: number, total: number): TerminalLine[] {
  const lines: TerminalLine[] = [];
  const label = STEP_LABELS[step.step] || step.step;

  if (step.step === "verdict") {
    lines.push({ text: "", type: "blank" });
    lines.push({ text: "\u2500".repeat(50), type: "blank" });
    lines.push({
      text: `${STATUS_ICON[step.status]} VERDICT: ${step.status.toUpperCase()}`,
      type: "verdict",
      status: step.status,
    });
    lines.push({ text: step.details, type: "verdict", status: step.status });
    return lines;
  }

  lines.push({ text: "", type: "blank" });
  lines.push({ text: `[${index + 1}/${total}] ${label}`, type: "header" });
  lines.push({ text: `> ${step.action}`, type: "action" });

  if (step.substeps) {
    for (const sub of step.substeps) {
      const icon = STATUS_ICON[sub.status];
      const detail = sub.detail ? ` \u2014 ${sub.detail}` : "";
      lines.push({
        text: `  ${icon} ${sub.label}${detail}`,
        type: "substep",
        status: sub.status,
      });
    }
  }

  lines.push({
    text: `  ${STATUS_ICON[step.status]} ${step.details}`,
    type: "result",
    status: step.status,
  });

  return lines;
}

// --- Color helpers ---

function statusColor(status?: AgentStepStatus): string {
  if (!status) return "text-zinc-400";
  switch (status) {
    case "pass": return "text-success";
    case "partial": return "text-warning";
    case "fail": return "text-danger";
  }
}

function lineColor(line: TerminalLine): string {
  switch (line.type) {
    case "header": return "text-accent font-bold";
    case "action": return "text-zinc-500";
    case "result": return statusColor(line.status);
    case "substep": return statusColor(line.status);
    case "verdict": return `${statusColor(line.status)} font-bold`;
    case "blank": return "text-zinc-600";
  }
}

// --- Props ---

interface AgentTerminalProps {
  /** Live mode: URL to test */
  url?: string;
  /** Live mode: task description */
  task?: string;
  /** Replay mode: pre-computed steps */
  steps?: AgentStepResult[];
  /** Animation speed in ms between lines (default 500) */
  speed?: number;
  /** Auto-start animation (default true) */
  autoStart?: boolean;
  /** Callback when test completes */
  onComplete?: (result: AgentTestResult | null) => void;
}

export default function AgentTerminal({
  url,
  task,
  steps: precomputedSteps,
  speed = 500,
  autoStart = true,
  onComplete,
}: AgentTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [allTargetLines, setAllTargetLines] = useState<TerminalLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Animate lines one by one
  const animateLines = useCallback(
    (targetLines: TerminalLine[], startFrom: number = 0) => {
      let i = startFrom;
      const tick = () => {
        if (i >= targetLines.length) {
          setIsDone(true);
          setIsRunning(false);
          return;
        }
        setLines(targetLines.slice(0, i + 1));
        i++;
        // Vary speed: headers slower, blanks instant
        const currentLine = targetLines[i - 1];
        let delay = speed;
        if (currentLine?.type === "blank") delay = 40;
        if (currentLine?.type === "header") delay = speed * 2;
        if (currentLine?.type === "verdict") delay = speed * 3;
        animationRef.current = setTimeout(tick, delay);
      };
      tick();
    },
    [speed]
  );

  // Replay mode
  useEffect(() => {
    if (!precomputedSteps || !autoStart) return;

    const totalSteps = precomputedSteps.filter((s) => s.step !== "verdict").length;
    const introLines: TerminalLine[] = [
      { text: "$ Initializing CrawlReady Agent v1.0...", type: "action" },
      { text: `$ Target: ${precomputedSteps[0]?.action?.match(/https?:\/\/[^\s)]+/)?.[0] || "unknown"}`, type: "action" },
      { text: `$ Task: "${task || "find this business and request a quote"}"`, type: "action" },
    ];

    const stepLines: TerminalLine[] = [];
    let stepIndex = 0;
    for (const step of precomputedSteps) {
      const isVerdict = step.step === "verdict";
      stepLines.push(...stepToLines(step, stepIndex, totalSteps));
      if (!isVerdict) stepIndex++;
    }

    const all = [...introLines, ...stepLines];
    setAllTargetLines(all);
    setIsRunning(true);
    animateLines(all);

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [precomputedSteps, autoStart]);

  // Live mode
  const startLiveTest = useCallback(async () => {
    if (!url) return;
    setIsRunning(true);
    setIsDone(false);
    setLines([]);

    const introLines: TerminalLine[] = [
      { text: "$ Initializing CrawlReady Agent v1.0...", type: "action" },
      { text: `$ Target: ${url}`, type: "action" },
      { text: `$ Task: "${task || "find this business and request a quote"}"`, type: "action" },
    ];
    setLines(introLines);

    try {
      const res = await fetch("/api/agent-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, task }),
      });

      if (!res.body) throw new Error("No response stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let currentLines = [...introLines];
      let stepIndex = 0;
      let totalSteps = 5; // Will be correct since verdict is last
      let result: AgentTestResult | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const line = part.replace(/^data: /, "");
          if (line === "[DONE]") continue;
          try {
            const event = JSON.parse(line);
            if (event.type === "step") {
              const step = event.data as AgentStepResult;
              const isVerdict = step.step === "verdict";
              const newLines = stepToLines(step, stepIndex, totalSteps);
              currentLines = [...currentLines, ...newLines];
              if (!isVerdict) stepIndex++;

              // Animate the new lines
              for (let j = currentLines.length - newLines.length; j < currentLines.length; j++) {
                await new Promise<void>((resolve) => {
                  setTimeout(() => {
                    setLines(currentLines.slice(0, j + 1));
                    resolve();
                  }, newLines[j - (currentLines.length - newLines.length)]?.type === "blank" ? 40 : speed);
                });
              }
            } else if (event.type === "result") {
              result = event.data as AgentTestResult;
            }
          } catch {
            // skip malformed chunks
          }
        }
      }

      setAllTargetLines(currentLines);
      setIsDone(true);
      setIsRunning(false);
      onComplete?.(result);
    } catch (err) {
      const errorLine: TerminalLine = {
        text: `\u2717 Error: ${err instanceof Error ? err.message : "Connection failed"}`,
        type: "result",
        status: "fail",
      };
      setLines((prev) => [...prev, errorLine]);
      setIsRunning(false);
      setIsDone(true);
    }
  }, [url, task, speed, onComplete]);

  // Auto-start live mode
  useEffect(() => {
    if (url && autoStart && !precomputedSteps) {
      startLiveTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, autoStart]);

  const displayUrl = url || precomputedSteps?.[0]?.action?.match(/https?:\/\/[^\s)]+/)?.[0] || "";

  return (
    <div className="w-full rounded-xl overflow-hidden border border-zinc-800 bg-[#0d1117] shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-zinc-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 text-center text-xs font-mono text-zinc-500">
          CrawlReady Agent v1.0
          {displayUrl && (
            <span className="text-zinc-600 ml-2">— {displayUrl}</span>
          )}
        </div>
      </div>

      {/* Terminal content */}
      <div
        ref={scrollRef}
        className="p-4 font-mono text-sm leading-relaxed overflow-y-auto max-h-[500px] min-h-[200px]"
      >
        {lines.map((line, i) => (
          <div key={i} className={`${lineColor(line)} ${line.type === "blank" && !line.text ? "h-3" : ""}`}>
            {line.text}
          </div>
        ))}
        {/* Blinking cursor */}
        {isRunning && (
          <span className="inline-block w-2 h-4 bg-accent animate-blink-cursor ml-0.5" />
        )}
      </div>

      {/* Footer */}
      {isDone && (
        <div className="px-4 py-2 bg-[#161b22] border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-mono">
            Test completed
          </span>
          {!precomputedSteps && url && (
            <button
              onClick={startLiveTest}
              className="text-xs text-accent hover:text-accent-dim transition-colors font-mono"
            >
              Run again
            </button>
          )}
        </div>
      )}

      {/* Start button for non-autostart */}
      {!autoStart && !isRunning && !isDone && url && (
        <div className="px-4 py-4 flex justify-center">
          <button
            onClick={startLiveTest}
            className="px-6 py-2 bg-accent text-black font-semibold rounded-lg hover:bg-accent-dim transition-colors text-sm"
          >
            Run Agentic Test
          </button>
        </div>
      )}
    </div>
  );
}
