import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

export interface IAppConfig {
    apiUrl: string;
}

export function initializeApp(appConfig: AppConfig) {
    return () => appConfig.load();
}

@Injectable()
export class AppConfig {
    static settings: IAppConfig;
    constructor(private http: HttpClient) { }
    async load() {
        const jsonFile = `configs/config.${environment.name}.json`.replace('..', '.');
        try {
            const response = await firstValueFrom(this.http.get(jsonFile))
            AppConfig.settings = response as IAppConfig;
            return;
        } catch (response: any) {
            throw new Error(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
        }
    }
}