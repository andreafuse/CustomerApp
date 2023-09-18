import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToolbarService } from './toolbar.service';

@Component({
    selector: 'ml-toolbar',
    template: `
<mat-toolbar 
    color="primary"
    style="display:flex;  
    align-items:center;
    column-gap: .5rem;
    flex-shrink: 0; 
    padding: 1rem;
    flex-grow: 0;">
    <button [attr.aria-label]="'menu'" *ngIf="!(toolbarService.showBackButton$ | async)" mat-icon-button >
        <mat-icon>menu</mat-icon>
    </button>
    <button [attr.aria-label]="'back'" *ngIf="toolbarService.showBackButton$ | async" mat-icon-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
    </button>
    <span routerLink="/" class="flex-grow1">
        Customer App
    </span>
 </mat-toolbar>
`
})
export class ToolbarComponent implements OnInit {


    constructor(
        private location: Location,
        public toolbarService: ToolbarService) {
    }

    ngOnInit(): void {
    } 

    

    goBack(): void {        
        this.toolbarService.setConfig({showBackButton: false})
        this.location.back();
    }

}
