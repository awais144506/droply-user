/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"; // 🔥 Missing piece!
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import * as idb from "idb-keyval";

// 1. Create the storage adapter that matches what TanStack expects
const idbStorage = {
  getItem: async (key: string) => await idb.get(key),
  setItem: async (key: string, value: any) => await idb.set(key, value),
  removeItem: async (key: string) => await idb.del(key),
};

// 2. Wrap it in the official Async Persister
const idbPersister = createAsyncStoragePersister({
  storage: idbStorage,
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            networkMode: 'offlineFirst',
            staleTime: 1000 * 60 * 5, 
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: idbPersister }} // Now properly formatted!
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
}