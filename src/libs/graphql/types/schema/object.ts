type ScalarType =
  | 'Int'
  | 'Int!'
  | 'Float'
  | 'Float!'
  | 'String'
  | 'String!'
  | 'Boolean'
  | 'Boolean!'
  | 'ID'
  | 'ID!'
  | 'Date'
  | 'Date!'
  | string;
type Subfield = Record<string, ScalarType>;

export interface ObjectOptions {
  fieldName: string;
  schemaType: 'Object';
  subfield: Subfield;
}

export interface ObjectIOOptions {
  fieldName: string;
  schemaType: 'ObjectIO';
  subfield: Subfield;
}

export type Options = ObjectOptions | ObjectIOOptions;

export class GraphQLObject {
  fieldName: string;
  schemaType: 'Object' | 'ObjectIO';
  subfield: Subfield;
  constructor(options: Options) {
    const { fieldName, schemaType, subfield } = options;
    this.fieldName = fieldName;
    this.schemaType = schemaType;
    this.subfield = subfield;
  }

  public getSchema = (): Omit<GraphQLObject, 'getSchema'> => {
    const { fieldName, schemaType, subfield } = this;
    return {
      fieldName,
      schemaType,
      subfield
    };
  };
}

export default GraphQLObject;
