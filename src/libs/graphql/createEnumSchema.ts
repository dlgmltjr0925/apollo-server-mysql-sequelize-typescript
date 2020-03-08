import { APP_SCHEMAS_DATABASES_DIR } from '../../constants/path';
import fs from 'fs';

export const createEnumSchema = async (
  fieldName: string,
  schema: any
): Promise<void> => {
  const schemaType = schema.schemaType;
  delete schema.schemaType;

  let tsTypes = '';

  schema.values.forEach((value: string) => {
    tsTypes += `
  ${value} = '${value}',`;
  });
  const enumSchema = `import { EnumOptions } from '../../libs/graphql/types';

export enum ${fieldName} {${tsTypes}
}

export const Schema: EnumOptions = {
  fieldName: '${fieldName}',
  schemaType: '${schemaType}', 
  subfield: {
    values: Object.values(${fieldName})
  }
}

export default Schema;
`;

  fs.writeFileSync(APP_SCHEMAS_DATABASES_DIR + `/${fieldName}.ts`, enumSchema);
};

export default createEnumSchema;
