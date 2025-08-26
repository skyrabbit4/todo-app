import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TodoService, TodoItem } from './todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule
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

      <!-- Move the search container below the form -->
      <div class="search-container">
        <mat-form-field appearance="fill">
          <mat-label>Search todos...</mat-label>
          <input matInput [(ngModel)]="searchTerm" placeholder="Search todos..." />
        </mat-form-field>
      </div>

      <mat-divider></mat-divider>

      <!-- Display Filtered List of Todos -->
      <div class="todos-container">
        <div *ngFor="let todo of filteredTodos" class="todo-wrapper">
          <mat-card class="todo-card" [class.expanded]="isExpanded(todo.id)">
            <mat-card-content>
              <div class="todo-item">
                <div class="todo-content">
                  <div class="todo-header">
                    <span class="todo-title" [class.expanded-title]="isExpanded(todo.id)">
                      {{ todo.title }}
                    </span>
                    <span class="todo-status" [class.completed]="todo.isComplete">
                      {{ todo.isComplete ? 'Done' : 'Pending' }}
                    </span>
                  </div>
                  
                  <!-- Expanded content area -->
                  <div *ngIf="isExpanded(todo.id)" class="expanded-content">
                    <div class="todo-details">
                      <h3>Todo Details</h3>
                      <p class="expanded-title">{{ todo.title }}</p>
                      <p class="status-info">
                        <strong>Status:</strong> 
                        <span [class.completed]="todo.isComplete">
                          {{ todo.isComplete ? 'Completed' : 'Pending' }}
                        </span>
                      </p>
                      <p class="id-info"><strong>ID:</strong> {{ todo.id }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="action-buttons">
                  <button mat-icon-button 
                          (click)="toggleExpand(todo.id)"
                          [attr.aria-label]="isExpanded(todo.id) ? 'Collapse todo' : 'Expand todo'"
                          class="expand-button">
                    <mat-icon>{{ isExpanded(todo.id) ? 'expand_less' : 'expand_more' }}</mat-icon>
                  </button>
                  <button mat-button (click)="startEdit(todo)">Edit</button>
                  <button mat-button color="warn" (click)="deleteTodo(todo)">Delete</button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #1976d2;
      font-size: 2.5rem;
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
      align-items: center;
    }
    .search-container {
      margin-bottom: 20px;
    }
    .todos-container {
      margin-top: 20px;
    }
    .todo-wrapper {
      margin-bottom: 16px;
    }
    .todo-card {
      transition: all 0.3s ease;
      border-left: 4px solid #e0e0e0;
    }
    .todo-card.expanded {
      border-left-color: #1976d2;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .todo-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
    }
    .todo-content {
      flex: 1;
      margin-right: 16px;
    }
    .todo-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .todo-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      flex: 1;
      margin-right: 16px;
    }
    .todo-title.expanded-title {
      font-size: 18px;
      font-weight: 600;
      color: #1976d2;
    }
    .todo-status {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      background-color: #ff9800;
      color: white;
    }
    .todo-status.completed {
      background-color: #4caf50;
    }
    .expanded-content {
      margin-top: 16px;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      border-left: 3px solid #1976d2;
    }
    .todo-details h3 {
      margin: 0 0 12px 0;
      color: #1976d2;
      font-size: 18px;
    }
    .expanded-title {
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 12px;
      word-wrap: break-word;
      color: #333;
    }
    .status-info, .id-info {
      margin: 8px 0;
      font-size: 14px;
    }
    .status-info .completed {
      color: #4caf50;
      font-weight: 600;
    }
    .action-buttons {
      flex-shrink: 0;
    }
    .expand-button {
      color: #1976d2;
    }
    .expand-button:hover {
      background-color: rgba(25, 118, 210, 0.1);
    }
  `]
})
export class AppComponent implements OnInit {
  todos: TodoItem[] = [];
  todoForm: FormGroup;
  editing: boolean = false;
  currentTodo: TodoItem | null = null;
  searchTerm: string = '';
  expandedTodos: Set<number> = new Set();

  constructor(private fb: FormBuilder, private todoService: TodoService) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      isComplete: [false]
    });
  }

  ngOnInit(): void {
    this.loadTodos();
    // Add some sample todos for testing when backend is not available
    if (this.todos.length === 0) {
      this.todos = [
        { id: 1, title: 'Complete the frontend development for the todo application with expanded view functionality', isComplete: false },
        { id: 2, title: 'Write unit tests', isComplete: true },
        { id: 3, title: 'Add documentation for the new expand feature that allows users to view todo items in a larger, more readable format', isComplete: false },
        { id: 4, title: 'Deploy app', isComplete: false }
      ];
    }
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (data) => (this.todos = data),
      error: (err) => {
        console.error('Error fetching todos:', err);
        // Fallback to sample data when backend is not available
        this.todos = [
          { id: 1, title: 'Complete the frontend development for the todo application with expanded view functionality', isComplete: false },
          { id: 2, title: 'Write unit tests', isComplete: true },
          { id: 3, title: 'Add documentation for the new expand feature that allows users to view todo items in a larger, more readable format', isComplete: false },
          { id: 4, title: 'Deploy app', isComplete: false }
        ];
      }
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
          this.loadTodos();
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

  // Filtered list of todos based on the search term
  get filteredTodos(): TodoItem[] {
    if (!this.searchTerm.trim()) {
      return this.todos;
    }
    return this.todos.filter(todo =>
      todo.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Toggle expand/collapse for a todo item
  toggleExpand(todoId: number): void {
    if (this.expandedTodos.has(todoId)) {
      this.expandedTodos.delete(todoId);
    } else {
      this.expandedTodos.add(todoId);
    }
  }

  // Check if a todo is expanded
  isExpanded(todoId: number): boolean {
    return this.expandedTodos.has(todoId);
  }
}
