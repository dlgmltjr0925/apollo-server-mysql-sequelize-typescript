import log from '../../../utils/log';
import { pubsub } from '../../../libs/apollo';

const createSample = {
  parent: 'Mutation',
  fieldName: 'createSample',
  returnType: 'Sample',
  args: {
    input: 'SampleInput'
  },
  resolve: async (parent: any, args: any, context: any, info: any) => {
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
  }
};

export default createSample;
