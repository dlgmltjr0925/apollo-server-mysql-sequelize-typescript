// Custom schema
// Sample: {                       // field name
//   schemaType: 'Object',         // filed type : 'Object', 'ObjectIO', 'Enum',
//   id: 'Int',                    // subfiled info : key(column name), value(type)
//   name: 'String',
//   sampleEnum: 'SampleType',
// },
// SampleType: {
//   schemaType: 'Enum',
//   values: ['ADMIN', 'USER'],
// }

import { ObjectIOOptions } from '../../libs/graphql/types';
import { SampleEnum } from './SampleEnum';

export interface Sample {
  id: number;
  name: string;
  sampleEnum: SampleEnum;
}

export const Schema: ObjectIOOptions = {
  fieldName: 'Sample',
  schemaType: 'ObjectIO', // Object: Output Type, ObjectIO: Input Output Type, Enum: Enum type
  subfield: {
    id: 'Int',
    name: 'String',
    sampleEnum: 'SampleEnum'
  }
};

export default Schema;
