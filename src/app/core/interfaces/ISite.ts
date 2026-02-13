import { IPhoto } from "./IPhotos";

export interface CreateSitePayload {
  name: string;
  description?: string;
  lat: string;
  lon: string;
  city?: string;
  site_creation_date?: string;
  site_type_id?: number;
}

export interface Site {
  id: number;
  name: string;
  description?: string;
  lat: string;
  lon: string;
  city?: string;
  site_creation_date?: string;
  site_type_id?: number;
  photos?: IPhoto[];
}

export interface SiteType {
  id: number;
  label: string;
  code: string;
}

export interface SiteFilters {
  search?: string;
  city?: string;
  site_type_id?: number;
}