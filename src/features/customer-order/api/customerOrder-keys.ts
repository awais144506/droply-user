export const customerRequestKeys = {
    all: ["magic-portal"] as const,
    token: (token: string) => [...customerRequestKeys.all, token] as const,
}