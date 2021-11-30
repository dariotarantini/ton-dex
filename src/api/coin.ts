import ICoin from "./types/ICoin";
import ICoinList from "./types/ICoinList";

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
        ticker: 'TONCOIN',
        icon: '',
        contract: 'toncoin'
      },
      {
        ticker: 'DAI',
        icon: '',
        contract: 'dai'
      },
      {
        ticker: 'USDT',
        icon: '',
        contract: 'usdt'
      },
      {
        ticker: 'WETH',
        icon: '',
        contract: 'weth'
      },
      {
        ticker: 'WBTC',
        icon: '',
        contract: 'wbtc'
      },
      {
        ticker: 'BNB',
        icon: '',
        contract: 'bnb'
      },
      {
        ticker: 'DAI',
        icon: '',
        contract: 'dai'
      },
      {
        ticker: 'USDT',
        icon: '',
        contract: 'usdt'
      },
      {
        ticker: 'WETH',
        icon: '',
        contract: 'weth'
      },
      {
        ticker: 'WBTC',
        icon: '',
        contract: 'wbtc'
      },
      {
        ticker: 'BNB',
        icon: '',
        contract: 'bnb'
      },
      {
        ticker: 'DAI',
        icon: '',
        contract: 'dai'
      },
      {
        ticker: 'USDT',
        icon: '',
        contract: 'usdt'
      },
      {
        ticker: 'WETH',
        icon: '',
        contract: 'weth'
      },
      {
        ticker: 'WBTC',
        icon: '',
        contract: 'wbtc'
      },
      {
        ticker: 'BNB',
        icon: '',
        contract: 'bnb'
      },
      {
        ticker: 'DAI',
        icon: '',
        contract: 'dai'
      },
      {
        ticker: 'USDT',
        icon: '',
        contract: 'usdt'
      },
      {
        ticker: 'WETH',
        icon: '',
        contract: 'weth'
      },
      {
        ticker: 'WBTC',
        icon: '',
        contract: 'wbtc'
      },
      {
        ticker: 'BNB',
        icon: '',
        contract: 'bnb'
      },
      {
        ticker: 'DAI',
        icon: '',
        contract: 'dai'
      },
      {
        ticker: 'USDT',
        icon: '',
        contract: 'usdt'
      },
      {
        ticker: 'WETH',
        icon: '',
        contract: 'weth'
      },
      {
        ticker: 'WBTC',
        icon: '',
        contract: 'wbtc'
      },
      {
        ticker: 'BNB',
        icon: '',
        contract: 'bnb'
      }
    ]
  };
}

export async function getSuggestions(): Promise<ICoin[]> {
  return [
    {
      ticker: 'TONCOIN',
      icon: '',
      contract: 'toncoin'
    },
    {
      ticker: 'DAI',
      icon: '',
      contract: 'dai'
    },
    {
      ticker: 'USDT',
      icon: '',
      contract: 'usdt'
    },
    {
      ticker: 'USDC',
      icon: '',
      contract: 'usdc'
    },
    {
      ticker: 'WBTC',
      icon: '',
      contract: 'wbtc'
    },
    {
      ticker: 'WETH',
      icon: '',
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