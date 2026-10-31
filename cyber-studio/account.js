// Keep Cyber's public constructor and fixed data boundary while sharing sync logic.
import { Account as LearningAccount } from "../learning-studio/account.js?v=20261031-3";
import * as model from "./model.js?v=20261031-3";
export class Account extends LearningAccount {
  constructor(options) {
    super({ ...options, table: "cyber_progress", kind: "cyber-studio-progress", model });
  }
}
