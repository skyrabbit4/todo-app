import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService, TodoItem } from '../todo.service'; // Adjust path if needed

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todos: TodoItem[] = [];
  todoForm: FormGroup;
  editing: boolean = false;
  currentTodo: TodoItem | null = null;

  constructor(private todoService: TodoService, private fb: FormBuilder) {
    // Initialize the form with default values and validators
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      isComplete: [false]
    });
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  // Fetch all Todo items from the API
  loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (data) => (this.todos = data),
      error: (err) => console.error('Error fetching todos:', err)
    });
  }

  // Add a new Todo item
  addTodo(): void {
    if (this.todoForm.valid) {
      this.todoService.createTodo(this.todoForm.value).subscribe({
        next: (newTodo) => {
          this.todos.push(newTodo);
          this.todoForm.reset({ title: '', isComplete: false });
        },
        error: (err) => console.error('Error adding todo:', err)
      });
    }
  }

  // Populate the form with the selected Todo for editing
  editTodo(todo: TodoItem): void {
    this.editing = true;
    this.currentTodo = todo;
    this.todoForm.patchValue(todo);
  }

  // Update the selected Todo item
  updateTodo(): void {
    if (this.todoForm.valid && this.currentTodo) {
      const updatedTodo: TodoItem = {
        ...this.currentTodo,
        ...this.todoForm.value
      };
      this.todoService.updateTodo(updatedTodo).subscribe({
        next: () => {
          this.loadTodos(); // Reload todos after update
          this.cancelEdit();
        },
        error: (err) => console.error('Error updating todo:', err)
      });
    }
  }

  // Delete a Todo item
  deleteTodo(todo: TodoItem): void {
    if (confirm('Are you sure you want to delete this todo?')) {
      this.todoService.deleteTodo(todo.id).subscribe({
        next: () => {
          this.todos = this.todos.filter(t => t.id !== todo.id);
        },
        error: (err) => console.error('Error deleting todo:', err)
      });
    }
  }

  // Cancel editing mode and reset the form
  cancelEdit(): void {
    this.editing = false;
    this.currentTodo = null;
    this.todoForm.reset({ title: '', isComplete: false });
  }
}
