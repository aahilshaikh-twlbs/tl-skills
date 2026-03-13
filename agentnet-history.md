# AgentNet Architecture History

> Evolution of the TwelveLabs AgentNet project — Feb 18 to Mar 9, 2026

---

## Phase 1 — End-to-End Custom Infrastructure (Feb 18–22)

### Goal
Build a fully custom multi-agent infrastructure for a live demo to Jae, Brian, and Travis. Jae confirmed this was "the most important thing anybody's working on."

### Demo Requirements
- Three agents communicating bidirectionally in real time via Kafka/Redis
- Jae's agent broadcasts a directive; subordinate agents receive and incorporate it automatically
- Live data refresh from at least one source (Slack, Calendar, Linear, GitHub)
- Visible proof — terminal output or lightweight dashboard showing messages flowing live

### Architecture
```
JAE (Hive King)
   ↓
RALPH (orchestration loop — watch queue → trigger agent → check completion)
   ↓
QUEEN AGENT ↔ Claude API
   ↓
Redis Streams
   hive.directives  (queen → IC agents)
   hive.signals     (IC agents → queen)
   ↓
IC AGENT A / B ↔ Claude API
   ↓         ↓
 Turso    Slack API
   ↑
Render (cron + hosting)
```

### Stack
| Component | Technology |
|---|---|
| Message bus | Redis Streams (replaced Kafka for prototype) |
| Agent memory | Turso (mid-term: directives, signals, snapshots; long-term: profiles, org mappings) |
| Hosting + cron | Render |
| Orchestration | Ralph Orchestrator (Python, per-agent task-completion loop) |
| Reasoning | Claude API (Opus 4.6 for top agents, Sonnet/Haiku for routing) |

### Agent Hierarchy
```
Jae (CEO) — Hive King
   └── Yoon (CTO)
         └── Travis (Head of Product)
               └── Shannon (IC Engineer)
                     └── Paritosh / Esther / Meryl / Gray (Frontend chain)
```

### Key Decisions
- Each agent loaded `tlos.md` + its own skill file as system context
- Each agent output **two files** per directive: (1) directive output, (2) reasoning file (why/how/what/constraints/conflicts)
- Redis Streams chosen over Kafka for prototype simplicity (TL engineering was already migrating away from Kafka to Redis internally)
- Redis also used as the agent state DB (replacing Turso to reduce service count)

### POC Results
Working Redis stream test with mock agents — queen broadcasting directives down to IC agents, signals flowing back up:
```
[queen] sent directive: monitor slack for eng alerts
[ic-agent-a] received directive → sent signal
[ic-agent-b] received directive → sent signal
[queen] received 4 signals from IC agents
```

---

## Phase 2 — Pivot: Stop Building Custom Infrastructure (Feb 24)

### The Realization
Anthropic (at $380B valuation, with thousands of engineers) was already building everything in the custom Phase 1 stack — messaging buses, agent runtime, sub-agent coordination, Slack/Linear/Calendar connectors, skill file execution, plugin marketplace. The risk: ship a half-finished prototype the day Anthropic ships it natively.

Claude's analysis (shared by Rick, Feb 24):
> *"You are not going to out-build them on messaging buses, agent orchestration frameworks, or skill file management. If you try, you'll have a half-finished prototype the day they ship it natively. Race to be the best implementation, not the best infrastructure."*

### What Changed
**Dropped:** Building custom Redis/Kafka/Render/Ralph infrastructure from scratch.

**Kept and doubled down on:** The organizational intelligence layer — the thing Anthropic cannot replicate:
- `tlos.md` — TwelveLabs Operating System, constitutional constraint layer
- Skill files per real TL employee (agent-jae, agent-travis, agent-shannon, agent-paritosh, etc.)
- Org-chart-aware directive cascade logic
- Two-file output spec (directive output + reasoning file)
- The institutional knowledge of how a directive from Jae cascades differently than one from Shannon

### Role Shift
**Aahil's role** shifted from "guy building custom agent infra" → "integration engineer who wires the organizational intelligence layer into whatever platform ships first."

**Target:** Cowork plugins, MCP servers, Agent SDK configurations. When Anthropic ships new capabilities, TwelveLabs is first to adopt because the knowledge layer is already built.

### TwelveLabs Owns vs. Anthropic Owns
| TwelveLabs Owns | Anthropic Owns |
|---|---|
| `tlos.md` constitutional layer | Agent runtime |
| Skill files per employee | Messaging bus |
| Org-graph and hierarchy awareness | Sub-agent coordination |
| Directive cascade logic | Connectors (Slack, Linear, GDrive, Calendar) |
| Two-file output spec | Skill file execution engine |
| Scoring framework | Plugin marketplace + auth |

---

## Phase 3 — Dan's Call: Slack as the Agent Mesh (Mar 2)

### The Call
Rick met with Dan Kim (Lead ML Research Scientist). Key architectural inputs:

