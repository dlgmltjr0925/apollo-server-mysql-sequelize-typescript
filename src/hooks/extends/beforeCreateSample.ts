import log from '../../utils/log';

export const beforeCreateSample = async (
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  if (args && args.input && args.input.id !== undefined) delete args.input.id; // private key delete
  log.d(args.input.id);
  return await log.d('[beforeCreateSample]', args);
};

export default beforeCreateSample;
