import ICoin from "./types/ICoin";
import IPair from "./types/IPair";

export async function getPair(from: ICoin, to: ICoin): Promise<IPair> {
  if (from.ticker === 'error') {
    throw new Error('Cannot fetch rate.');
  }

  return {
    rate: {
      forward: 3.75,
      backward: 1 / 3.75
    },
    from,
    to
  };
}