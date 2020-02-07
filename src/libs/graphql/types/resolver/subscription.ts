import { Args, Hook, Resolver, SubscriptionResolve } from './common';

export interface SubscriptionResolver<TArgs, TReturn> extends Resolver<TArgs> {
  resolve: SubscriptionResolve<TArgs, TReturn>;
}

export interface SubscriptionOptions<TArgs, TReturn> {
  parent: string;
  fieldName: string;
  returnType: string;
  args: Args<TArgs>;
  resolve: SubscriptionResolve<TArgs, TReturn>;

  beforeHook?: Hook<TArgs>;
  afterHook?: Hook<TArgs>;
}

export class Subscription<TArgs, TReturn> {
  parent: string;
  fieldName: string;
  returnType: string;
  args: Args<TArgs>;
  resolve: SubscriptionResolve<TArgs, TReturn>;

  beforeHook?: Hook<TArgs>;
  afterHook?: Hook<TArgs>;

  constructor({
    parent,
    fieldName,
    returnType,
    args,
    resolve,
    beforeHook,
    afterHook
  }: SubscriptionOptions<TArgs, TReturn>) {
    this.parent = parent;
    this.fieldName = fieldName;
    this.returnType = returnType;
    this.args = args;
    this.resolve = resolve;

    this.beforeHook = beforeHook;
    this.afterHook = afterHook;
  }

  public getResolver = (): SubscriptionResolver<TArgs, TReturn> => {
    try {
      return {
        parent: this.parent,
        fieldName: this.fieldName,
        returnType: this.returnType,
        args: this.args,
        resolve: this.resolve
      };
    } catch (error) {
      throw error;
    }
  };
}

export default Subscription;
