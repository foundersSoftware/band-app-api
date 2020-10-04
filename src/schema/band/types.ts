import { inputObjectType, objectType } from "@nexus/schema";

export const Band = objectType({
  name: "Band",
  definition(t) {
    t.string("name");
    t.string("uniqueName");
    t.string("location", { nullable: true });
    t.field("members", {
      type: "User",
      list: true,
    });
  },
});

export const BandCreateInput = inputObjectType({
  name: "BandCreateInput",
  definition(t) {
    t.string("name", { required: true });
    t.string("uniqueName", { required: true });
    t.string("location");
  },
});

export const BandAddMemberInput = inputObjectType({
  name: "BandAddMemberInput",
  definition(t) {
    t.string("bandUniqueName", { required: true });
    t.string("userEmail", { required: true });
  },
});

