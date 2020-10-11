import dynamoose from "dynamoose";
import { BaseSchema, BaseDocument } from "./BaseSchema";

const BandSchema = new dynamoose.Schema(
  {
    ...BaseSchema,
    name: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export interface BandDocument extends BaseDocument {
  name: string;
  location: string;
}

export const BandModel = dynamoose.model<BandDocument>("BandApp", BandSchema, {
  create: process.env.NODE_ENV === "development",
  waitForActive: {
    enabled: process.env.NODE_ENV === "development",
    check: {
      // defaults (only valid in development)
      timeout: 180000,
      frequency: 1000,
    },
  },
});
