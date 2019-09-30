using AppTodo.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppTodo
{
    public class MainModel
    {
        public Todo[] Todos { get; set; }
        public Todo[] AlreadyDone { get; set; }
        public FocusedIdModel FocusedId { get; set; }
    }

    public class MainViewModel
    {
        public TodoModel[] Todos { get; set; }
        public TodoModel[] AlreadyDone { get; set; }
        public FocusedIdModel FocusedId { get; set; }

    }

    public class FocusedIdModel
    {
        public int Todos { get; set; }
        public int AlreadyDone { get; set; }
    }

    public class TodoModel
    {
        public string Text { get; set; }
        public bool IsModifying { get; set; }
    }
}
