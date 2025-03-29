import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TodoItem {
  id: number;
  title: string;
  isComplete: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:5048/swagger/index.html'; // Adjust to your actual API port

  constructor(private http: HttpClient) {}

  getTodos(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(`${this.apiUrl}/todo`);
  }

  createTodo(todo: Omit<TodoItem, 'id'>): Observable<TodoItem> {
    return this.http.post<TodoItem>(`${this.apiUrl}/todo`, todo);
  }

  updateTodo(todo: TodoItem): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/todo/${todo.id}`, todo);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/todo/${id}`);
  }
}
