import React, { useState, useEffect } from "react";
import { Sparkles, Cpu, Layers, Activity, ChevronRight, X } from "lucide-react";
import useTilt from "../hooks/useTilt";
import useSound from "../hooks/useSound";

/* ── Node definitions with rich metadata for inspect mode ── */
const NODES = [
  {
    id: "intake",
    cx: 90,
    cy: 200,
    r: 24,
    label: "intake",
    stage: 0,
    type: "main",
    role: "Gateway & Normalizer",
    desc: "Ingests raw user input, parses uploaded resumes (PDF, DOCX), extracts metadata and generates clean embeddings.",
    engine: "FastAPI + Unstructured",
    latency: "<45ms",
  },
  {
    id: "router",
    cx: 270,
    cy: 200,
    r: 24,
    label: "intent router",
    stage: 1,
    type: "main",
    role: "Semantic Dispatcher",
    desc: "Classifies user intent (ATS analysis, job discovery, mock interview, cover letter) and plans routing topology.",
    engine: "Claude 3.5 Sonnet / Routing DAG",
    latency: "<110ms",
  },
  {
    id: "planner",
    cx: 450,
    cy: 200,
    r: 24,
    label: "planner",
    stage: 2,
    type: "main",
    role: "Execution Orchestrator",
    desc: "Compiles prompt templates, manages dependency graphs, allocates context windows, and spins up specialist sub-agents.",
    engine: "LangGraph Dynamic State",
    latency: "<80ms",
  },
  {
    id: "resume",
    cx: 640,
    cy: 80,
    r: 20,
    label: "resume",
    stage: 3,
    type: "agent",
    role: "Multi-Engine ATS Scorer",
    desc: "Audits resumes against 5 enterprise ATS algorithms (Greenhouse, Lever, Ashby, Workday, Naukri) and flags keyword gaps.",
    engine: "Custom ATS Heuristics + LLM Evaluator",
    latency: "<190ms",
  },
  {
    id: "jobs",
    cx: 640,
    cy: 200,
    r: 20,
    label: "jobs",
    stage: 3,
    type: "agent",
    role: "Vector Retrieval & Matcher",
    desc: "Runs dense + sparse hybrid vector search across Qdrant indexes to match candidate profiles to active hiring requisitions.",
    engine: "Qdrant Vector DB + Hybrid Ranker",
    latency: "<95ms",
  },
  {
    id: "interview",
    cx: 640,
    cy: 320,
    r: 20,
    label: "interview",
    stage: 3,
    type: "agent",
    role: "Interview Simulator",
    desc: "Simulates technical & behavioral interviews based on the targeted job description with real-time feedback scoring.",
    engine: "Agentic Multi-turn Evaluator",
    latency: "<150ms",
  },
  {
    id: "synth",
    cx: 830,
    cy: 200,
    r: 24,
    label: "synthesis",
    stage: 4,
    type: "main",
    role: "Output Aggregator",
    desc: "Synthesizes multi-agent findings, resolves contradictions, formats actionable recommendations, and tailors output tone.",
    engine: "Context Merging Engine",
    latency: "<120ms",
  },
  {
    id: "memory",
    cx: 980,
    cy: 200,
    r: 20,
    label: "memory",
    stage: 5,
    type: "agent",
    role: "Long-term Vector Memory",
    desc: "Persists candidate progress, skill gains, interview scores, and conversation state in semantic episodic storage.",
    engine: "Supabase + Semantic Caching",
    latency: "<60ms",
  },
  {
    id: "final",
    cx: 1110,
    cy: 200,
    r: 24,
    label: "output",
    stage: 6,
    type: "main",
    role: "Stream & Delivery",
    desc: "Streams formatted Markdown, interactive UI widgets, and download-ready PDF reports with sub-second time-to-first-token.",
    engine: "SSE Streamer + React Client",
    latency: "<20ms",
  },
];

/* ── Edge definitions ── */
const EDGES = [
  { id: "e1",  from: "intake",    to: "router",    d: "M90,200 L270,200",                  dur: 2.2, delay: 0.0 },
  { id: "e2",  from: "router",    to: "planner",   d: "M270,200 L450,200",                 dur: 2.0, delay: 0.3 },
  { id: "e3",  from: "planner",   to: "resume",    d: "M450,200 C540,200 560,80 640,80",   dur: 2.4, delay: 0.6 },
  { id: "e4",  from: "planner",   to: "jobs",      d: "M450,200 L640,200",                 dur: 2.1, delay: 0.8 },
  { id: "e5",  from: "planner",   to: "interview", d: "M450,200 C540,200 560,320 640,320", dur: 2.4, delay: 0.6 },
  { id: "e6",  from: "resume",    to: "synth",     d: "M640,80 C720,80 740,200 830,200",   dur: 2.3, delay: 1.2 },
  { id: "e7",  from: "jobs",      to: "synth",     d: "M640,200 L830,200",                 dur: 2.0, delay: 1.4 },
  { id: "e8",  from: "interview", to: "synth",     d: "M640,320 C720,320 740,200 830,200", dur: 2.3, delay: 1.2 },
  { id: "e9",  from: "synth",     to: "memory",    d: "M830,200 L980,200",                 dur: 1.9, delay: 1.8 },
  { id: "e10", from: "memory",    to: "final",     d: "M980,200 L1110,200",                dur: 1.8, delay: 2.1 },
];

