export type {
  Client,
  Project,
  MeetingRecord,
  ProjectMeetingContext,
  LinkMeetingInput,
} from "./types";
export {
  listProjects,
  listClients,
  createProject,
  linkMeetingToProject,
  getProjectMeetingContext,
} from "./server/context-store";
