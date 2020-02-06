import log from '../../../utils/log';

export const sameNameSamples = {
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
