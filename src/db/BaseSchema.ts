import { Document } from "dynamoose/dist/Document";

export const BaseSchema = {
  pk: {
    type: String,
    hashKey: true,
  },
  sk: {
    type: String,
    rangeKey: true,
    index: {
      global: true,
      rangeKey: "pk",
    },
  },
};

export interface BaseDocument extends Document {
  pk: string;
  sk: string;
}

