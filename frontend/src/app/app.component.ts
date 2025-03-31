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
    
    <!-- Form for Adding/Editing a Todo -->
    <form [formGroup]="todoForm" (ngSubmit)="editing ? updateTodo() : onSubmit()">
      <input formControlName="title" placeholder="Enter todo title" />
      <label>
        <input type="checkbox" formControlName="isComplete" /> Completed
      </label>
      <button type="submit">{{ editing ? 'Update' : 'Add' }} Todo</button>
      <button *ngIf="editing" type="button" (click)="cancelEdit()">Cancel</button>
    </form>

    <hr />

    <!-- Display List of Todos -->
    <ul>
      <li *ngFor="let todo of todos">
        {{ todo.title }} - {{ todo.isComplete ? 'Done' : 'Pending' }}
        <button (click)="startEdit(todo)">Edit</button>
        <button (click)="deleteTodo(todo)">Delete</button>
      </li>
    </ul>
  `
})
export class AppComponent implements OnInit {
  todos: TodoItem[] = [];
  todoForm: FormGroup;
  editing: boolean = false;
  currentTodo: TodoItem | null = null;

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
      error: (err) => console.error('Error fetching todos:', err)
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      this.todoService.createTodo(this.todoForm.value).subscribe({
        next: (newTodo) => {
          this.todos.push(newTodo);
          this.todoForm.reset({ title: '', isComplete: false });
        },
        error: (err) => console.error('Error creating todo:', err)
      });
    }
  }

  startEdit(todo: TodoItem): void {
    this.editing = true;
    this.currentTodo = todo;
    this.todoForm.patchValue(todo);
  }

  updateTodo(): void {
    if (this.todoForm.valid && this.currentTodo) {
      const updatedTodo: TodoItem = {
        ...this.currentTodo,
        ...this.todoForm.value
      };
      this.todoService.updateTodo(updatedTodo).subscribe({
        next: () => {
          this.loadTodos(); // Refresh list after update
          this.cancelEdit();
        },
        error: (err) => console.error('Error updating todo:', err)
      });
    }
  }

  cancelEdit(): void {
    this.editing = false;
    this.currentTodo = null;
    this.todoForm.reset({ title: '', isComplete: false });
  }

  deleteTodo(todo: TodoItem): void {
    if (confirm(`Delete "${todo.title}"?`)) {
      this.todoService.deleteTodo(todo.id).subscribe({
        next: () => {
          this.todos = this.todos.filter(t => t.id !== todo.id);
        },
        error: (err) => console.error('Error deleting todo:', err)
      });
    }
  }
}
