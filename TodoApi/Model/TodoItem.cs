using System;
namespace TodoApi.Model
{
	public class TodoItem
	{
		public int Id { get; set; }
		public string? Title { get; set; }//use to store id
		public bool IsComplete { get; set; }
	}
}