### Dan's Proposal
1. **Plain-text filesystem as the knowledge layer** — not Notion (which "rots"), not complex MCP. Portable, version-controllable markdown files. The "12 Labs OS" concept: `tlos.md`, `soul.md`, `security-framework.md` as a living filesystem that IS the agent's system prompt.

2. **Slack as the agent mesh frontend** — everyone already lives in Slack, ClearFeed is running there, Slack's event-driven model gives async activation with no polling loop and no always-on infrastructure cost. Agents wake on `@mention` or webhook trigger, do their work, go quiet.

3. **Encrypted A2A messaging layer** — public/private keys per group. Slack channels become the "rooms," the crypto layer handles trust. Agent-to-agent communication scoped and auditable without a custom message bus.

4. **Knowledge hierarchy**: Linear (structured, intentional) > Slack (real-time signal) > Notion (graveyard of good intentions). Obsidian + Google Drive as hierarchical markdown source of truth.

### Architectural Framing
> *"Build the primitives and let the platform come to you."*

The orchestration piece simplifies dramatically — instead of managing a full agent mesh, you write Slack workflows that read from a shared filesystem.

---

## Phase 4 — AgentNet Live Through Slack (Mar 3–9)

### What Actually Got Built
They did NOT go back to building custom Redis/Kafka/Render infrastructure. Instead, they built **on top of existing platforms**:

| Old Phase 1 Stack (dropped) | Current Stack |
|---|---|
| Custom Redis Streams as message bus | **Slack** as the message bus |
| Render for hosting + cron | **Google Vertex AI** as agent runtime |
| Custom Ralph orchestration loop | **Slack HITL** (Approve/Reject buttons) as orchestration |
| Hand-rolled Python agent scripts | **Claude Cowork + Agent SDK** for building agents |
| Kafka/Turso for state | **Firestore on GCP** for state |

The tl-agentnet repo came back to life — now as GCP/Vertex AI infrastructure, not custom Redis/Kafka code.

### Current Architecture
```
Human (Rick/Aahil)
   ↓  (Slack DM or ClearFeed ticket or Linear webhook)
AgentNet Bot (#tl-agentnet channel)
   ↓
agent-dispatch  (routes to correct agent based on label/content)
   ↓              ↓
agent-rick    agent-aahil
(IT/Security)  (Dev/Eng)
   ↓
HITL Approval (Approve/Reject in #tl-agentnet)
   ↓
Task Execution (Vertex AI runtime, Claude Haiku)
   ↓
Result posted back to Slack + Linear updated
```

### Agent Skill Files (Live)
| Agent | Skills |
|---|---|
| agent-rick | `it_ticket_triage`, `linear_task_management`, `security_triage` |
| agent-aahil | `slack_dm` |

### Integration Points
- **ClearFeed** → webhooks → agent-rick (IT ticket triage, auto-response)
- **Linear** → webhooks → agent-rick (issues labeled `agent-rick` or `agent-aahil` trigger A2A approval flow)
- **Slack DM** → agent-rick → agent-dispatch → delegates to agent-aahil if relevant
- **#alert-agentnet** → P2+ security/error alerts requiring human escalation
- **#tl-agentnet** → all A2A task approval requests with Approve/Reject buttons

### Agent Identity Layer (per agent)
Each agent built in Claude Cowork with:
- **Identity Layer** — role spec, tool stack, team map (reports to, direct reports), contact directory
- **Preferences Layer** — communication style, decision-making patterns, tool preferences
- **Knowledge Layer** — company context (`tlos.md`), domain expertise
- **Memory Layer** — persistent across sessions, running log of decisions and context

### Key Milestone (Mar 4)
Rick stopped responding to ClearFeed IT tickets manually. agent-rick handles triage and response autonomously, with HITL approval before action.

### Key Milestone (Mar 5)
Full A2A multi-agent flow live:
1. Rick DMs bot: "Ask Aahil to review server.py for security issues"
2. agent-rick detects "aahil," delegates to agent-aahil via agent-dispatch
3. agent-aahil receives task, executes, posts result

### Current Sprint (Mar 2–9) Deliverables
1. Published verified Org Skills in Claude (using Agent SDK)
2. Curated company-specific constitutional layers
3. Built agent-rick and agent-aahil on Vertex AI + Slack
4. Linear webhook integration (AgentNet Inbound project)
5. Skills marketplace (`tl-skills` repo) — package manager for skill files

---

## Core Principle (Unchanged Since Phase 2)

> **TwelveLabs owns the organizational intelligence layer. Anthropic/Google own the pipes.**

The moat is not Redis or Render or any custom infrastructure. It's:
- `tlos.md` — the org-aware constitutional layer
- Skill files that encode each employee's role, context, and decision logic
- The directive cascade pattern (org-chart-aware, not generic multi-agent)
- 6+ months of institutional knowledge that any other company would have to start from scratch

When Anthropic ships native org-wide agent orchestration, TwelveLabs plugs into it on Day 1 and is immediately 6 months ahead.
