import { useMemo } from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import keyBy from 'lodash/keyBy';
import map from 'lodash/map';

import { Rate } from '@/shared/types';

interface RatesState {
  assetsIds: string[];
  ratesByAssetId: Record<string, Rate>;
  status: 'idle' | 'loading' | 'error' | 'connected';
  error: string | null;
}

interface RatesActions {
  init: () => Promise<void>;
  loadRates: () => Promise<void>;
  connectToWebSockets: () => void;
}

const WS_URL = 'wss://ws.coincap.io/prices';
const API_URL = 'https://api.coincap.io/v2/rates';

const useRatesStore = create<RatesState & RatesActions>()(
  immer((set, get) => {
    let ws: WebSocket | null = null;

    return {
      assetsIds: [],
      ratesByAssetId: {},
      status: 'idle',
      error: null,
  
      loadRates: async () => {
        try {
          set(state => { state.status = 'loading'; state.error = null; });
          
          const response = await fetch(API_URL);

          if (!response.ok) throw response; 

          const json = await response.json();
          const rates: Rate[] = json.data;
          
          set(state => {
            state.ratesByAssetId = keyBy(rates, 'id');
            state.assetsIds = map(rates, 'id');
            state.status = 'connected';
          });
        } catch (error) {
          set(state => {
            state.error = (error as Error).message;
            state.status = 'error';
          });
        }
      },
  
      connectToWebSockets: () => {
        if (ws) return;

        ws = new WebSocket(`${WS_URL}?assets=ALL`);
        
        ws.onmessage = (event) => {
          const updates: Record<string, string> = JSON.parse(event.data);
          
          set(state => {
            Object.entries(updates).forEach(([assetId, newPrice]) => {
              if (state.ratesByAssetId[assetId]) {
                state.ratesByAssetId[assetId].rateUsd = newPrice;
              }
            });
          });
        };
  
        ws.onerror = () => {
          set(state => { state.error = 'WebSocket error occurred'; });
        };
      },
  
      init: async () => {
        await get().loadRates();
        get().connectToWebSockets();
      },
    }
  })
);

export default useRatesStore;

export const useSelectedRates = () => {
  const assetsIds = useRatesStore((state) => state.assetsIds);
  const ratesByAssetId = useRatesStore((state) => state.ratesByAssetId);

  return useMemo(() => {
    return assetsIds.map((id) => ratesByAssetId[id]);
  }, [assetsIds, ratesByAssetId]);
};