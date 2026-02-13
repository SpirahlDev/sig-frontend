import { Component } from '@angular/core';
import * as L from 'leaflet';
import { IconComponent } from "../../shared/components/icon/icon.component";

@Component({
  selector: 'app-sites-explorer',
  imports: [IconComponent],
  templateUrl: './sites-explorer.html',
  styleUrl: './sites-explorer.css',
})
export class SitesExplorer {
  isVisible = false;

  ngAfterViewInit(): void {
    const map = L.map('map').setView([5.348, -4.027], 14);

    const customIcon = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([5.348, -4.027], {icon: customIcon}).addTo(map);
  }

  showModal(): void {
    this.isVisible = true;
  }
}