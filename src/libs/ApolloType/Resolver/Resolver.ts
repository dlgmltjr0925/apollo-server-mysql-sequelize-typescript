export type Parent = any;

export interface Context extends Record<string, any> {
  stores: any;
  [key: string]: any;
}

export type Info = any;

export type Resolve<TArgs, TReturn> = (
  parent: Parent,
  args: TArgs,
  context: Context,
  info: Info
) => Promise<TReturn | null>;

export interface SubscriptionResolve<TArgs, TReturn> {
  subscribe: (
    parent: Parent,
    args: TArgs,
    context: Context,
    info: Info
  ) => AsyncIterator<TReturn>;
}

export type Hook<TArgs> = (
  parent: Parent,
  args: TArgs,
  context: Context,
  info: Info
) => Promise<void>;

export interface Resolver<TArgs = Record<string, any>, TReturn = any> {
  parent: string;
  fieldName: string;
  returnType: string;
  args: TArgs;
}
