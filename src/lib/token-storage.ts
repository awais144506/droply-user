export interface SavedCustomerPortal {
    token: string;
    branchName: string;
    customerName: string;
    lastVisited: number;
}

const PROFILES_KEY = "droply_customer_portals";
const ACTIVE_TOKEN_KEY = "droply_active_customer_token";

export const portalStorage = {
    getPortals(): SavedCustomerPortal[] {
        if (typeof window === "undefined") return [];
        try {
            const raw = localStorage.getItem(PROFILES_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    },

    savePortal(portal: Omit<SavedCustomerPortal, "lastVisited">) {
        if (typeof window === "undefined") return [];
        const current = this.getPortals();
        const existingIndex = current.findIndex((p) => p.token === portal.token);

        const updatedItem: SavedCustomerPortal = {
            ...portal,
            lastVisited: Date.now(),
        };

        if (existingIndex >= 0) {
            current[existingIndex] = updatedItem;
        } else {
            current.push(updatedItem);
        }

        // Sort most recently used first
        current.sort((a, b) => b.lastVisited - a.lastVisited);

        localStorage.setItem(PROFILES_KEY, JSON.stringify(current));
        localStorage.setItem(ACTIVE_TOKEN_KEY, portal.token);
        return current;
    },

    getActiveToken(): string | null {
        if (typeof window === "undefined") return null;
        const active = localStorage.getItem(ACTIVE_TOKEN_KEY);
        if (active) return active;
        const all = this.getPortals();
        return all.length > 0 ? all[0].token : null;
    },

    setActiveToken(token: string) {
        if (typeof window === "undefined") return;
        localStorage.setItem(ACTIVE_TOKEN_KEY, token);
    },
};