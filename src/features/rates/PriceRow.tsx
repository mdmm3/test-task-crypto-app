import React from "react";
import { usePrevious } from "@mantine/hooks";
import Decimal from "decimal.js";
import classNames from "classnames";

import AssetIcon from "@/shared/components/AssetIcon";

import classes from './PriceRow.module.css';

interface PriceRowProps {
  symbol: string;
  currRateUsd: string;
}

enum PriceChangeDirection {
  NO_CHANGE = "no_change",
  UP = "up",
  DOWN = "down",
}

const priceChangeClassnames: Record<PriceChangeDirection, string> = {
  [PriceChangeDirection.UP]: classes.priceChangedUp,
  [PriceChangeDirection.DOWN]: classes.priceChangedDown,
  [PriceChangeDirection.NO_CHANGE]: '',
}

function getPriceChangeDirection(prevPrice: string | undefined, currPrice: string) {
  const prevDecimal = new Decimal(prevPrice || '0');
  const currDecimal = new Decimal(currPrice)

  if (prevPrice === undefined || prevDecimal.equals(currDecimal)) {
    return PriceChangeDirection.NO_CHANGE;
  }

  return prevDecimal.lessThan(currDecimal)
    ? PriceChangeDirection.UP
    : PriceChangeDirection.DOWN;
}

export default function PriceRow({ symbol, currRateUsd }: PriceRowProps) {
  const prevRateUsd = usePrevious(currRateUsd);
  const priceChangeClassname = priceChangeClassnames[getPriceChangeDirection(prevRateUsd, currRateUsd)];

  return (
    <div className={classNames(classes.priceRow, priceChangeClassname)}>
      <div className={classes.symbol}>
        <AssetIcon className={classes.icon} assetId={symbol} />
        {symbol}
      </div>
      <div className={classes.rate}>{'$' + currRateUsd}</div>
    </div>
  );
}

export const MemoPriceRow = React.memo(PriceRow)