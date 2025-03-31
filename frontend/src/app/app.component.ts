import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { TodoService, TodoItem } from './todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule
  ],
  template: `
    <div class="container">
      <h1>My Todo List</h1>

      <!-- Form for Adding/Editing a Todo -->
      <form [formGroup]="todoForm" (ngSubmit)="editing ? updateTodo() : onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Todo Title</mat-label>
          <input matInput formControlName="title" placeholder="Enter todo title" />
        </mat-form-field>

        <mat-checkbox formControlName="isComplete">Completed</mat-checkbox>

        <div class="buttons">
          <button mat-raised-button color="primary" type="submit">
            {{ editing ? 'Update' : 'Add' }} Todo
          </button>
          <button *ngIf="editing" mat-button type="button" (click)="cancelEdit()">Cancel</button>
        </div>
      </form>

      <mat-divider></mat-divider>

      <!-- Display List of Todos -->
      <mat-list>
        <mat-list-item *ngFor="let todo of todos">
          <div class="todo-item">
            <span>{{ todo.title }} - {{ todo.isComplete ? 'Done' : 'Pending' }}</span>
            <div class="action-buttons">
              <button mat-button (click)="startEdit(todo)">Edit</button>
              <button mat-button color="warn" (click)="deleteTodo(todo)">Delete</button>
            </div>
          </div>
        </mat-list-item>
      </mat-list>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #1976d2;
      text-align: center;
      margin-bottom: 20px;
      font-weight: 600;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 20px;
    }
    .buttons, .action-buttons {
      display: flex;
      gap: 10px;
    }
    .todo-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  `]
})
export class AppComponent implements OnInit {
  todos: TodoItem[] = [];
  todoForm: FormGroup;
  editing: boolean = false;
  currentTodo: TodoItem | null = null;

  constructor(private fb: FormBuilder, private todoService: TodoService) {
    // Initialize the reactive form with validation
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      isComplete: [false]
    });
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  // Load all todos from the backend
  loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (data) => (this.todos = data),
      error: (err) => console.error('Error fetching todos:', err)
    });
  }

  // Add a new todo using the form values
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

  // Start editing a selected todo
  startEdit(todo: TodoItem): void {
    this.editing = true;
    this.currentTodo = todo;
    this.todoForm.patchValue(todo);
  }

  // Update the todo item with new form data
  updateTodo(): void {
    if (this.todoForm.valid && this.currentTodo) {
      const updatedTodo: TodoItem = {
        ...this.currentTodo,
        ...this.todoForm.value
      };
      this.todoService.updateTodo(updatedTodo).subscribe({
        next: () => {
          this.loadTodos();
          this.cancelEdit();
        },
        error: (err) => console.error('Error updating todo:', err)
      });
    }
  }

  // Cancel editing mode and reset the form
  cancelEdit(): void {
    this.editing = false;
    this.currentTodo = null;
    this.todoForm.reset({ title: '', isComplete: false });
  }

  // Delete a todo item
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
