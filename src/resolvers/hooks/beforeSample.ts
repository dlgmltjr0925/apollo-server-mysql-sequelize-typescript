import log from '../../utils/log';

export const beforeSample = async (
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  args.sample = 'before';
  return await log.i('beforeSample', args);
};

export default beforeSample;
