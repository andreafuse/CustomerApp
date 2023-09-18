import { Injectable } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged, map } from "rxjs";

export interface IToolbarConfiguration {
    showBackButton: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToolbarService {

    private _configs$ = new BehaviorSubject<IToolbarConfiguration>({
        showBackButton: false
    })

    get showBackButton$() {
        return this._configs$
            .pipe(
                map(e => e.showBackButton),
                distinctUntilChanged()
            )
    }

    setConfig(config: Partial<IToolbarConfiguration>) {
        this._configs$.next({...this._configs$.value, ...config})
    }
}