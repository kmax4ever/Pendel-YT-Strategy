import { getCreate2Address } from "@ethersproject/address";
import { keccak256, pack } from "@ethersproject/solidity";
import {
  ChainId,
  CurrencyAmount,
  Fraction,
  JSBI,
  Pair,
  Percent,
  Token,
  TokenAmount,
  Trade,
  TradeType,
} from "@uniswap/sdk";
import { createDummyAddress, ZERO_ADDRESS } from "config";
import { SWAP_CONFIG } from "config/swapConfig";
import { PairInfo } from "types/swapTypes";
import { fromWei, toWei } from "./crypto";

export const sortTokenAddresses = (tokenA: string, tokenB: string) => {
  if (tokenA < tokenB) {
    return [tokenA, tokenB];
  } else {
    return [tokenB, tokenA];
  }
};

export const getPairAddress = (
  tokenAAddress: string,
  tokenBAddress: string
): string => {
  if (!tokenAAddress || !tokenBAddress) {
    return "";
  }
  const sorted = sortTokenAddresses(tokenAAddress, tokenBAddress);
  const pairAddress = getCreate2Address(
    SWAP_CONFIG.FACTORY_ADDRESS,
    keccak256(["bytes"], [pack(["address", "address"], sorted)]),
    SWAP_CONFIG.INIT_CODE_HASH
  );
  return pairAddress;
};

export const calculateLiquidityMinted = (
  totalSupply: number,
  tokenAReserve: number,
  tokenBReserve: number,
  tokenAAmount: number,
  tokenBAmount: number
): number => {
  if (!tokenAAmount || !tokenBAmount) {
    return 0;
  }
  const A = new Token(ChainId.MAINNET, ZERO_ADDRESS, 18, "tokenA", "tokenA");
  const B = new Token(
    ChainId.MAINNET,
    createDummyAddress(1),
    18,
    "tokenB",
    "tokenB"
  );

  const pair = new Pair(
    new TokenAmount(A, toWei(tokenAReserve)),
    new TokenAmount(B, toWei(tokenBReserve))
  );

  const totalSupplyToken = new TokenAmount(
    pair.liquidityToken,
    toWei(totalSupply)
  );
  const AmountA = new TokenAmount(A, toWei(tokenAAmount));
  const amountB = new TokenAmount(B, toWei(tokenBAmount));

  const mintedLiquidityToken = pair.getLiquidityMinted(
    totalSupplyToken,
    AmountA,
    amountB
  );
  return +fromWei(mintedLiquidityToken.raw.toString());
};

