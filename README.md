# JourneyHub

## Front-end

```
npm install

ng serve
```

## Back-end

```
dotnet ef database update

dotnet run
```

### appsettings.json (docker connection string)

```
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "JwtConfig": {
    "Secret": "very-secret-ready-for-production-key",
    "ExpirationInHours": 2
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=Journeyhub;Username=postgres;Password=postgres"
  }
}

```

> Assuming postgres is running on default 5432 port
