import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wallets: [],
  transactions: {},
  allTransactions: [],
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallets: (state, action) => { state.wallets = action.payload; },
    setWalletTransactions: (state, action) => { state.transactions[action.payload.walletId] = action.payload.transactions; },
    setAllTransactions: (state, action) => { state.allTransactions = action.payload; },
  },
});

export const { setWallets, setWalletTransactions, setAllTransactions } = walletSlice.actions;
export default walletSlice.reducer;
