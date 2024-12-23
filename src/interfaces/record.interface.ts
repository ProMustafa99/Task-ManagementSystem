export interface Record {
    record_status:number;
    created_on: Date;
    created_by: number;
    updated_on: Date;
    updated_by: number;
    deleted_on: Date;
    deleted_by: number;
}


export enum RecordStatus {
    PINDING = 1,        
    ACTIVE = 2,      
    DELETED = 3,
}
