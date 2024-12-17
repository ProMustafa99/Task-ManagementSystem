export interface Task {
    id?:number;
    type:number;
    title:string;
    parent_table:string;
    parent_id:number;
    assignee:number;
    created_at:Date;
};