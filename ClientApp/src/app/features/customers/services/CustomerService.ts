import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { combineLatest, forkJoin, map, ReplaySubject, switchMap } from 'rxjs';
import { AppConfig } from 'src/app/helpers/app.config';

export interface ICustomerDetail extends ICustomerWrite {
  id: string;
  invoices: IInvoiceList[];
}

export interface ICustomerWrite {
  companyName: string;
  address: string;
  state: string;
  country: string;
  subscriptionState: string;
}

export interface ICustomerLight {
  id: string;
  companyName: string;
  fullAddress: string;
  subscriptionState: string;
  numberOfInvoices: number;
}

export interface IInvoiceList {
  number: string;
  date: Date;
  total: number;
}


@Injectable()
export class CustomerService {
  private readonly baseUrl = `${AppConfig.settings.apiUrl}/customer`;

  private _totalCount$: ReplaySubject<number> = new ReplaySubject(1);
  public totalCount$ = this._totalCount$.asObservable();

  constructor(private _httpClient: HttpClient) {
    this.getCustomersCount();
  }

  private getCustomersCount() {
    const href = `${this.baseUrl}/count`;
    return this._httpClient.get<number>(encodeURI(href))
      .subscribe(v => this._totalCount$.next(v));
  }

  GetCustomersLight(sort: keyof ICustomerLight, order: SortDirection, page: number, pageSize: number) {
    console.log("Get Customer List")
    const href = `${this.baseUrl}/odata`;
    const queryParam = [
      `$top=${pageSize}`,
      page === 0 ? '' : `&$skip=${page * pageSize}`,
      `&$orderBy=${sort} ${order}`
    ].join('');

    const requestUrl = `${href}?${queryParam}`;
    return combineLatest({
      count: this.totalCount$,
      items: this._httpClient.get<ICustomerLight[]>(encodeURI(requestUrl))
    });
  }

  CheckCustomerByName(companyName: string) {
    const href = `${this.baseUrl}/exists/${companyName}`;
    return this._httpClient.get<boolean>(href);
  }

  Insert(customer: ICustomerWrite) {
    console.log("Insert Customer")
    const href = `${this.baseUrl}`;
    return forkJoin({
      insert: this._httpClient.post<{ name: string }>(href, customer),
      count: this._httpClient.get<number>(encodeURI(`${href}/count`))
    }
    ).pipe(
      map(v => {
        console.log("POST INSERIMENTO UTENTE")
        console.log(v.insert)
        console.log(v.count)
        this._totalCount$.next(v.count)
      })
    );

  }

  Update(id: string, customer: ICustomerWrite) {
    console.log("Updating Customer")
    const href = `${this.baseUrl}/${id}`;
    return this._httpClient.post<void>(href, customer)
  }

  GetDetail(id: string) {
    const href = `${this.baseUrl}/${id}`;
    return this._httpClient.get<ICustomerDetail>(href)
  }

}
