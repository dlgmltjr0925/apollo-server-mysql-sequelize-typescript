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

export const Sample = {
  fieldName: 'Sample',
  schemaType: 'ObjectIO', // Object: Output Type, ObjectIO: Input Output Type, Enum: Enum type
  subfield: {
    id: 'Int',
    name: 'String',
    sampleEnum: 'SampleEnum' // Enum type 생성 필요
  }
};

export default Sample;
