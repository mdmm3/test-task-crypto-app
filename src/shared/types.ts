export interface Rate {
  id: string;
  symbol: string;
  currencySymbol: string;
  type: "fiat" | "crypto";
  rateUsd: string;
}

export interface Credentials {
  username: string;
  password: string;
}