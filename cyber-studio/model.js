// Preserve Cyber’s existing storage and backup contract through the shared model.
import { createModel } from "../learning-studio/model.js?v=20261031-4";
export const {
  PREFIX,
  PROFILES,
  DEFAULT_NAMES,
  REVIEW_DAYS,
  validateRecord,
  syncableText,
  syncableRecord,
  mergeRecords,
  sameRecord,
  sameLessons,
  workspaceStores,
  parseBackup,
  createStore,
  learningState,
} = createModel("cyber-studio");
