export interface ActivityLog {
    id: string;
    action: "CREATED" | "UPDATED" | "DELETED" | "RESTOCKED" | "OTHER";
    userName: string;
    createdAt: string;
}