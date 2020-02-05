import log from '../../utils/log';

export const afterCreateSample = async (
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  await log.d('[afterCreateSample]', args);
};

export default afterCreateSample;
