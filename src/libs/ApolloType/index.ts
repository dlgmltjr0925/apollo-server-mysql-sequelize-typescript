import mutation from './Resolver/Mutation';
import query from './Resolver/Query';
import subscription from './Resolver/Subscription';

export const Mutation = mutation;
export const Query = query;
export const Subscription = subscription;

export default {
  Mutation,
  Query,
  Subscription
};
