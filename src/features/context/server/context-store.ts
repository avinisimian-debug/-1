import { randomUUID } from "crypto";
import {
  readContextJson,
  writeContextJson,
} from "@/lib/context-persistence";
import type {
  Client,
  LinkMeetingInput,
  MeetingRecord,
  Project,
  ProjectMeetingContext,
} from "../types";

type ContextDb = {
  clients: Client[];
  projects: Project[];
  meetings: MeetingRecord[];
};

async function readDb(): Promise<ContextDb> {
  return readContextJson<ContextDb>({ clients: [], projects: [], meetings: [] });
}

async function writeDb(db: ContextDb): Promise<void> {
  await writeContextJson(db);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function listProjects(ownerEmail: string): Promise<Project[]> {
  const db = await readDb();
  const email = normalizeEmail(ownerEmail);
  return db.projects.filter((p) => p.ownerEmail === email);
}

export async function listClients(ownerEmail: string): Promise<Client[]> {
  const db = await readDb();
  const email = normalizeEmail(ownerEmail);
  return db.clients.filter((c) => c.ownerEmail === email);
}

export async function createProject(
  ownerEmail: string,
  input: Pick<Project, "name" | "description" | "clientId">,
): Promise<Project> {
  const db = await readDb();
  const now = new Date().toISOString();
  const project: Project = {
    id: randomUUID(),
    ownerEmail: normalizeEmail(ownerEmail),
    name: input.name,
    description: input.description,
    clientId: input.clientId,
    createdAt: now,
    updatedAt: now,
  };
  db.projects.push(project);
  await writeDb(db);
  return project;
}

export async function linkMeetingToProject(
  input: LinkMeetingInput,
): Promise<MeetingRecord> {
  const db = await readDb();
  const email = normalizeEmail(input.ownerEmail);
  const project = db.projects.find(
    (p) => p.id === input.projectId && p.ownerEmail === email,
  );
  if (!project) {
    throw new Error("Project not found");
  }

  const { result } = input;
  const record: MeetingRecord = {
    id: randomUUID(),
    ownerEmail: email,
    projectId: project.id,
    clientId: project.clientId,
    historyEntryId: input.historyEntryId,
    fileName: result.fileName,
    duration: result.duration,
    processedAt: result.processedAt,
    headline: result.headline,
    summaryOverview: result.summary.overview,
    executiveSummary: result.summary.executive,
    topics: result.topics,
    decisions: result.decisions,
    actionItemCount: result.actionItems.length,
    createdAt: new Date().toISOString(),
  };

  db.meetings.push(record);
  project.updatedAt = record.createdAt;
  await writeDb(db);
  return record;
}

/** Aggregates meeting summaries for cross-meeting AI context. */
export async function getProjectMeetingContext(
  ownerEmail: string,
  projectId: string,
): Promise<ProjectMeetingContext | null> {
  const db = await readDb();
  const email = normalizeEmail(ownerEmail);
  const project = db.projects.find(
    (p) => p.id === projectId && p.ownerEmail === email,
  );
  if (!project) return null;

  const client = project.clientId
    ? db.clients.find((c) => c.id === project.clientId)
    : undefined;

  const meetings = db.meetings
    .filter((m) => m.projectId === projectId && m.ownerEmail === email)
    .sort(
      (a, b) =>
        new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime(),
    );

  const combinedTopics = [
    ...new Set(meetings.flatMap((m) => m.topics ?? [])),
  ];
  const combinedDecisions = [
    ...new Set(meetings.flatMap((m) => m.decisions ?? [])),
  ];

  return { project, client, meetings, combinedTopics, combinedDecisions };
}
