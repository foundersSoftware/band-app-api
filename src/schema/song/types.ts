import { inputObjectType, objectType } from "@nexus/schema";
// import { fetchUsersByBand } from "../../models/bandMembership";

export const Song = objectType({
  name: "Song",
  definition(t) {
    // t.string("id");
    t.string("title");
    // t.string("location");

    // t.field("members", {
    // type: "User",
    // list: true,
    // resolve: async (parent) => {
    // if (!parent.members) {
    // return fetchUsersByBand(parent);
    // }
    // return parent.members;
    // },
    // });
  },
});

export const SongCreateInput = inputObjectType({
  name: "SongCreateInput",
  definition(t) {
    t.string("title", { required: true });
    t.string("bandId", { required: true });
  },
});

// export const BandAddMemberInput = inputObjectType({
// name: "BandAddMemberInput",
// definition(t) {
// t.string("bandId", { required: true });
// t.string("userId", { required: true });
// t.string("bandMemberRole", { required: true });
// },
// });
