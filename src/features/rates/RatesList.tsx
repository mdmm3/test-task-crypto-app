import { useState } from 'react';
import Decimal from 'decimal.js';
import { Button, Center, Loader, Pagination, Select } from '@mantine/core';

import { MemoPriceRow } from '@/features/rates/PriceRow';
import usePersistedState from '@/shared/hooks/usePersistedState';
import { LOCALSTORAGE_KEYS } from '@/shared/const';
import useRatesStore, { useSelectedRates } from '@/services/ratesStore';
import { Rate } from '@/shared/types';

import classes from './RatesList.module.css';

enum SortDirection {
  WITHOUT_SORT = 'without_sort',
  ASC = 'asc',
  DESC = 'desc',
}

export default function RatesList() {
  const [itemsPerPage, setItemsPerPage] = usePersistedState(LOCALSTORAGE_KEYS.ratesItemsPerPage, 10);
  const [currentPage, setCurrentPage] = usePersistedState(LOCALSTORAGE_KEYS.ratesCurrentPage, 1);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.WITHOUT_SORT);

  const rates = useSelectedRates();
  const ratesStatus = useRatesStore(state => state.status);
  const loadRates = useRatesStore(state => state.loadRates);

  const pagesCount = Math.ceil(rates.length / itemsPerPage) || 1;

  const handleReloadClick = () => loadRates();

  const handleSelectSort = (value: string | null) => {
    setSortDirection(value as SortDirection);
  }

  const handleSelectItemsPerPage = (value: string | null) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }

  const dataToRender = getDataToRender(rates, sortDirection, itemsPerPage, currentPage);

  if (ratesStatus === 'idle' || ratesStatus === 'loading') {
    return (
      <Center>
        <Loader color="blue" size="xl" type="bars" />
      </Center>
    );
  }

  return (
    <div>
      <div className={classes.nav}>
        <Select
          className={classes.selectSort}
          label="Sort by"
          placeholder="Pick one"
          data={Object.values(SortDirection)}
          value={sortDirection}
          onChange={handleSelectSort}
        />
        <Select
          className={classes.selectPerPage}
          label="Items per page"
          placeholder="Pick one"
          data={['10', '25', '50', '100']}
          value={String(itemsPerPage)}
          onChange={handleSelectItemsPerPage}
        />
        <Button className={classes.reloadButton} onClick={handleReloadClick}>Reload data</Button>
      </div>
      <div className={classes.listWrapper}>
          {dataToRender.map((item) => (
            <MemoPriceRow
              key={item.id}
              symbol={item.symbol}
              currRateUsd={item.rateUsd}
            />
          ))}
      </div>
      <Pagination value={currentPage} onChange={setCurrentPage} total={pagesCount} />
    </div>
  );
}

function getDataToRender(
  data: Rate[],
  sortDirection: SortDirection,
  perPage: number,
  currPage: number,
): Rate[] {
  const sortedData = getSortedData(data, sortDirection);
  const sortedAndPaginatedData = getPaginatedData(sortedData, perPage, currPage);
  return sortedAndPaginatedData;
}


function getSortedData(data: Rate[], sortDirection: SortDirection): Rate[] {
  if (sortDirection === SortDirection.WITHOUT_SORT) {
    return data;
  }

  return [...data].sort((a, b) => {
      const aDecimal = new Decimal(a.rateUsd);
      const bDecimal = new Decimal(b.rateUsd);

      return sortDirection === SortDirection.ASC
        ? aDecimal.comparedTo(bDecimal)
        : bDecimal.comparedTo(aDecimal);
    }
  );
}

function getPaginatedData(rates: Rate[], itemsPerPage: number, currentPage: number): Rate[] {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  return rates.slice(startIndex, endIndex);
}

