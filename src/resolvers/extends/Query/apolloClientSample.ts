import { gql } from 'apollo-server';
import log from '../../../utils/log';

const SAMPLE = gql`
  query Sample($where: SampleInput) {
    sample(where: $where) {
      id
      name
      sampleEnum
    }
  }
`;

export const sample = {
  parent: 'Query',
  fieldName: 'apolloClientSample',
  returnType: 'Sample',
  args: {
    where: 'SampleInput'
  },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    const { client } = context;
    try {
      const {
        data: { sample }
      } = await client.query({
        query: SAMPLE,
        variables: { where: args.where }
      });
      log.d('[apolloClientSample]' + JSON.stringify(sample));
      return sample;
    } catch (error) {
      log.e(error);
      throw error;
    }
  }
};

export default sample;
