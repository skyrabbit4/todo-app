using System;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Model;

namespace TodoApi.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class TodoController : ControllerBase
	{
		private static List<TodoItem> Todos = new List<TodoItem>();
		[HttpGet]
		public ActionResult<IEnumerable<TodoItem>> GetTodos()
		{
			return Ok(Todos);
		}

		[HttpGet("{id}")]
		public ActionResult<TodoItem>GetTodo(int id)
		{
			var todo = Todos.FirstOrDefault(t => t.Id == id);
			if(todo==null)
			{
				return NotFound();
			}
			return Ok(todo);
		}

		[HttpPost]
		public ActionResult<TodoItem> CreateTodo([FromBody] TodoItem newTodo)
		{
			newTodo.Id = Todos.Count > 0 ? Todos.Max(t => t.Id) + 1 : 1;
			Todos.Add(newTodo);
			return CreatedAtAction(nameof(GetTodo), new { id = newTodo.Id }, newTodo);


		}
        [HttpPut("{id}")]
        public IActionResult UpdateTodo(int id, [FromBody] TodoItem updatedTodo)
        {
            var existing = Todos.FirstOrDefault(t => t.Id == id);
            if (existing == null)
                return NotFound(); 

            // Update the properties
            existing.Title = updatedTodo.Title;
            existing.IsComplete = updatedTodo.IsComplete;

            return NoContent(); 
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTodo(int id)
        {
            var todo = Todos.FirstOrDefault(t => t.Id == id);
            if (todo == null)
                return NotFound(); 

            Todos.Remove(todo);
            return NoContent(); 
        }

    }
}

