export interface Task {
    id?:number;
    type:number;
    parent_table:string;
    parent_id:number;
    assignee:string;
    created_at:Date;
};