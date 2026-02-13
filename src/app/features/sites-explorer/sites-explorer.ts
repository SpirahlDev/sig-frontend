import { Component, inject, OnInit, signal } from '@angular/core';
import * as L from 'leaflet';
import { IconComponent } from "../../shared/components/icon/icon.component";
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { InputComponent } from '../../shared/components/input/input.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SitesServices } from '../../core/services/sites.service';
import { GeocodingService } from '../../core/services/geocoding.service';
import { Site, SiteFilters, SiteType } from '../../core/interfaces/ISite';
import { IPagination } from '../../core/interfaces/api/IPagination';
import { IMapCordinates } from '../../core/interfaces/IMapCordinates';
import { GeocodedLocation } from '../../core/interfaces/IGeocode';

@Component({
  selector: 'app-sites-explorer',
  imports: [IconComponent, NzButtonModule, NzModalModule, InputComponent, ReactiveFormsModule, FormsModule, NzSelectModule, NzIconModule],
  templateUrl: './sites-explorer.html',
  styleUrl: './sites-explorer.css',
})
export class SitesExplorer implements OnInit {
  private sitesService = inject(SitesServices);
  private geocodingService = inject(GeocodingService);
  private message = inject(NzMessageService);

  isModalVisible = false;
  isSubmitting = false;
  fileList: File[] = [];

  searchQuery = '';
  filterSiteType: number | null = null;
  filterCity: string | null = null;
  cities: string[] = ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pédro', 'Korhogo']; // Juste des données fictifs pour l'instant. Normalement ville est une table à part entière mais pour l'instant on va utiliser ça.

  siteTypes: SiteType[] = [];
  sites = signal<Site[]>([]);
  selectedSite = signal<Site | null>(null);
  hoveredSite: Site | null = null;

  selectedMapSpot: IMapCordinates | null = null;
  selectedSpotLocation: GeocodedLocation | null = null;
  isLoadingLocation = false;

  newSpotSelectionMarker: L.Marker | null = null;

  addSiteForm: FormGroup;

  customIcon = L.icon({
    iconUrl: 'assets/leaflet/marker-icon.png',
    shadowUrl: 'assets/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  newSpotIcon = L.icon({
    iconUrl: 'assets/leaflet/add-new-site-maker.svg',
    shadowUrl: 'assets/leaflet/add-new-site-maker.svg',
    iconSize: [48, 60],
    iconAnchor: [24, 60],
    popupAnchor: [0, -60],
  });

  map!: L.Map;
  markersLayer!: L.LayerGroup;


  constructor(private db: FormBuilder) {
    this.addSiteForm = this.db.group({
      name: ['', [Validators.required, Validators.maxLength(45)]],
      description: [''],
      lat: ['', Validators.required],
      lon: ['', Validators.required],
      city: ['', Validators.maxLength(200)],
      site_creation_date: [null],
      site_type_id: [null]
    });
  }

  ngOnInit(): void {
    this.loadSiteTypes();
  }


  ngAfterViewInit(): void {
    this.initMap();
  }

  private readonly ivoryCoastBounds = L.latLngBounds(
    L.latLng(4.35, -8.60),
    L.latLng(10.74, -2.49)
  );

  initMap() {
    this.map = L.map('map', {
      maxBounds: this.ivoryCoastBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 6
    });

    this.map.fitBounds(this.ivoryCoastBounds);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);

