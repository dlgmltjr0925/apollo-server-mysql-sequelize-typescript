import { QueryOptions } from '../../../libs/graphql/types';
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

interface Sample {
  id: number;
  name: string;
  sampleEnum: 'A' | 'B' | 'C';
}

interface Args {
  where: Sample;
}

export const sample: QueryOptions<Args, Sample> = {
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
