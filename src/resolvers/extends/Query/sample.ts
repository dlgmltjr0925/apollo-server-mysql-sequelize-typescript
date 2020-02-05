import log from '../../../utils/log';

export const sample = {
  parent: 'Query',
  filedName: 'sample',
  returnType: 'Sample',
  args: {
    where: 'SampleInput'
  },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    log.i('[sample]', args.where);
    if (!context.stores.sample)
      context.stores.sample = { nextKey: 1, datas: [] };
    const where = { ...args.where };
    if (!where || Object.keys(where).length === 0) {
      return context.stores.sample.datas[0];
    }
    try {
      return context.stores.sample.datas.find((sample: any) => {
        log.d(Object.keys(where));
        return (
          Object.keys(where).findIndex(key => where[key] === sample[key]) !== -1
        );
      });
    } catch (error) {
      return null;
    }
  }
};

export default sample;
