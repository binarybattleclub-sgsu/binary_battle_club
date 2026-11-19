import joinApplicationHandler from './join-application';

export default async function handler(req: any, res: any) {
  return joinApplicationHandler(req, res);
}
