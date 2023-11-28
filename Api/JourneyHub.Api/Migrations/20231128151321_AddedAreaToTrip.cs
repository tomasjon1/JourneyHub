using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JourneyHub.Migrations
{
    public partial class AddedAreaToTrip : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Area",
                table: "Trips",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Area",
                table: "Trips");
        }
    }
}
