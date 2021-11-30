import { Routes, Route } from "react-router-dom";

import SwapPage from "./SwapPage/SwapPage";
import PoolPage from "./PoolPage/PoolPage";
import PoolListPage from "./PoolListPage/PoolListPage";
import SettingsPage from "./SettingsPage/SettingsPage";
import TransactionsPage from "./TransactionsPage/TransactionsPage";
import AddLiquidityPage from "./AddLiquidityPage/AddLiquidityPage";
import RemoveLiquidityPage from "./RemoveLiquidityPage/RemoveLiquidityPage";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<SwapPage />} />

      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/settings" element={<SettingsPage />} />

      <Route path="/pool" element={<PoolListPage />} />
      <Route path="/pool/:contract" element={<PoolPage />} />
      <Route path="/pool/*" element={<PoolPage />} />

      <Route path="/add" element={<AddLiquidityPage />} />
      <Route path="/add/:fromContract/:toContract" element={<AddLiquidityPage />} />
      <Route path="/add/*" element={<AddLiquidityPage />} />

      <Route path="/remove" element={<RemoveLiquidityPage />} />
      <Route path="/remove/:contract" element={<RemoveLiquidityPage />} />
      <Route path="/remove/*" element={<RemoveLiquidityPage />} />

    </Routes>
  )
}