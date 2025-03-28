using System;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Model;

namespace TodoApi.Controllers
{
	[ApiController]
	[Route("api/[controller")]
	public class TodoController:ControllerBase
	{
		private static List<TodoItem> Todos = new List<TodoItem>();
		[HttpGet]
		public ActionResult<IEnumerable<TodoItem>>GetTodos()
		{
			return Ok(Todos);
		}

		
	}
}

