import { MutationOptions } from '../../../libs/graphql/types';
import log from '../../../utils/log';
import { pubsub } from '../../../libs/apollo/pubsub';

interface Sample {
  id: number;
  name: string;
  sampleEnum: 'A' | 'B' | 'C';
}

interface Args {
  input: Sample;
}

const createSample: MutationOptions<Args, Sample> = {
  parent: 'Mutation',
  fieldName: 'createSample',
  returnType: 'Sample',
  args: {
    input: 'SampleInput'
  },
  resolve: async (parent, args, context, info) => {
    if (!context.stores.sample)
      context.stores.sample = {
        nextKey: 1,
        datas: []
      };
    context.stores.sample.datas.push({
      ...args.input,
      id: context.stores.sample.nextKey
    });
    context.stores.sample.nextKey += 1;

    log.d(context.stores.sample.datas.slice(-1)[0]);

    pubsub.publish('SAMPLE', {
      subscribeSample: [context.stores.sample.datas.slice(-1)[0]]
    });

    return context.stores.sample.datas.slice(-1)[0];
  },
  beforeHook: async (parent, args, context, info) => {
    log.d('[beforeCreateSample]');
  },
  afterHook: async (parent, args, context, info) => {
    log.d('[afterCreateSample]');
  }
};

export default createSample;
