import { Op } from 'sequelize';

const samples = {
  parent: 'Query',
  filedName: 'samples',
  returnType: '[Sample]',
  args: {
    where: 'SampleInput',
    order: '[[String]]', // [['title', 'DESC'], ['id', 'ASC']]
    limit: 'Int',
    offset: 'Int'
  },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    return await context.stores.endpoint1.elogDev.accessInfo.findAll(args);
  }
};

export default samples;
