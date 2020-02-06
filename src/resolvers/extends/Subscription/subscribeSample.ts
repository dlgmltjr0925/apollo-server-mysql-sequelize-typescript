import { pubsub } from '../../../libs/apollo';

const subscribeSample = {
  parent: 'Subscription',
  fieldName: 'subscribeSample',
  returnType: '[Sample]',
  args: {
    key: 'String!'
  },
  resolve: {
    subscribe: (parent: any, args: any, context: any, info: any) =>
      pubsub.asyncIterator([args.key])
  }
};

export default subscribeSample;
