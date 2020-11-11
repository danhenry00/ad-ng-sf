import { Component, OnInit } from '@angular/core';
import { AccountService } from '../service/sfdc/account.service';
import { Account } from '../model/sfdc/account';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  accounts : Observable<Account[]>
  
  constructor(accountService : AccountService) { 
    this.accounts = accountService.getAllAccounts();
  }
  
  ngOnInit() {
    
  }
}
