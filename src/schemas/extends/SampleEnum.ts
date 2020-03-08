// Custom schema
// User: {                       // field name
//   schemaType: 'Object',       // filed type : 'Object', 'ObjectIO', 'Enum',
//   user_id: 'Int',             // subfiled info : key(column name), value(type)
//   user_name: 'String',
//   user_token: 'String',
//   user_email: 'String',
//   type: 'UserType',           // enum
//   create_at: 'Date',
//   updated_at: 'Data',
// },
// UserType: {
//   schemaType: 'Enum',
//   values: ['ADMIN', 'USER'],
// }

import { EnumOptions } from '../../libs/graphql/types';

export enum SampleEnum {
  A = 'A',
  B = 'B',
  C = 'C'
}

export const schema: EnumOptions = {
  fieldName: 'SampleEnum',
  schemaType: 'Enum', // Object: Output Type, ObjectIO: Input Output Type, Enum: Enum type
  subfield: {
    values: Object.values(SampleEnum)
  }
};

export default schema;
