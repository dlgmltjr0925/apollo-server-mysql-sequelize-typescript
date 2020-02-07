import { Subscription, SubscriptionOptions } from '../../../libs/graphql/types';

import { pubsub } from '../../../libs/apollo/pubsub';

interface Sample {
  id: number;
  name: string;
  sampleEnum: 'A' | 'B' | 'C';
}

interface Args {
  key: string;
}

const subscribeSample: SubscriptionOptions<Args, Sample[]> = {
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
