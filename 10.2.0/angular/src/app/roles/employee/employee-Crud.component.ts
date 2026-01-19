import { ChangeDetectorRef, Component, Injector, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Paginator } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { PagedListingComponentBase } from '../../../shared/paged-listing-component-base';
import { appModuleAnimation } from '../../../shared/animations/routerTransition';
import { PrimengTableHelper } from '../../../shared/helpers/PrimengTableHelper';
import { EmployeeDto, EmployeeServiceServiceProxy } from '../../../shared/service-proxies/service-proxies';

// import { PagedListingComponentBase } from '../../shared/paged-listing-component-base';
// import { EmployeeDto, EmployeeServiceServiceProxy } from '../../shared/service-proxies/service-proxies';
// import { PrimengTableHelper } from '../../shared/helpers/PrimengTableHelper';
// import { appModuleAnimation } from '../../shared/animations/routerTransition';

@Component({
    templateUrl: './employee-crud.component.html',
    animations: [appModuleAnimation()],
    standalone: false,
})
export class EmployeeCrudComponent extends PagedListingComponentBase<EmployeeDto> {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    employees: EmployeeDto[] = [];
    keyword = '';
    isActive: boolean | null;
    advancedFiltersVisible = false;

    primengTableHelper: PrimengTableHelper = new PrimengTableHelper();
    cd: ChangeDetectorRef;

    constructor(
        injector: Injector,
        private _EmployeeService: EmployeeServiceServiceProxy,
        private _modalService: BsModalService,
        private _activatedRoute: ActivatedRoute,
        cd: ChangeDetectorRef
    ) {
        super(injector, cd);
        this.cd = cd;
        this.keyword = this._activatedRoute.snapshot.queryParams['filterText'] || '';
    }

    clearFilters(): void {
        this.keyword = '';
        this.isActive = undefined;
    }

    list(event?: LazyLoadEvent): void {
        this.primengTableHelper.showLoadingIndicator();

        this._EmployeeService
            .getAllEmployees()
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result: EmployeeDto[]) => {
                this.primengTableHelper.records = result;
                this.primengTableHelper.totalRecordsCount = result.length;
                this.cd.detectChanges();
            });
    }

    delete(employee: EmployeeDto): void {
        abp.message.confirm('EmployeeDeleteWarningMessage', employee.name), undefined, (result: boolean) => {
            if (result) {
                this._EmployeeService.deleteEmployee(employee.id).subscribe(() => {
                    abp.notify.success('SuccessfullyDeleted');
                    this.refresh();
                });
            }
        };
    }

    // l(key: string, ...args: any[]): string {
    //     return abp.localization.localizeFormat(key, 'UserCrud', ...args);
    // }

    refresh(): void {
        this.list();
    }

    createEmployee(){
        
    }
}
