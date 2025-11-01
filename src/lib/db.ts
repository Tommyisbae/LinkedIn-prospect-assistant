import Dexie, { type Table } from "dexie";

// Represents a prospect captured from a search page (temporary)
export interface Prospect {
  id?: number;
  name: string;
  headline: string;
  profileUrl: string;
  createdAt: Date;
  connectionDegree?: string;
}

// Represents a fully analyzed and scored prospect (permanent)
export interface Report {
  id?: number;
  name: string;
  headline: string;
  profileUrl: string;
  score: number;
  grade: string;
  justification: string;
  connectionMessage: string;
  analyzedAt: Date;
}

export class ProspectDatabase extends Dexie {
  prospects!: Table<Prospect>;
  reports!: Table<Report>; // The new table for permanent reports

  constructor() {
    super("LinkedInProspectDB");
    // We increment the version number because we are changing the schema
    this.version(2).stores({
      prospects: "++id, createdAt", // Keeps the original captured list
      reports: "++id, analyzedAt", // The new store for analysis results
    });
  }
}

export const db = new ProspectDatabase();
