import log from '../../../utils/log';

export const sample = {
  parent: 'Query',
  filedName: 'sample',
  returnType: 'Sample',
  args: {
    where: 'SampleInput'
  },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    log.i('sample', args);
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