export function calculateSlippageAmount(
  value: number,
  slippage: number
): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`);
  }
  const A = new Token(ChainId.MAINNET, ZERO_ADDRESS, 18, "tokenA", "tokenA");
  const tokenAmount = new TokenAmount(A, toWei(value));
  return [
    JSBI.divide(
      JSBI.multiply(tokenAmount.raw, JSBI.BigInt(10000 - slippage)),
      JSBI.BigInt(10000)
    ),
    JSBI.divide(
      JSBI.multiply(tokenAmount.raw, JSBI.BigInt(10000 + slippage)),
      JSBI.BigInt(10000)
    ),
  ];
}

export function createAToken(address?: string) {
  const A = new Token(
    ChainId.MAINNET,
    address || ZERO_ADDRESS,
    18,
    "tokenA",
    "tokenA"
  );
  return A;
}
export function createTokenAmount(token: Token, amount: number) {
  const tokenAmount = new TokenAmount(token, toWei(amount));
  return tokenAmount;
}

export function calculatePriceAfterFee(
  tokenAAddress: string,
  tokenBAddress: string,
  tokenExactAmount: number,
  pairInfos: PairInfo[],
  allowedSlippage: number,
  swapType: TradeType
): {
  priceAB: number;
  priceBA: number;
  priceImpactPercent: number;
  realizedLPFee: number;
  slippageAjustedAmounts: { maximumAmountIn: number; minimumAmountOut: number };
  paths: { address: string }[];
} {
  try {
    if (
      pairInfos.length === 0 ||
      !tokenExactAmount ||
      !tokenAAddress ||
      !tokenBAddress
    ) {
      return {
        priceAB: 0,
        priceBA: 0,
        priceImpactPercent: 0,
        realizedLPFee: 0,
        slippageAjustedAmounts: { maximumAmountIn: 0, minimumAmountOut: 0 },
        paths: [],
      };
    }

    const pairs: any = [];

    for (let i = 0; i < pairInfos.length; i++) {
      const tokenA = createAToken(pairInfos[i].tokenAAddress);
      const tokenB = createAToken(pairInfos[i].tokenBAddress);

      const tokenAAmount = createTokenAmount(
        tokenA,
        pairInfos[i].tokenAReserve
      );
      const tokenBAmount = createTokenAmount(
        tokenB,
        pairInfos[i].tokenBReserve
      );
      const pair = new Pair(tokenAAmount, tokenBAmount);
      pairs.push(pair);
    }

    const tokenA = createAToken(tokenAAddress);
    const tokenB = createAToken(tokenBAddress);

    let amountExact;
    if (swapType === TradeType.EXACT_INPUT) {
      amountExact = createTokenAmount(tokenA, tokenExactAmount);
    } else {
      amountExact = createTokenAmount(tokenB, tokenExactAmount);
    }

    let trades;
    if (swapType === TradeType.EXACT_INPUT) {
      trades = Trade.bestTradeExactIn(pairs, amountExact, tokenB, {
        maxHops: 2,
        maxNumResults: 1,
      })[0];
    } else {
      trades = Trade.bestTradeExactOut(pairs, tokenA, amountExact, {
        maxHops: 2,
        maxNumResults: 1,
      })[0];
    }

    const priceBA = +trades.executionPrice.toSignificant(8);

    const priceBreakdown = computeTradePriceBreakdown(trades);
    const priceImpactPercent = priceBreakdown.priceImpactWithoutFee
      ? +priceBreakdown.priceImpactWithoutFee?.toSignificant(8)
      : 0;
    const realizedLPFee = priceBreakdown.realizedLPFee
      ? +priceBreakdown.realizedLPFee?.toSignificant(8)
      : 0;

    const slippageAjustedAmounts = computeSlippageAdjustedAmounts(
      trades,
      allowedSlippage
    );

    return {
      priceAB: 1 / priceBA,
      priceBA: priceBA,
      priceImpactPercent: priceImpactPercent,
      realizedLPFee: realizedLPFee,
      slippageAjustedAmounts: {
        maximumAmountIn: slippageAjustedAmounts.maximumAmountIn,
        minimumAmountOut: slippageAjustedAmounts.minimumAmountOut,
      },
      paths: trades.route.path,
    };
  } catch (err) {
    return {
      priceAB: 0,
      priceBA: 0,
      priceImpactPercent: 0,
      realizedLPFee: 0,
      slippageAjustedAmounts: { maximumAmountIn: 0, minimumAmountOut: 0 },
      paths: [],
    };
  }
}

// computes price breakdown for the trade
export function computeTradePriceBreakdown(
  trade?: Trade
): { priceImpactWithoutFee?: Percent; realizedLPFee?: CurrencyAmount } {
  const BASE_FEE = new Percent(
    JSBI.BigInt(SWAP_CONFIG.FEE_PERCENT * 10000),
    JSBI.BigInt(10000)
  ); //@TODO: custom fee
  const ONE_HUNDRED_PERCENT = new Percent(
    JSBI.BigInt(10000),
    JSBI.BigInt(10000)
  );
  const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE);
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee = !trade
    ? undefined
    : ONE_HUNDRED_PERCENT.subtract(
        trade.route.pairs.reduce<Fraction>(
          (currentFee: Fraction): Fraction =>
            currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
          ONE_HUNDRED_PERCENT
        )
      );

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction =
    trade && realizedLPFee
      ? trade.priceImpact.subtract(realizedLPFee)
      : undefined;

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
    ? new Percent(
        priceImpactWithoutFeeFraction?.numerator,
        priceImpactWithoutFeeFraction?.denominator
      )
    : undefined;

  // the amount of the input that accrues to LPs
  const realizedLPFeeAmount =
    realizedLPFee &&
    trade &&
    (trade.inputAmount instanceof TokenAmount
      ? new TokenAmount(
          trade.inputAmount.token,
          realizedLPFee.multiply(trade.inputAmount.raw).quotient
        )
      : CurrencyAmount.ether(
          realizedLPFee.multiply(trade.inputAmount.raw).quotient
        ));

  return {
    priceImpactWithoutFee: priceImpactWithoutFeePercent,
    realizedLPFee: realizedLPFeeAmount,
  };
}

export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000));
}

export function computeSlippageAdjustedAmounts(
  trade: Trade | undefined,
  allowedSlippage: number
): { maximumAmountIn: number; minimumAmountOut: number } {
  const pct = basisPointsToPercent(allowedSlippage);
  return {
    maximumAmountIn: trade ? +trade?.maximumAmountIn(pct).toSignificant(8) : 0,
    minimumAmountOut: trade
      ? +trade?.minimumAmountOut(pct).toSignificant(8)
      : 0,
  };
}
