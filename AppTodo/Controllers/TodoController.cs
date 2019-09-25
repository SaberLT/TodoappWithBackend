using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AppTodo.Database;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;


namespace AppTodo.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    [EnableCors("hah")]
    public class TodoController : ControllerBase
    {
        EFCoreTodoappContext _dbContext;
        public TodoController(EFCoreTodoappContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("updateModel")]
        public async Task<string> UpdateModel(string model)
        {
            if (model != "")
                return model;
            return "123";
        }
    }
}