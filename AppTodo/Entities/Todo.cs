﻿using AppTodo.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppTodo.Entities
{
    public class Todo : IEntity
    {
        public long Id { get; set; }
        public string Text { get; set; }
        public bool IsDone { get; set; }
    }
}
