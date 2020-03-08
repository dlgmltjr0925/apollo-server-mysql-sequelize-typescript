import { Field, ObjectSchema } from '.';

import { APP_SCHEMAS_DATABASES_DIR } from '../../constants/path';
import camelCase from 'camelcase';
import fs from 'fs';

const getTsTypeFromScalarType = (scalarType: string) => {
  const isRequire = /!$/.test(scalarType);
  const type = scalarType.replace(/!$/, '');

  switch (type) {
    case 'ID':
    case 'Int':
    case 'Float':
      return [`${isRequire ? '' : '?'}: number;`];
    case 'Boolean':
      return [`${isRequire ? '' : '?'}: boolean;`];
    case 'Date':
      return [`${isRequire ? '' : '?'}: Date;`];
    case 'String':
      return [`${isRequire ? '' : '?'}: string;`];
    default:
      return [
        `${isRequire ? '' : '?'}: ${type};`,
        `import { ${type} } from './${type}';`
      ];
  }
};

export const createObjectSchema = async (
  fieldName: string,
  schema: any
): Promise<void> => {
  const schemaType = schema.schemaType;
  delete schema.schemaType;

  let importTypes = '';
  let tsTypes = '';
  let subFields = '';

  for (let subFieldName in schema) {
    const { returnType } = schema[subFieldName];
    const [tsType, importType] = getTsTypeFromScalarType(returnType);

    if (importType)
      importTypes += `
${importType}`;
    tsTypes += `
  ${subFieldName}${tsType}`;
    subFields += `
    ${subFieldName}: '${returnType}',`;
  }
  const objectSchema = `import { ${schemaType}Options } from '../../libs/graphql/types';
${importTypes}
export interface ${fieldName} {${tsTypes}
}

export const Schema: ${schemaType}Options = {
  fieldName: '${fieldName}',
  schemaType: '${schemaType}', 
  subfield: {${subFields}
  }
}

export default Schema;
`;

  fs.writeFileSync(
    APP_SCHEMAS_DATABASES_DIR + `/${fieldName}.ts`,
    objectSchema
  );
};

export default createObjectSchema;
