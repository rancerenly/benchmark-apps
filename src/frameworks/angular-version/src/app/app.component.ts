import {AfterViewInit, Component, inject, OnDestroy} from '@angular/core';
import { TableService } from './services/table.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  protected tableService = inject(TableService);

  private observer: MutationObserver | null = null;
  private mutationCount = 0;

  ngAfterViewInit() {
    const table = document.querySelector('table.test-data');
    if (!table) return;

    this.observer = new MutationObserver((mutationsList) => {
      this.mutationCount = mutationsList.length;
      (window as any).__domMutationCount = this.mutationCount;
      console.log(mutationsList.length);
    });

    this.observer.observe(table, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });

    (window as any).__domMutationCount = 0;

    console.log('domMutations', (window as any).__domMutationCount);
  }

  ngOnDestroy() {
    if (this.observer) this.observer.disconnect();
    (window as any).__domMutationCount = this.mutationCount;
  }
}
