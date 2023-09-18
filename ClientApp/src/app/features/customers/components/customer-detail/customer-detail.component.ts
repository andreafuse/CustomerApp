import { Component, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CustomerService, IInvoiceList } from '../../services/CustomerService';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, filter, map, of, switchMap } from 'rxjs';
import { ToolbarService } from '../../../../shared/toolbar/toolbar.service';

export type subscriptionStates = 'new' | 'active' | 'suspended';

@Component({
  selector: 'ml-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent {
  isNew = false;
  companyNameCtrl = new FormControl<string>('', {
    updateOn: 'blur',
    validators: [Validators.required, Validators.maxLength(50)],
    asyncValidators: []
  });
  addressCtrl = new FormControl<string>('', [Validators.required, Validators.maxLength(100)])
  stateCtrl = new FormControl<string>('', [Validators.maxLength(50)]);
  countryCtrl = new FormControl<string>('', [Validators.required, Validators.maxLength(50)]);
  subscriptionStateCtrl = new FormControl<subscriptionStates>('new', [Validators.required]);

  Validators = Validators;
  subsriptionStateOptions: { value: subscriptionStates, label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'new', label: 'New' },
    { value: 'suspended', label: 'Suspended' },
  ];

  formGroup: FormGroup = this.fb.group({
    companyName: this.companyNameCtrl,
    address: this.addressCtrl,
    state: this.stateCtrl,
    country: this.countryCtrl,
    subscriptionState: this.subscriptionStateCtrl,

  });
  id: string | null = null;



  constructor(
    route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly customerService: CustomerService,
    private readonly uniqueCustomerNameValidator: UniqueCustomerName,
    private readonly toolbarService: ToolbarService

  ) {
    route.params
      .pipe(
        map(values => {
          const id = values['id'];
          if (id) {
            this.id = id;
            this.isNew = false;
            return id as string;
          } else {
            this.isNew = true;
            this.companyNameCtrl.addAsyncValidators(this.uniqueCustomerNameValidator.validate.bind(this.uniqueCustomerNameValidator))
            return null
          }

        }),
        filter((v): v is string => !!v),
        switchMap(v => this.customerService.GetDetail(v))
      )
      .subscribe(res => {
        console.log(res)
        this.formGroup.patchValue(res, { emitEvent: false });
        this.invoices = res.invoices;
      })

  }



  ngOnInit(): void {

    this.toolbarService.setConfig({ showBackButton: true });
    // if is a new customer registration,
    // I'll check the company doesn't exits already

  }

  getErrorMessages(control: FormControl) {
    if (!control.errors) return null;
    return Object.entries(control.errors).map(([key, entries]) => key);
  }

  Save() {


    if (this.formGroup.invalid) return;
    const result$ = !this.isNew && this.id
      ? this.customerService.Update(this.id, this.formGroup.value)
      : this.customerService.Insert(this.formGroup.value)


    result$.subscribe(() => this.router.navigate(['']));

  }

  displayedColumns: (keyof IInvoiceList)[] = ['number', 'date', 'total'];
  invoices: IInvoiceList[] = [];

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.invoices.map(t => t.total).reduce((acc, value) => (acc * 1000 + value * 1000) / 1000, 0);
  }

}


@Injectable()
export class UniqueCustomerName implements AsyncValidator {
  constructor(private customerService: CustomerService) { }

  validate(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return this.customerService.CheckCustomerByName(control.value)
      .pipe(
        map(isTaken => (isTaken ? { companyAlreadyExists: true } : null)),
        catchError(() => of(null))
      );
  }
}