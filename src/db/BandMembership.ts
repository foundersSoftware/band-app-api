import dynamoose from "dynamoose";
import { BaseSchema, BaseDocument } from "./BaseSchema";

const BandMembershipSchema = new dynamoose.Schema(
  {
    ...BaseSchema,
    role: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export interface BandMembershipDocument extends BaseDocument {
  role: string;
}

export const BandMembershipModel = dynamoose.model<BandMembershipDocument>(
  "BandApp",
  BandMembershipSchema,
  {
    create: process.env.NODE_ENV === "development",
    waitForActive: {
      enabled: process.env.NODE_ENV === "development",
      check: {
        // defaults (only valid in development)
        timeout: 180000,
        frequency: 1000,
      },
    },
  },
);
