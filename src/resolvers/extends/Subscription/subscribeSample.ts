import { pubsub } from '../../../libs/apollo';

const subscribeSample = {
  parent: 'Subscription',
  filedName: 'subscribeSample',
  returnType: '[Sample]',
  args: {},
  resolve: {
    subscribe: () => pubsub.asyncIterator(['SAMPLE'])
  }
};

export default subscribeSample;
