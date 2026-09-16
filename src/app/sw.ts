/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, StaleWhileRevalidate, CacheableResponsePlugin } from "serwist"; // 🔥 Added CacheableResponsePlugin

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        {
            // Catch any URL that has 'clerk' in the hostname
            matcher: ({ url }) => url.hostname.includes("clerk"),
            handler: new StaleWhileRevalidate({
                cacheName: "clerk-assets-cache",
                plugins: [
                    // 🔥 THE FIX: Tell the cache to accept Cross-Origin Opaque Responses (Status 0)
                    new CacheableResponsePlugin({
                        statuses: [0, 200],
                    }),
                ],
            }),
        },
        // The rest of your Next.js app cache
        ...defaultCache,
    ],
});

serwist.addEventListeners();