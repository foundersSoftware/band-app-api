import { Document } from "dynamoose/dist/Document";

interface BaseDocument extends Document {
  pk: string;
  sk: string;
}

export default BaseDocument;
