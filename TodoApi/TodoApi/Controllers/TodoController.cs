using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Model;

namespace TodoApi.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class TodoController : ControllerBase
	{
		private readonly TodoContext _context;

		//constructor injection
		public TodoController(TodoContext context)
		{
			_context = context;
		}

		//Get: API/Todo

		[HttpGet]
		public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodos()
		{
			return await _context.TodoItems.ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<TodoItem>>GetTodo(int id)
		{
			var todo = await _context.TodoItems.FindAsync(id);
			if(todo==null)
			{
				return NotFound();
			}
			return todo;
		}
        // POST: api/todo
        [HttpPost]
        public async Task<ActionResult<TodoItem>> CreateTodo([FromBody] TodoItem newTodo)
        {
            // Add the new Todo item to the context
            _context.TodoItems.Add(newTodo);
            // Save changes to the database asynchronously
            await _context.SaveChangesAsync();

            // Return a 201 Created response with a location header pointing to the newly created resource
            return CreatedAtAction(nameof(GetTodo), new { id = newTodo.Id }, newTodo);
        }

        // PUT: api/todo/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodo(int id, [FromBody] TodoItem updatedTodo)
        {
            if (id != updatedTodo.Id)
            {
                return BadRequest("ID mismatch");
            }

            var existingTodo = await _context.TodoItems.FindAsync(id);
            if (existingTodo == null)
            {
                return NotFound();
            }

            // Update properties
            existingTodo.Title = updatedTodo.Title;
            existingTodo.IsComplete = updatedTodo.IsComplete;

            // Mark the entity as modified
            _context.Entry(existingTodo).State = EntityState.Modified;

            // Save changes
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/todo/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            var todo = await _context.TodoItems.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }

            // Remove the Todo item from the context
            _context.TodoItems.Remove(todo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
