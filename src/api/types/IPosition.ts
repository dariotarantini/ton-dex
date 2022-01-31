import IPair from "./IPair";

export default interface IPosition {
  pair: IPair
  contract: string
  tokens: number
  share: number
  decimals: number
  amount: {
    from: number
    to: number
  }
}