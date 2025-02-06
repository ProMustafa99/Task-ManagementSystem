import { Record } from "@/interfaces/record.interface";

export interface Article extends Record {
    id: number;
    blog_id: number;
    title_en: string;
    title_ar: string;
    url_en: string;
    url_ar: string;
    description_en: string;
    description_ar: string;
    in_links?: any | null; 
    related_links: any | null;
    cover_image_url: string;
}
