import log from '../../utils/log';

export const afterSample = async (
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  args.sample = 'after';
  await log.i('afterSample', args);
};

export default afterSample;
