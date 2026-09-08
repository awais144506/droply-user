export interface ActivityLog {
    id: string;
    action: "CREATED" | "UPDATED" | "DELETED" | "RESTOCKED" | "OTHER";
    userName: string;
    entityType: string;
    entityName: string;
    createdAt: string;
}