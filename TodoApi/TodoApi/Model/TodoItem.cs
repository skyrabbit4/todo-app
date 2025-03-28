using System;
namespace TodoApi.Model
{
	public class TodoItem
	{
		public int Id { get; set; }
		public string? Title { get; set; }//kkl
		public bool IsComplete { get; set; }
	}
}

