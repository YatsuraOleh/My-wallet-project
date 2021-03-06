import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExpenseService } from '../../shared/services';
import { Expense } from '../../shared/interfaces';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.css']
})
export class ExpensesListComponent implements OnInit, OnDestroy {

  expenses: Array<Expense>;

  private ngUnsubscribe$ = new Subject();

  constructor(
    private expenseService: ExpenseService
  ) { }

  ngOnInit() {
    this.getExpense();
    this.expenseService.subject
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        () => {
          this.getExpense();
        }
      );
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  onSubmit(event: any): void {
    // console.log(event);
    this.expenseService.editExpense(event);
  }

  private getExpense() {
    this.expenseService.getExpense()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        data => {
          this.expenses = data;
        }
      );
  }

  public deleteExpense(id): void {
    this.expenseService.delExpense(id);
  }
}
