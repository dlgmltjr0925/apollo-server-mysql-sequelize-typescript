import { Hook, Resolve, Resolver } from './Resolver';

interface QueryResolver<TArgs, TReturn> extends Resolver<TArgs, TReturn> {
  resolve: Resolve<TArgs, TReturn>;
}

export interface QueryOptions<TArgs, TReturn> {
  parent: string;
  fieldName: string;
  returnType: string;
  args: TArgs;
  resolve: Resolve<TArgs, TReturn>;

  beforeHook?: Hook<TArgs>;
  afterHook?: Hook<TArgs>;
}

export default class Query<TArgs, TReturn> {
  parent: string;
  fieldName: string;
  returnType: string;
  args: TArgs;
  resolve: Resolve<TArgs, TReturn>;

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
  }: QueryOptions<TArgs, TReturn>) {
    this.parent = parent;
    this.fieldName = fieldName;
    this.returnType = returnType;
    this.args = args;
    this.resolve = resolve;

    this.beforeHook = beforeHook;
    this.afterHook = afterHook;
  }

  private getResolve = (): Resolve<TArgs, TReturn> => {
    return async (parent, args, context, info) => {
      let result = null;
      if (this.beforeHook) await this.beforeHook(parent, args, context, info);

      if (this.resolve)
        result = await this.resolve(parent, args, context, info);

      if (this.afterHook) this.afterHook(parent, args, context, info);
      return result;
    };
  };

  public getResolver = (): QueryResolver<TArgs, TReturn> => {
    try {
      return {
        parent: this.parent,
        fieldName: this.fieldName,
        returnType: this.returnType,
        args: this.args,
        resolve: this.getResolve()
      };
    } catch (error) {
      throw error;
    }
  };
}
