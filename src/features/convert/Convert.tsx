import { useState } from "react";
import { Box, Center, Loader, NumberInput, Select, Text } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";

import useRatesStore from "@/services/ratesStore";
import { CONVERT_COMMISION_PERCENT } from "@/shared/const";
import ConvertResult from "./ConvertResult";

const AMOUNT_INPUT_DEBOUNCE_MS = 300;

export default function Convert() {
  const [fromCurrencyId, setFromCurrencyId] = useState("");
  const [toCurrencyId, setToCurrencyId] = useState("");
  const [amount, setAmount] = useDebouncedState("", AMOUNT_INPUT_DEBOUNCE_MS);

  const ratesStatus = useRatesStore(state => state.status);
  const assetsIds = useRatesStore((state) => state.assetsIds);

  const hasCurrencies = fromCurrencyId && toCurrencyId;
  const areSameCurrencies = fromCurrencyId === toCurrencyId;
  const canConvert = hasCurrencies && !areSameCurrencies && amount;

  const handleSelectFrom = (value: string | null) => {
    setFromCurrencyId(value!);
  };

  const handleSelectTo = (value: string | null) => {
    setToCurrencyId(value!);
  };

  if (ratesStatus === 'idle' || ratesStatus === 'loading') {
    return (
      <Center>
        <Loader color="blue" size="xl" type="bars" />
      </Center>
    );
  }

  return (
    <Box>
      <Select
        label="Select from"
        placeholder="Pick one"
        data={assetsIds}
        value={fromCurrencyId}
        onChange={handleSelectFrom}
        searchable
      />
      <Select
        label="Select to"
        placeholder="Pick one"
        data={assetsIds}
        value={toCurrencyId}
        onChange={handleSelectTo}
        searchable
      />
      <NumberInput
        label="Amount"
        placeholder="Enter amount"
        value={amount}
        onChange={value => setAmount(String(value))}
      />
      {hasCurrencies && areSameCurrencies && (
        <Text c="red">From and to currencies are the same</Text>
      )}
      {canConvert && (
        <ConvertResult
          amount={amount}
          fromCurrencyId={fromCurrencyId}
          toCurrencyId={toCurrencyId}
          comissionInPercent={CONVERT_COMMISION_PERCENT}
        />
      )}
    </Box>
  );
}
