import { Component, OnInit } from '@angular/core';
import { TodoService, TodoItem } from './todo.service';

@Component({
  selector: 'app-root',
  // Inline template for simplicity. You can also use templateUrl if you prefer a separate file.
  template: `
    <h1>My Todo List</h1>
    <ul>
      <li *ngFor="let todo of todos">
        {{ todo.title }} - {{ todo.isComplete ? 'Done' : 'Pending' }}
      </li>
    </ul>
  `,
  // For standalone components (Angular 14+ standalone mode)
  standalone: true,
})
export class AppComponent implements OnInit {
  todos: TodoItem[] = [];

  // Inject the TodoService
  constructor(private todoService: TodoService) {}

  // When the component initializes, fetch the todo items
  ngOnInit(): void {
    this.todoService.getTodos().subscribe({
      next: (data) => (this.todos = data),
      error: (err) => console.error('Error fetching todos:', err)
    });
  }
}
