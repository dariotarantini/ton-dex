import type ICoin from "./types/ICoin";
import type ICoinList from "./types/ICoinList";

export async function getCoinList(url: string): Promise<ICoinList> {
  // simulate error
  if (url === 'error') {
    throw new Error('Cannot fetch coin list.');
  }

  return {
    enabled: true,
    title: 'TON DEX Token list',
    icon: '',
    url: '',
    coins: [
      {
        ticker: 'TON',
        icon: '',
        decimals: 9,
        contract: 'toncoin'
      },
      {
        ticker: 'DAI',
        icon: '',
        decimals: 9,
        contract: 'dai'
      },
      {
        ticker: 'USDT',
        icon: '',
        decimals: 9,
        contract: 'usdt'
      },
      {
        ticker: 'WETH',
        icon: '',
        decimals: 9,
        contract: 'weth'
      },
      {
        ticker: 'WBTC',
        icon: '',
        decimals: 9,
        contract: 'wbtc'
      },
      {
        ticker: 'BNB',
        icon: '',
        decimals: 9,
        contract: 'bnb'
      }
    ]
  };
}

export async function getSuggestions(): Promise<ICoin[]> {
  return [
    {
      ticker: 'TON',
      icon: '',
        decimals: 9,
        contract: 'toncoin'
    },
    {
      ticker: 'DAI',
      icon: '',
        decimals: 9,
        contract: 'dai'
    },
    {
      ticker: 'USDT',
      icon: '',
        decimals: 9,
        contract: 'usdt'
    },
    {
      ticker: 'USDC',
      icon: '',
        decimals: 9,
        contract: 'usdc'
    },
    {
      ticker: 'WBTC',
      icon: '',
        decimals: 9,
        contract: 'wbtc'
    },
    {
      ticker: 'WETH',
      icon: '',
        decimals: 9,
        contract: 'weth'
    }
  ];
}

export async function getFiatRate(contract: string): Promise<number> {
  switch (contract) {
    case 'toncoin':
      return 3.75;
    case 'wbtc':
      return 59000;
    case 'weth':
      return 4600;
    case 'bnb':
      return 640;
    case 'dai':
      return 1.01;
    case 'usdt':
      return 0.99;
    case 'usdc':
      return 1;
    default:
      return 10;
  }
}