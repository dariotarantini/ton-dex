import IPair from "./IPair";

export default interface IPool {
  contract: string
  fee: number
  locked: {
    from: number
    to: number
  }
  info: {
    volume: {
      value: number,
      change: number
    }
    tvl: {
      change: number
      value: number
    }
    fees: {
      value: number,
      change: number
    }
  },
  pair: IPair
}