const DOTS_PER_EDGE = 2;

export default function Graph() {
  const [stage, setStage] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const { playHover, playNodeSelect, playClick } = useSound();

  const [reducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  const { ref: tiltRef, handlers } = useTilt({ max: 5, scale: 1.01, glare: false });

  useEffect(() => {
    if (reducedMotion || selectedNode) return;
    const t = setInterval(() => setStage((s) => (s + 1) % 7), 800);
    return () => clearInterval(t);
  }, [reducedMotion, selectedNode]);

  const activeNode = selectedNode || NODES.find((n) => n.stage === stage) || NODES[0];

  const handleNodeClick = (node) => {
    playNodeSelect(node.type === "agent" ? 640 : 520);
    if (selectedNode?.id === node.id) {
      setSelectedNode(null);
    } else {
      setSelectedNode(node);
      setStage(node.stage);
    }
  };

  const handleNodeHover = (node) => {
    setHoveredNode(node);
    playHover();
  };

  const isOn = (n) => {
    if (selectedNode) return selectedNode.id === n.id;
    return reducedMotion ? !n.agent || n.id === "jobs" : n.stage === stage;
  };

  const nodeColor = (n) => {
    if (!isOn(n) && hoveredNode?.id !== n.id) return null;
    return n.type === "agent" ? "violet" : "mint";
  };

  return (
    <div
      className="graph-panel reveal graph-3d"
      ref={tiltRef}
      {...handlers}
      style={{ cursor: "default", transformStyle: "preserve-3d", padding: "26px 26px 20px" }}
    >
      {/* Glare overlay */}
      <div
        className="tilt-glare"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "18px",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.3s",
          zIndex: 2,
        }}
      />

      {/* Header with interact hint */}
      <div className="graph-head" style={{ position: "relative", zIndex: 1, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="tag mono">svai.engine · orchestration</span>
          <span className="graph-hint-pill">
            <Sparkles size={12} /> Click any node to inspect
          </span>
        </div>
        <span className="live">
          <span className="pip" />
          {selectedNode ? `pinned: ${selectedNode.label}` : "live orchestration"}
        </span>
      </div>

      <svg
        className="graph-svg"
        viewBox="0 0 1200 400"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="AI agent orchestration pipeline"
        style={{ position: "relative", zIndex: 1, overflow: "visible" }}
      >
        <defs>
          <filter id="glow-mint-lg" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="2" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-violet-lg" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="blur1" />
            <feGaussianBlur stdDeviation="3" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-dot" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="dot-mint">
            <stop offset="0%" stopColor="#a8ffe8" stopOpacity="1" />
            <stop offset="60%" stopColor="#5FE6C6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#5FE6C6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Base edge lines ── */}
        <g>
          {EDGES.map((e) => {
            const isConnected =
              selectedNode && (e.from === selectedNode.id || e.to === selectedNode.id);
            return (
              <path
                key={"base-" + e.id}
                d={e.d}
                stroke={isConnected ? "var(--mint)" : "#1C2142"}
                strokeWidth={isConnected ? "2.5" : "2"}
                opacity={isConnected ? 0.9 : 1}
                fill="none"
                strokeLinecap="round"
                style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
              />
            );
          })}
        </g>

        {/* ── Animated dashed overlay ── */}
        <g>
          {EDGES.map((e) => (
            <path
              key={"dash-" + e.id}
              d={e.d}
              stroke="#8B7BFF"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="6 14"
              opacity="0.28"
              style={{ animation: reducedMotion ? "none" : `dash ${e.dur + 1}s linear infinite` }}
            />
          ))}
        </g>

        {/* ── Moving glowing dots ── */}
        {!reducedMotion &&
          EDGES.map((e) =>
            Array.from({ length: DOTS_PER_EDGE }, (_, dotIdx) => {
              const totalDur = e.dur;
              const begin = -(totalDur / DOTS_PER_EDGE) * dotIdx + e.delay;
              return (
                <circle
                  key={`dot-${e.id}-${dotIdx}`}
                  r="5"
                  fill="url(#dot-mint)"
                  filter="url(#glow-dot)"
                >
                  <animateMotion
                    dur={`${totalDur}s`}
                    begin={`${begin}s`}
                    repeatCount="indefinite"
                    calcMode="linear"
                  >
                    <mpath href={`#path-${e.id}`} />
                  </animateMotion>
                </circle>
              );
            })
          )}

        {/* Hidden paths for animateMotion */}
        <defs>
          {EDGES.map((e) => (
            <path key={"mpath-" + e.id} id={`path-${e.id}`} d={e.d} />
          ))}
        </defs>

        {/* ── Nodes ── */}
        {NODES.map((n) => {
          const on = isOn(n);
          const isHovered = hoveredNode?.id === n.id;
          const isSelected = selectedNode?.id === n.id;
          const color = nodeColor(n);
          const activeColor = color === "violet" ? "#8B7BFF" : "#5FE6C6";
          const glowId = color === "violet" ? "url(#glow-violet-lg)" : "url(#glow-mint-lg)";

          return (
            <g
              key={n.id}
              filter={on || isHovered ? glowId : undefined}
              onClick={() => handleNodeClick(n)}
              onMouseEnter={() => handleNodeHover(n)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
            >
              {/* Outer pulse ring */}
              {on && !reducedMotion && (
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r={n.r + 14}
                  fill="none"
                  stroke={activeColor}
                  strokeWidth={isSelected ? "1.8" : "1"}
                  opacity="0"
                >
                  <animate
                    attributeName="r"
                    values={`${n.r + 8};${n.r + 22};${n.r + 8}`}
                    dur="2.2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.7;0;0.7"
                    dur="2.2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Middle ring */}
              <circle
                cx={n.cx}
                cy={n.cy}
                r={n.r + (isHovered ? 10 : 8)}
                fill="none"
                stroke={on || isHovered ? activeColor : "#1C2142"}
                strokeWidth={on ? 1.4 : 1}
                opacity={on || isHovered ? 0.6 : 0.35}
                style={{ transition: "r 0.2s, stroke 0.2s" }}
              />

              {/* Main node circle */}
              <circle
                cx={n.cx}
                cy={n.cy}
                r={n.r + (isHovered ? 2 : 0)}
                fill={
                  on
                    ? color === "violet"
                      ? "rgba(139,123,255,0.22)"
                      : "rgba(95,230,198,0.18)"
                    : isHovered
                    ? "rgba(95,230,198,0.1)"
                    : "#11152C"
                }
                stroke={on || isHovered ? activeColor : "#262C52"}
                strokeWidth={on || isHovered ? 2.2 : 1.6}
                style={{ transition: "fill 0.25s, stroke 0.25s" }}
              />

              {/* Inner core dot */}
              <circle
                cx={n.cx}
                cy={n.cy}
                r={n.type === "agent" ? 4.5 : 5.5}
                fill={on || isHovered ? activeColor : "#6A7099"}
              />

              {/* Label */}
              <text
                x={n.cx}
                y={n.cy + (n.cy < 130 ? -n.r - 16 : n.r + 22)}
                textAnchor="middle"
                fontSize={isSelected ? "12.5" : "11.5"}
                fontWeight={isSelected ? "700" : "500"}
                fontFamily="'JetBrains Mono', monospace"
                fill={on || isHovered ? "#ECEEF8" : "#6A7099"}
                letterSpacing="0.04em"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* ── Interactive Node Inspector Card ── */}
      {activeNode && (
        <div className="node-inspector reveal">
          <div className="inspector-head">
            <div className="inspector-title-wrap">
              <span className={"inspector-badge " + activeNode.type}>
                {activeNode.type === "agent" ? <Cpu size={12} /> : <Layers size={12} />}
                Stage {activeNode.stage + 1}: {activeNode.type === "agent" ? "Agent Node" : "Pipeline Node"}
              </span>
              <h4 className="inspector-title">{activeNode.label}</h4>
              <span className="inspector-role">· {activeNode.role}</span>
            </div>

            {selectedNode && (
              <button
                className="inspector-close"
                onClick={() => {
                  playClick();
                  setSelectedNode(null);
                }}
                aria-label="Resume auto cycle"
                title="Resume auto cycle"
              >
                <X size={14} /> Close
              </button>
            )}
          </div>

          <p className="inspector-desc">{activeNode.desc}</p>

          <div className="inspector-meta">
            <div className="inspector-stat">
              <span className="stat-label">Architecture</span>
              <span className="stat-value mono">{activeNode.engine}</span>
            </div>
            <div className="inspector-stat">
              <span className="stat-label">Avg. Latency</span>
              <span className="stat-value mono accent-mint">
                <Activity size={12} style={{ display: "inline", marginRight: 4 }} />
                {activeNode.latency}
              </span>
            </div>
            <div className="inspector-stat">
              <span className="stat-label">State</span>
              <span className="stat-value mono" style={{ color: "var(--mint)" }}>
                ● Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stage indicator dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          marginTop: 14,
          position: "relative",
          zIndex: 1,
        }}
      >
        {Array.from({ length: 7 }, (_, i) => (
          <button
            key={i}
            onClick={() => {
              playClick();
              setStage(i);
              const nodeAtStage = NODES.find((n) => n.stage === i);
              if (nodeAtStage) setSelectedNode(nodeAtStage);
            }}
            style={{
              width: i === stage ? 22 : 7,
              height: 7,
              borderRadius: 999,
              background: i === stage ? "var(--mint)" : "var(--line)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.3s",
              boxShadow: i === stage ? "0 0 10px var(--mint)" : "none",
            }}
            aria-label={`Go to stage ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
