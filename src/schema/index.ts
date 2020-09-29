import path from "path";

import { config } from "dotenv";
import { makeSchema } from "@nexus/schema";

import * as userSchema from "./user";

config({
  path: "/home/cory/projects/node/portfolio-backend/.env/.env.development",
});

export default makeSchema({
  types: [userSchema],
  outputs: {
    schema: path.join(__dirname, "./../../schema.graphql"),
    typegen: path.join(__dirname, "./../generated/nexus.ts"),
  },
  typegenAutoConfig: {
    contextType: "ctx.Context",
    sources: [
      {
        alias: "ctx",
        source: path.join(__dirname, "./context.d.ts"),
      },
      {
        alias: "dynamoose",
        source: path.join(__dirname, "./user/backingType.d.ts"),
      },
    ],
  },
});
