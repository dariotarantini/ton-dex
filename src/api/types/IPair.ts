import ICoin from "./ICoin";

export default interface IPair {
  from: ICoin
  to: ICoin
  rate: {
    forward: number
    backward: number
  }
}