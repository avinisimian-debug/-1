import type { TranscriptionResult } from "./types";

export function generateMockResult(fileName: string): TranscriptionResult {
  const baseName = fileName.replace(/\.[^/.]+$/, "");

  return {
    fileName,
    duration: "42:18",
    processedAt: new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    summary: {
      overview:
        `This session covered strategic priorities for ${baseName}, with leadership aligning on product direction, technical feasibility, and go-to-market timing. The discussion balanced ambitious AI capabilities with pragmatic delivery constraints.\n\nKey decisions centered on scaling the transcription pipeline, launching a freemium model, and reallocating budget toward product-led growth. The team demonstrated strong consensus on quality targets and customer validation findings.\n\nOverall, the meeting established clear ownership, concrete deadlines, and a shared commitment to the June 30 public beta milestone.`,
      executive: [
        `The team reviewed Q2 product roadmap priorities for ${baseName}, focusing on AI-powered features and enterprise readiness.`,
        "Engineering confirmed the transcription pipeline can scale to 10x current volume with minor infrastructure upgrades.",
        "Marketing proposed a phased launch starting with a free tier, targeting indie teams and consultants.",
        "Finance approved a revised budget allocation, shifting 15% from paid ads to product-led growth experiments.",
        "Leadership aligned on a June 30 deadline for the public beta, with weekly syncs every Monday at 10 AM.",
      ],
      keyTakeaways: [
        "Transcription accuracy target raised to 95% for English meetings with 3+ speakers.",
        "New sidebar navigation and dark-mode UI received positive feedback from internal dogfooding.",
        "Action items must include owners and deadlines — no unassigned tasks going forward.",
        "Customer interviews (n=12) validated strong demand for automated action-item extraction.",
        "Competitive analysis shows a gap in real-time collaboration during live meetings.",
      ],
    },
    actionItems: [
      {
        id: "1",
        task: "Finalize API integration spec for Whisper + GPT pipeline",
        owner: "Sarah Chen",
        deadline: "Jun 20, 2026",
        completed: false,
      },
      {
        id: "2",
        task: "Design onboarding flow wireframes for first-time upload",
        owner: "Marcus Webb",
        deadline: "Jun 18, 2026",
        completed: false,
      },
      {
        id: "3",
        task: "Set up staging environment with mock transcription endpoints",
        owner: "Alex Rivera",
        deadline: "Jun 17, 2026",
        completed: true,
      },
      {
        id: "4",
        task: "Draft pricing page copy for Starter and Pro tiers",
        owner: "Jordan Lee",
        deadline: "Jun 22, 2026",
        completed: false,
      },
      {
        id: "5",
        task: "Schedule 5 customer discovery calls for beta feedback",
        owner: "Priya Patel",
        deadline: "Jun 25, 2026",
        completed: false,
      },
    ],
    transcript: [
      {
        timestamp: "00:00",
        speaker: "Sarah Chen",
        text: "Good morning everyone. Thanks for joining. Today we're going to walk through the product roadmap and align on our beta launch timeline.",
      },
      {
        timestamp: "00:42",
        speaker: "Marcus Webb",
        text: "I've shared the updated Figma files in Slack. The new dashboard layout includes the drag-and-drop upload zone we discussed last week.",
      },
      {
        timestamp: "01:15",
        speaker: "Alex Rivera",
        text: "On the engineering side, we've got the mock pipeline working end-to-end. Upload, transcribe, summarize — all mocked for now, but the state machine is solid.",
      },
      {
        timestamp: "02:03",
        speaker: "Jordan Lee",
        text: "From a go-to-market perspective, I think we should lead with the action-items feature. That's what resonated most in our customer interviews.",
      },
      {
        timestamp: "02:48",
        speaker: "Priya Patel",
        text: "Agreed. Twelve out of twelve interviewees said extracting tasks automatically would save them at least an hour per week.",
      },
      {
        timestamp: "03:22",
        speaker: "Sarah Chen",
        text: "Let's set June 30th as our public beta date. Alex, can you confirm the infrastructure can handle our projected load?",
      },
      {
        timestamp: "03:55",
        speaker: "Alex Rivera",
        text: "With the planned upgrades, yes. We're looking at roughly 10x headroom. I'll have the staging environment ready by next Tuesday.",
      },
      {
        timestamp: "04:30",
        speaker: "Marcus Webb",
        text: "I'll have onboarding wireframes done by Wednesday. We need to make the first upload experience as frictionless as possible.",
      },
      {
        timestamp: "05:10",
        speaker: "Jordan Lee",
        text: "I'll draft pricing copy this week. Thinking two tiers — Starter at nineteen dollars and Pro at forty-nine.",
      },
      {
        timestamp: "05:45",
        speaker: "Sarah Chen",
        text: "Great. Let's reconvene Monday at 10 AM. I'll send out the action items after this call. Thanks everyone.",
      },
    ],
  };
}
