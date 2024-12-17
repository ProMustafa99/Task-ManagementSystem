export interface Task {
    id?:number;
    type:number;
    parent_table:string;
    parent_id:number;
    status_id:number;
    assignee:number;
    created_at:Date;
};


