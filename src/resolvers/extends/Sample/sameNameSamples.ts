import { QueryOptions } from '../../../libs/graphql/types';
import log from '../../../utils/log';

interface Sample {
  id: number;
  name: string;
  sampleEnum: 'A' | 'B' | 'C';
}

interface Args {}

export const sameNameSamples: QueryOptions<Args, Sample[]> = {
  parent: 'Sample',
  fieldName: 'sameNameSamples',
  returnType: '[Sample]',
  args: {},
  resolve: async (
    { name }: any,
    args: any,
    { sameNameLoader }: any,
    info: any
  ) => {
    const samples = await sameNameLoader.load(name);
    log.d(`[${info.fieldName}]`, samples);
    return samples;
  }
};

export default sameNameSamples;
