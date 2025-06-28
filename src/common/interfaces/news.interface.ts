export interface NewsResponse {
  id: number;
  title: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  summary_uz: string;
  summary_ru: string;
  summary_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  status: string;
  image_url: string;
  category?: {
    id: number;
    name: string;
    name_uz?: string;
    name_ru?: string;
    name_en?: string;
  };
  tags?: string[];
  views?: number;
  comments?: number;
  likes?: number;
  created_at?: Date;
  is_hot?: boolean;
  author_id?: number;
  author?: {
    id: number;
    name: string;
    status: string;
  };
  slug?: string;
}
