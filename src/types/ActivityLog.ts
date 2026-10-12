export interface ActivityLog {
    description: string;
    id: string;
    action: "CREATED" | "UPDATED" | "DELETED" | "RESTOCKED" | "OTHER";
    userName: string;
    type: string;
    createdAt: string;
}