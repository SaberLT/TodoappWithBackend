using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AppTodo.Database;
using AppTodo.Entities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace AppTodo.Controllers
{
    [ApiController]
    [Route("api/todo")]
    public class TodoController : ControllerBase
    {
        EFCoreTodoappContext _dbContext;
        public TodoController(EFCoreTodoappContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("getModel")]
        public async Task<string> GetModel()
        {
            var mainModel = new MainViewModel()
            {
                FocusedId = _dbContext.FocusedIds.Select(x => new FocusedIdModel()
                {
                    AlreadyDone = x.AlreadyDone,
                    Todos = x.Todo
                }).FirstOrDefault(),

                Todos = await _dbContext.Todos.Where(x => !x.IsDone)
                        .Select(y => new TodoModel()
                        {
                            IsModifying = false,
                            Text = y.Text
                        })
                        .ToArrayAsync(),
                AlreadyDone = await _dbContext.Todos.Where(x => x.IsDone)
                        .Select(y => new TodoModel()
                        {
                            IsModifying = false,
                            Text = y.Text
                        })
                        .ToArrayAsync()
            };

            return JsonConvert.SerializeObject(mainModel, new JsonSerializerSettings()
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            });
        }

        [HttpPost]
        [Route("updateModel")]
        public async Task<string> UpdateModel([FromBody]MainModel model)
        {
            RewriteTodos(model);
            RewriteFocusedId(model.FocusedId);

            await _dbContext.SaveChangesAsync();

            return model.ToString();
        }

        private void RewriteFocusedId(FocusedIdModel focusedId)
        {
            var dataToRemove = _dbContext.FocusedIds.Where(x => x.Id > 0);
            _dbContext.RemoveRange(dataToRemove);

            _dbContext.FocusedIds.Add(new FocusedId()
            {
                Todo = focusedId.Todos,
                AlreadyDone = focusedId.AlreadyDone
            });
        }

        private void RewriteTodos(MainModel model)
        {
            var dataToRemove = _dbContext.Todos.Where(x => x.Id > 0);
            _dbContext.Todos.RemoveRange(dataToRemove);

            var dataToUpdate = model.Todos.Select(x => new Todo()
            {
                Id = x.Id,
                Text = x.Text,
                IsDone = false
            });
            _dbContext.Todos.UpdateRange(dataToUpdate);
            dataToUpdate = model.AlreadyDone.Select(x => new Todo()
            {
                Id = x.Id,
                Text = x.Text,
                IsDone = true
            });
            _dbContext.Todos.UpdateRange(dataToUpdate);
        }
    }
}