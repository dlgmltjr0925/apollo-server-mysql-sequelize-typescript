interface EnumSubfield {
  values: string[];
}

export interface EnumOptions {
  fieldName: string;
  schemaType: 'Enum';
  subfield: EnumSubfield;
}

export class Enum {
  fieldName: string;
  schemaType: 'Enum';
  subfield: EnumSubfield;
  constructor(options: EnumOptions) {
    const { fieldName, schemaType, subfield } = options;
    this.fieldName = fieldName;
    this.schemaType = schemaType;
    this.subfield = subfield;
  }

  public getSchema = (): Omit<Enum, 'getSchema'> => {
    const { fieldName, schemaType, subfield } = this;
    return {
      fieldName,
      schemaType,
      subfield
    };
  };
}

export default Enum;
