// filepath: /Users/shubhamkaushik/Desktop/TodoApp/frontend/src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { TodoService, TodoItem } from './todo.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>My Todo List</h1>
    <ul>
      <li *ngFor="let todo of todos">
        {{ todo.title }} - {{ todo.isComplete ? 'Done' : 'Pending' }}
      </li>
    </ul>
  `,
  imports: [CommonModule, NgFor],
  standalone: true,
})
export class AppComponent implements OnInit {
  todos: TodoItem[] = [];

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe({
      next: (data) => this.todos = data,
      error: (err) => console.error('Error fetching todos:', err)
    });
  }
}