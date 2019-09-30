using Microsoft.EntityFrameworkCore.Migrations;

namespace AppTodo.Migrations
{
    public partial class fixes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Todo",
                table: "Todo");

            migrationBuilder.RenameTable(
                name: "Todo",
                newName: "Todos");

            migrationBuilder.RenameColumn(
                name: "CurrentFocusedId",
                table: "FocusedIds",
                newName: "Todo");

            migrationBuilder.AddColumn<int>(
                name: "AlreadyDone",
                table: "FocusedIds",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Todos",
                table: "Todos",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Todos",
                table: "Todos");

            migrationBuilder.DropColumn(
                name: "AlreadyDone",
                table: "FocusedIds");

            migrationBuilder.RenameTable(
                name: "Todos",
                newName: "Todo");

            migrationBuilder.RenameColumn(
                name: "Todo",
                table: "FocusedIds",
                newName: "CurrentFocusedId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Todo",
                table: "Todo",
                column: "Id");
        }
    }
}
