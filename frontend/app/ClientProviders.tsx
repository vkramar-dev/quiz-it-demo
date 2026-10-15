"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import ThemeRegistry from "@/components/ThemeRegistry";
import { store } from "@/redux/store";
import { initState } from "@/redux/appSlice";
import { current } from "@/redux/testSlice";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    store.dispatch(initState());
    store.dispatch(current());
  }, []);

  return (
    <Provider store={store}>
      <ThemeRegistry>{children}</ThemeRegistry>
    </Provider>
  );
}