using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JourneyHub.Api.Migrations
{
    public partial class newTripsModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Area",
                table: "Trips",
                type: "text",
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
