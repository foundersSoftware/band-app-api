const BaseSchema = {
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

export default BaseSchema;
