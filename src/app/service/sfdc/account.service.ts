import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../../model/sfdc/account';
import { HttpClient } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpClient: HttpClient) { }

  getAllAccounts(): Observable<Account[]> {

    return this.httpClient.get<Account[]>('http://localhost:4200/api/accounts');

  }
}
