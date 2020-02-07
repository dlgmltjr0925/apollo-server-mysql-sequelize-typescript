import DataLoader from 'dataloader';
import { QueryOptions } from '../../../libs/graphql/types';
import log from '../../../utils/log';

interface Sample {
  id: number;
  name: string;
  sampleEnum: 'A' | 'B' | 'C';
}

interface Args {
  where: Sample;
}

export const sample: QueryOptions<Args, Sample> = {
  parent: 'Query',
  fieldName: 'sample',
  returnType: 'Sample',
  args: {
    where: 'SampleInput'
  },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    log.i('[sample][args]', args);

    if (!context.stores.sample)
      context.stores.sample = { nextKey: 1, datas: [] };
    const where = { ...args.where };

    context.sameNameLoader = new DataLoader(async (names: any) => {
      const samples = context.stores.sample.datas.filter((data: any) => {
        return data.name === names[0];
      });
      return await names.map((name: string) =>
        samples.filter((sample: any) => sample.name === name)
      );
    });

    if (!where || Object.keys(where).length === 0) {
      return context.stores.sample.datas[0];
    }
    try {
      return context.stores.sample.datas.find((sample: any) => {
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
