import { ChangeDetectorRef, Component, Injector, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { StudentServiceProxy, StudentDto, StudentDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { CreateStudentDialogComponent } from './create-student/create-student-dialog.component';
import { EditStudentDialogComponent } from './edit-student/edit-student-dialog.component';
import { ResetPasswordStudentDialogComponent } from './reset-password-student/reset-password-student.component';
import { Table, TableModule } from 'primeng/table';
import { LazyLoadEvent, PrimeTemplate } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { LocalizePipe } from '@shared/pipes/localize.pipe';

@Component({
    templateUrl: './students.component.html',
    animations: [appModuleAnimation()],
    standalone: true,
    imports: [FormsModule, TableModule, PrimeTemplate, NgIf, PaginatorModule, LocalizePipe],
})
export class StudentsComponent extends PagedListingComponentBase<StudentDto> {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    students: StudentDto[] = [];
    keyword = '';
    isActive: boolean | null;
    advancedFiltersVisible = false;

    primengTableHelper: PrimengTableHelper = new PrimengTableHelper(); 
    cd: ChangeDetectorRef;

    constructor(
        injector: Injector,
        private _studentService: StudentServiceProxy,
        private _modalService: BsModalService,
        private _activatedRoute: ActivatedRoute,
        cd: ChangeDetectorRef
    ) {
        super(injector, cd);
        this.cd = cd; 
        this.keyword = this._activatedRoute.snapshot.queryParams['filterText'] || '';
    }

    createStudent(): void {
        this.showCreateOrEditStudentDialog();
    }

    editStudent(student: StudentDto): void {
        this.showCreateOrEditStudentDialog(student.id);
    }

    resetPassword(student: StudentDto): void {
        this.showResetPasswordStudentDialog(student.id);
    }

    clearFilters(): void {
        this.keyword = '';
        this.isActive = undefined;
    }

    list(event?: LazyLoadEvent): void {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            if (this.primengTableHelper.records?.length) {
                return;
            }
        }

        this.primengTableHelper.showLoadingIndicator();

        this._studentService
            .getAll(
                this.keyword,
                this.isActive,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result: StudentDtoPagedResultDto) => {
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.hideLoadingIndicator();
                this.cd.detectChanges();
            });
    }

    delete(student: StudentDto): void {
        abp.message.confirm(this.l('StudentDeleteWarningMessage', student.fullName), undefined, (result: boolean) => {
            if (result) {
                this._studentService.delete(student.id).subscribe(() => {
                    abp.notify.success(this.l('SuccessfullyDeleted'));
                    this.refresh(); // 
                });
            }
        });
    }
    l(arg0: string, fullName: any): string {
        throw new Error('Method not implemented.');
    }
    refresh() {
        throw new Error('Method not implemented.');
    }

    private showResetPasswordStudentDialog(id?: number): void {
        this._modalService.show(ResetPasswordStudentDialogComponent, {
            class: 'modal-lg',
            initialState: { id },
        });
    }

    private showCreateOrEditStudentDialog(id?: number): void {
        const dialog: BsModalRef = !id
            ? this._modalService.show(CreateStudentDialogComponent, { class: 'modal-lg' })
            : this._modalService.show(EditStudentDialogComponent, { class: 'modal-lg', initialState: { id } });

        dialog.content.onSave.subscribe(() => this.refresh());
    }
}
function appModuleAnimation(): any {
    throw new Error('Function not implemented.');
}

