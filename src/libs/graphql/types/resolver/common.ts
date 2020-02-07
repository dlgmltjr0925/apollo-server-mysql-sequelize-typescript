import { GraphQLResolveInfo } from 'graphql';

export type Parent = any;

export type Args<T> = { [P in keyof Required<T>]: string };

export interface Context extends Record<string, any> {
  stores: any;
  [key: string]: any;
}

export type Resolve<TArgs, TReturn> = (
  parent: Parent,
  args: TArgs,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<TReturn | null>;

export interface SubscriptionResolve<TArgs, TReturn> {
  subscribe: (
    parent: Parent,
    args: TArgs,
    context: Context,
    info: GraphQLResolveInfo
  ) => AsyncIterator<TReturn>;
}

export type Hook<TArgs> = (
  parent: Parent,
  args: TArgs,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<void>;

export interface Resolver<TArgs = Record<string, any>> {
  parent: string;
  fieldName: string;
  returnType: string;
  args: Args<TArgs>;
}
