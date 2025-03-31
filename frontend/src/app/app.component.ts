import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService, TodoItem } from './todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>My Todo List</h1>

    <!-- Form for Adding a New Todo -->
    <form [formGroup]="todoForm" (ngSubmit)="onSubmit()">
      <input formControlName="title" placeholder="Enter todo title" />
      <label>
        <input type="checkbox" formControlName="isComplete" /> Completed
      </label>
      <button type="submit">Add Todo</button>
    </form>

    <hr />

    <!-- Display List of Todos -->
    <ul>
      <li *ngFor="let todo of todos">
        {{ todo.title }} - {{ todo.isComplete ? 'Done' : 'Pending' }}
        <button (click)="deleteTodo(todo)">Delete</button>
      </li>
    </ul>
  `
})
export class AppComponent implements OnInit {
  todos: TodoItem[] = [];

  // Reactive form for creating a new Todo
  todoForm: FormGroup;

  constructor(private fb: FormBuilder, private todoService: TodoService) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      isComplete: [false]
    });
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (data) => (this.todos = data),
      error: (err) => console.error('Error fetching todos:', err),
    });
  }

  // Called when the form is submitted
  onSubmit(): void {
    if (this.todoForm.valid) {
      this.todoService.createTodo(this.todoForm.value).subscribe({
        next: (newTodo) => {
          // Add the newly created todo to our list
          this.todos.push(newTodo);
          // Reset the form
          this.todoForm.reset({ title: '', isComplete: false });
        },
        error: (err) => console.error('Error creating todo:', err)
      });
    }
  }

  deleteTodo(todo: TodoItem): void {
    if (confirm(`Delete "${todo.title}"?`)) {
      this.todoService.deleteTodo(todo.id).subscribe({
        next: () => {
          // Remove from our local array
          this.todos = this.todos.filter(t => t.id !== todo.id);
        },
        error: (err) => console.error('Error deleting todo:', err)
      });
    }
  }
}
