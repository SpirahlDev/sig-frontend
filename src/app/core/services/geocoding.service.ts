import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { GeocodedLocation, NominatimResponse } from '../interfaces/IGeocode';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  private http = inject(HttpClient);

  private readonly nominatimUrl = 'https://nominatim.openstreetmap.org';

  reverseGeocode(lat: number, lon: number): Observable<GeocodedLocation | null> {
    const url = `${this.nominatimUrl}/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;

    return this.http.get<NominatimResponse>(url, {
      headers: {
        'Accept-Language': 'fr'
      }
    }).pipe(
      map(response => this.parseNominatimResponse(response, lat, lon)),
      catchError(error => {
        console.error('Erreur de géocodage inversé:', error);
        return of(null);
      })
    );
  }

  private parseNominatimResponse(response: NominatimResponse, lat: number, lon: number): GeocodedLocation {
    const address = response.address;

    const city = address.city || address.town || address.village || address.county || '';

    const addressParts: string[] = [];
    if (address.road) addressParts.push(address.road);
    if (address.neighbourhood) addressParts.push(address.neighbourhood);
    if (address.suburb) addressParts.push(address.suburb);

    return {
      displayName: response.display_name,
      address: addressParts.join(', ') || 'Adresse inconnue',
      city: city,
      country: address.country || '',
      lat: lat,
      lon: lon
    };
  }
}
