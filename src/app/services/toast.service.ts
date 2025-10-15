import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
    const newMessage: ToastMessage = { message, type, duration };
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, newMessage]);

    setTimeout(() => {
      this.removeMessage(newMessage);
    }, duration);
  }

  private removeMessage(messageToRemove: ToastMessage) {
    const currentMessages = this.messagesSubject.value;
    const filtered = currentMessages.filter(msg => msg !== messageToRemove);
    this.messagesSubject.next(filtered);
  }

  clearAll() {
    this.messagesSubject.next([]);
  }
}
