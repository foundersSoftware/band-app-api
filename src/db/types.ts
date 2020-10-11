import { Document } from "dynamoose/dist/Document";

export interface Key {
  pk: any;
  sk: any;
}

export interface BaseDocument extends Document {
  pk: string;
  sk: string;
}
