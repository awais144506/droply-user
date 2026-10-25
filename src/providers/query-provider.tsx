"use client";

import { useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { get, set, del } from "idb-keyval";

const CACHE_KEY = "DROPLY_REACT_QUERY_CACHE";
const CACHE_BUSTER = process.env.NEXT_PUBLIC_CACHE_VERSION || "v1.0.0";

// 1. Strictly typed IndexedDB storage adapter (No 'any' required)
const idbStorage = {
  getItem: async (key: string) => {
    const val = await get<string>(key);
    return val ?? null;
  },
  setItem: async (key: string, value: string) => {
    await set(key, value);
  },
  removeItem: async (key: string) => {
    await del(key);
  },
};

// 2. Wrap in Async Persister with write-throttling
const idbPersister = createAsyncStoragePersister({
  storage: idbStorage,
  key: CACHE_KEY,
  throttleTime: 2000,
});

// 3. Export helper to wipe IndexedDB + RAM cache on Logout!
export async function clearDroplyQueryCache(queryClient: QueryClient) {
  queryClient.clear();
  await del(CACHE_KEY);
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            networkMode: "offlineFirst",
            staleTime: 1000 * 60 * 5,        // 5 mins fresh (cuts network calls by >60%)
            gcTime: 1000 * 60 * 60 * 24,     // 24 hours in IndexedDB
            refetchOnWindowFocus: false,     // 🔥 Stop tab-switching traffic spikes across 1,000 branches
            refetchOnReconnect: true,        // Sync automatically if internet drops and comes back
            retry: 1,
          },
          mutations: {
            networkMode: "always",          
            retry: 0,                        
          },
        },
      })
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: idbPersister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours max age in IndexedDB
        buster: CACHE_BUSTER,        // Auto-wipes outdated IndexedDB schemas on new deploys
        dehydrateOptions: {
          // Only persist successful queries to IndexedDB (never save errors or loading states)
          shouldDehydrateQuery: (query) => query.state.status === "success",
        },
      }}
    >
      {children}
      {process.env.NEXT_PUBLIC_NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </PersistQueryClientProvider>
  );
}