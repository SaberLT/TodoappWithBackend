using Microsoft.EntityFrameworkCore.Migrations;

namespace AppTodo.Migrations
{
    public partial class TodoPlusAlreadyDone : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDone",
                table: "Todo",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDone",
                table: "Todo");
        }
    }
}
