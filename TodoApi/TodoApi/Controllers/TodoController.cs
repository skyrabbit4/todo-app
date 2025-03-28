using System;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Model;

namespace TodoApi.Controllers
{
	[ApiController]
	[Route("api/[controller")]
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

		
	}
}

