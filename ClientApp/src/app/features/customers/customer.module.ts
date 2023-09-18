import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerDetailComponent, UniqueCustomerName } from './components/customer-detail/customer-detail.component';
import { MaterialModule } from '../../material.module';
import { CustomerService } from './services/CustomerService';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({  
  imports: [
    CommonModule,
    CustomerRoutingModule,    
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ], 
  declarations: [CustomerListComponent, CustomerDetailComponent],
  providers: [CustomerService, UniqueCustomerName]
})
export class CustomerModule { }