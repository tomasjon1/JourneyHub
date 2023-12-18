using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace JourneyHub.Api.Migrations
{
    public partial class PointsTypesChanged : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MapMarkers",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "MapPoints",
                table: "Trips");

            migrationBuilder.CreateTable(
                name: "Trips_MapMarkers",
                columns: table => new
                {
                    TripId = table.Column<int>(type: "integer", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Lat = table.Column<double>(type: "double precision", nullable: false),
                    Lng = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trips_MapMarkers", x => new { x.TripId, x.Id });
                    table.ForeignKey(
                        name: "FK_Trips_MapMarkers_Trips_TripId",
                        column: x => x.TripId,
                        principalTable: "Trips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Trips_MapPoints",
                columns: table => new
                {
                    TripId = table.Column<int>(type: "integer", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Lat = table.Column<double>(type: "double precision", nullable: false),
                    Lng = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trips_MapPoints", x => new { x.TripId, x.Id });
                    table.ForeignKey(
                        name: "FK_Trips_MapPoints_Trips_TripId",
                        column: x => x.TripId,
                        principalTable: "Trips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Trips_MapMarkers");

            migrationBuilder.DropTable(
                name: "Trips_MapPoints");

            migrationBuilder.AddColumn<string>(
                name: "MapMarkers",
                table: "Trips",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MapPoints",
                table: "Trips",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