    this.loadSitesList();

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.onMapClick(e.latlng.lat, e.latlng.lng);
    });

  }

  private onMapClick(lat: number, lon: number): void {
    this.selectedMapSpot = { lat, lon };

    if (this.newSpotSelectionMarker) {
      this.map.removeLayer(this.newSpotSelectionMarker);
    }

    const popupContent = this.createNewSitePopup(lat, lon);

    this.newSpotSelectionMarker = L.marker([lat, lon])
      .addTo(this.map)
      .setIcon(this.newSpotIcon)
      .bindPopup(popupContent)
      .openPopup();

    this.addSiteForm.patchValue({
      lat: lat.toFixed(6),
      lon: lon.toFixed(6)
    });
  }

  private createNewSitePopup(lat: number, lon: number): HTMLElement {
    const container = document.createElement('div');
    container.className = 'new-site-popup';
    container.innerHTML = `
      <p>Ajouter un site à cet emplacement ?</p>
      <hr class="my-2 border-gray-200">
      <span class="text-xs text-gray-400">
        ${lat.toFixed(6)}, ${lon.toFixed(6)}
      </span>
    `;

    return container;
  }

  private clearMarkers(): void {
    this.markersLayer.clearLayers();
  }

  private updateMapMarkers(sites: Site[]): void {
    // Nettoyer les markers existants
    this.clearMarkers();

    sites.forEach(site => {
      this.addSingleMarker(site);
    });
  }

  onMarkerClick(site: Site): void {
    this.selectedSite.set(site);
    // S'il y a un marker d'ajout de site affiché sur la carte, on le retire
    if (this.newSpotSelectionMarker) {
      this.map.removeLayer(this.newSpotSelectionMarker);
    }
  }

  private loadSiteTypes(): void {
    this.sitesService.getSiteTypes().subscribe({
      next: (siteType: IPagination<SiteType>) => {
        this.siteTypes = siteType.data;
      },

      error: (error) => {
        console.error('Erreur lors du chargement des types de site:', error);
        this.siteTypes = [];
      }
    });
  }

  private loadSitesList(filters?: SiteFilters): void {
    this.sitesService.getSites(filters).subscribe({
      next: (sites: IPagination<Site>) => {
        this.sites.set(sites.data);
        this.updateMapMarkers(this.sites());

        // Désélectionner le site si il n'est plus dans les résultats
        const currentSelected = this.selectedSite();
        if (currentSelected && !sites.data.find(s => s.id === currentSelected.id)) {
          this.selectedSite.set(null);
        }
      },

      error: (error) => {
        console.error('Erreur lors du chargement des sites:', error);
        this.sites.set([]);
        this.clearMarkers();
      }
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.addFiles(files);
    }
  }

  private addFiles(files: FileList | File[]): void {
    const newFiles = Array.from(files).filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type);
      return isValidType;
    });
    this.fileList = [...this.fileList, ...newFiles];
  }

  removeFile(index: number): void {
    this.fileList.splice(index, 1);
  }

  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  formatFileSize(size: number): string {
    if (size === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }



  showModal(): void {
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.resetForm();
  }

  handleOk(): void {
    this.submitSite();
  }

  submitSite(): void {
    // Validation du formulaire
    if (this.addSiteForm.invalid) {
      Object.values(this.addSiteForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      this.message.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.fileList.length === 0) {
      this.message.error('Veuillez ajouter au moins une image');
      return;
    }

    this.isSubmitting = true;

    const formValues = this.addSiteForm.value;
    const payload = {
      name: formValues.name,
      lat: formValues.lat,
      lon: formValues.lon,
      description: formValues.description || undefined,
      city: formValues.city || undefined,
      site_creation_date: formValues.site_creation_date
        ? new Date(formValues.site_creation_date).toISOString().split('T')[0]
        : undefined,
      site_type_id: formValues.site_type_id || undefined
    };

    this.sitesService.createSite(payload, this.fileList).subscribe({
      next: (newSite: Site) => {
        this.message.success('Site ajouté avec succès');
        this.isModalVisible = false;
        this.resetForm();
        this.isSubmitting = false;

        // Supprimer le marker temporaire
        this.clearNewSpotMarker();

        // Ajouter le nouveau site à la liste et créer son marker
        this.sites.update(sites => [...sites, newSite]);
        this.addSingleMarker(newSite);

        // Sélectionner le nouveau site pour afficher ses détails
        this.selectedSite.set(newSite);
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du site:', error);
        this.message.error(error.error?.message || 'Erreur lors de l\'ajout du site');
        this.isSubmitting = false;
      }
    });
  }

  private clearNewSpotMarker(): void {
    if (this.newSpotSelectionMarker) {
      this.map.removeLayer(this.newSpotSelectionMarker);
      this.newSpotSelectionMarker = null;
      this.selectedMapSpot = null;
    }
  }

  private addSingleMarker(site: Site): void {
    const marker = L.marker([Number(site.lat), Number(site.lon)], { icon: this.customIcon })
      .addTo(this.markersLayer);

    const tooltipContent = `
      <div class="site-tooltip">
        <strong>${site.name}</strong>
        ${site.city ? `<br><span>${site.city}</span>` : ''}
        ${site.description ? `<br><small>${site.description.substring(0, 50)}${site.description.length > 50 ? '...' : ''}</small>` : ''}
      </div>
    `;
    marker.bindTooltip(tooltipContent, {
      direction: 'top',
      offset: [0, -35],
      className: 'site-marker-tooltip'
    });

    marker.on('mouseover', () => {
      this.hoveredSite = site;
    });

    marker.on('mouseout', () => {
      this.hoveredSite = null;
    });

    marker.on('click', () => {
      this.onMarkerClick(site);
    });
  }

  private resetForm(): void {
    this.addSiteForm.reset();
    this.fileList = [];
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.filterSiteType = null;
    this.filterCity = null;

    // Recharger tous les sites sans filtre
    this.loadSitesList();

    // Nettoyer le marker de nouveau spot si présent
    this.clearNewSpotMarker();
  }

  applyFilters(): void {
    const filters: SiteFilters = {};

    if (this.searchQuery?.trim()) {
      filters.search = this.searchQuery.trim();
    }
    if (this.filterCity) {
      filters.city = this.filterCity;
    }
    if (this.filterSiteType) {
      filters.site_type_id = this.filterSiteType;
    }

    this.loadSitesList(Object.keys(filters).length > 0 ? filters : undefined);
  }



  resolvePhotoUrl(url: string) {
    return this.sitesService.getPhotoUrl(url);
  }
}

/**
 * Fichier beaucoup trop long. Mais bon c'est vraiment un prototype 
 */