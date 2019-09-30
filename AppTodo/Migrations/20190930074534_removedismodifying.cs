using Microsoft.EntityFrameworkCore.Migrations;

namespace AppTodo.Migrations
{
    public partial class removedismodifying : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsModifying",
                table: "Todos");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsModifying",
                table: "Todos",
                nullable: false,
                defaultValue: false);
        }
    }
}
