export type ActivityLogActionEnums = 
    | 'CREATED' 
    | 'UPDATED' 
    | 'DELETED' 
    | 'STATUS' 
    | 'ENABLE'
    | 'DISABLE'
    | 'RESTOCKED';

export interface ActivityLog {
    id: string;
    branchId: string;
    userName: string;
    action: ActivityLogActionEnums;
    type: string;
    description: string;
    createdAt: string;
}