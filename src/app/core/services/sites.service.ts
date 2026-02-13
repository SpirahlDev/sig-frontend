import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CreateSitePayload, Site, SiteFilters, SiteType } from '../interfaces/ISite';
import { IResponse } from '../interfaces/api/IResponse';
import { IPagination } from '../interfaces/api/IPagination';
import { AppConfig } from '../../app';


@Injectable({
  providedIn: 'root',
})
export class SitesServices {
  private http = inject(HttpClient);
  private appConfig = inject(AppConfig);
  
  private readonly apiUrl=this.appConfig.ApiBaseUrl;
  
  private readonly sitesUrl = `${this.apiUrl}/sites`;
  private readonly siteTypesUrl = `${this.apiUrl}/site-types`;

  createSite(payload: CreateSitePayload, images: File[]): Observable<Site> {
    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('lat', payload.lat);
    formData.append('lon', payload.lon);

    if (payload.description) {
      formData.append('description', payload.description);
    }
    if (payload.city) {
      formData.append('city', payload.city);
    }
    if (payload.site_creation_date) {
      formData.append('site_creation_date', payload.site_creation_date);
    }
    if (payload.site_type_id) {
      formData.append('site_type_id', payload.site_type_id.toString());
    }

    images.forEach(file => {
      formData.append('images[]', file, file.name);
    });

    return this.http.post<IResponse<Site>>(this.sitesUrl, formData).pipe(
      map(response => response.data)
    );
  }

  getSites(filters?: SiteFilters): Observable<IPagination<Site>> {
    let params: { [key: string]: string } = {};

    if (filters) {
      if (filters.search) {
        params['search'] = filters.search;
      }
      if (filters.city) {
        params['filter[city]'] = filters.city;
      }
      if (filters.site_type_id) {
        params['filter[site_type_id]'] = filters.site_type_id.toString();
      }
    }

    return this.http.get<IResponse<IPagination<Site>>>(this.sitesUrl, { params }).pipe(
      map(response => response.data)
    );
  }

  getSiteById(id: number): Observable<Site> {
    return this.http.get<Site>(`${this.sitesUrl}/${id}`);
  }


  getSiteTypes():Observable<IPagination<SiteType>>{
    return this.http.get<IResponse<IPagination<SiteType>>>(this.siteTypesUrl).pipe(
      map(response => response.data)
    );
  }

  getPhotoUrl(url:string){
    return `${this.appConfig.baseUrl}${url}`;
  }
}
