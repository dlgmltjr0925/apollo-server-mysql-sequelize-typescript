import { pubsub } from '../../../libs/apollo';

const createSample = {
  parent: 'Mutation',
  filedName: 'createSample',
  returnType: 'Sample',
  args: {
    input: 'SampleInput!'
  },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    if (!context.stores.sample) context.stores.sample = [];
    context.stores.sample.push(args.input);

    pubsub.publish('SAMPLE', { subscribeSample: [args.input] });

    return args.input;
  }
};

export default createSample;
