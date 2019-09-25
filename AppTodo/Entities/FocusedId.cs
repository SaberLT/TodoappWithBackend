using AppTodo.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppTodo.Entities
{
    public class FocusedId : IEntity
    {
        public long Id { get; set; }
        public int CurrentFocusedId { get; set; }
    }
}
