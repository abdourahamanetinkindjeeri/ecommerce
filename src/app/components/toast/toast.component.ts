import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 space-y-2 z-50">
      <div
        *ngFor="let message of messages; track message.message"
        class="bg-white shadow-lg rounded-lg p-4 border-l-4 max-w-sm"
        [ngClass]="{
          'border-green-500': message.type === 'success',
          'border-red-500': message.type === 'error',
          'border-blue-500': message.type === 'info'
        }"
      >
        <div class="flex justify-between items-start">
          <span class="text-sm font-medium text-gray-800">{{ message.message }}</span>
          <button (click)="removeMessage(message)" class="ml-2 text-gray-400 hover:text-gray-600">
            &times;
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  messages: ToastMessage[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription.add(
      this.toastService.messages$.subscribe((messages) => {
        this.messages = messages;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeMessage(message: ToastMessage) {
    this.toastService.clearAll();
  }
}
