import { Record } from "@/interfaces/record.interface";

export interface Blog extends Record {
    id: number;
    title_en: string;
    title_ar: string;
    url_en: string;
    url_ar: string;
}