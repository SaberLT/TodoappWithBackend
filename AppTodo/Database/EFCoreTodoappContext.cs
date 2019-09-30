using AppTodo.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppTodo.Database
{
    public class EFCoreTodoappContext : DbContext
    {
        public DbSet<Todo> Todos { get; set; }
        public DbSet<FocusedId> FocusedIds { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            builder.UseSqlServer(@"Server=DESKTOP-T3S8RQ5\SQLEXPRESS;Database=AppTodo;Trusted_Connection=True");
        }
    }
}
