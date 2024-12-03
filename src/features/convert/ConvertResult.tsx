import Decimal from 'decimal.js';
import { Text } from '@mantine/core';

import useRatesStore from '@/services/ratesStore';

import classes from './ConvertResult.module.css';

interface ConvertationResult {
  withoutComission: string;
  withComission: string;
}

interface Props {
  fromCurrencyId: string;
  toCurrencyId: string;
  comissionInPercent: number;
  amount: string;
}

export default function ConvertResult({ amount, fromCurrencyId, toCurrencyId, comissionInPercent }: Props) {
  const fromCurrency = useRatesStore(state => state.ratesByAssetId[fromCurrencyId]);
  const toCurrency = useRatesStore(state => state.ratesByAssetId[toCurrencyId]);

  const { rateUsd: fromCurrencyRateUsd, symbol: fromCurrencySymbol } = fromCurrency;
  const { rateUsd: toCurrencyRateUsd, symbol: toCurrencySymbol, type: toCurrencyType } = toCurrency;

  const conversionResult = calculateConversion({
    amount,
    fromCurrencyRateUsd,
    toCurrencyRateUsd,
    comissionInPercent,
    toCurrencyType,
  });

  return (
    <Text className={classes.text} fw={500}>
      Convertation result: <br />
      {`${amount} ${fromCurrencySymbol}`} <br />
      {'->'} <br />
      {`${conversionResult.withComission} ${toCurrencySymbol} (${conversionResult.withoutComission} ${toCurrencySymbol} + ${comissionInPercent}%).`}
    </Text>
  );
}

const calculateConversion = ({
  amount,
  fromCurrencyRateUsd,
  toCurrencyRateUsd,
  comissionInPercent,
  toCurrencyType,
}: {
  amount: string;
  fromCurrencyRateUsd: string;
  toCurrencyRateUsd: string;
  comissionInPercent: number;
  toCurrencyType: 'fiat' | 'crypto';
}): ConvertationResult => {
  const decimalAmount = new Decimal(amount);
  const decimalFromRate = new Decimal(fromCurrencyRateUsd);
  const decimalToRate = new Decimal(toCurrencyRateUsd);
  const decimalCommissionPercent = new Decimal(comissionInPercent);

  const amountInUsd = decimalAmount.times(decimalFromRate);

  const resultWithoutCommission = amountInUsd.dividedBy(decimalToRate);

  const commission = resultWithoutCommission.times(decimalCommissionPercent).dividedBy(100);

  const resultWithCommission = resultWithoutCommission.plus(commission);

  const decimalPlaces = toCurrencyType === 'fiat' ? 2 : 18;

  return {
    withoutComission: resultWithoutCommission.toFixed(decimalPlaces, Decimal.ROUND_DOWN),
    withComission: resultWithCommission.toFixed(decimalPlaces, Decimal.ROUND_DOWN),
  };
};
