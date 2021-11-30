import ICoin from "./ICoin";

export default interface ICoinList {
  title: string
  url: string
  icon: string
  coins: ICoin[]
  enabled: boolean
}