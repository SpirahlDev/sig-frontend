import { Component, Injectable, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.prod';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Système d\'Information Géographique');
}



@Injectable({
  providedIn: 'root'
})
export class AppConfig {

  private readonly _config = {
    baseUrl: environment.baseUrl,
    production: environment.production,
  };

  get(key: keyof typeof this._config) {
    return this._config[key];
  }

  get all(){
    return this._config;
  }

  get baseUrl(){
    return this._config.baseUrl;
  }

  get ApiBaseUrl(){
    return `${this.baseUrl}/api`;
  }

  get isProductionMode():boolean{
    return this._config.production;
  }

  get isTestMode():boolean{
    return environment.testMode;
  }
 
}