export const sample = {
  parent: 'Query',
  filedName: 'sample',
  returnType: 'Sample',
  args: {
    where: 'SampleInput'
  },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    if (!context.stores.sample) context.stores.sample = [];
    try {
      return context.stores.sample.find((sample: any) => {
        return (
          Object.keys(args.where).findIndex(
            key => args.where[key] === sample[key]
          ) !== -1
        );
      });
    } catch (error) {
      return null;
    }
  }
};

export default sample;
