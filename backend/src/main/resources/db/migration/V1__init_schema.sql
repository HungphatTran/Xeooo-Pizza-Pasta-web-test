-- =========================================================================
-- DATABASE INITIALIZATION SCHEMA FOR MICROSOFT SQL SERVER 2022
-- Project: Xéooo Pizza & Pasta Restaurant Management System
-- =========================================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'XeoooRestaurantDB')
BEGIN
    CREATE DATABASE XeoooRestaurantDB;
END
GO

USE XeoooRestaurantDB;
GO

-- 1. USERS & SECURITY
IF OBJECT_ID('dbo.Users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        UserId NVARCHAR(50) PRIMARY KEY,
        Username NVARCHAR(100) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        FullName NVARCHAR(150) NOT NULL,
        Email NVARCHAR(150) NULL,
        Phone NVARCHAR(20) NULL,
        Role NVARCHAR(30) NOT NULL DEFAULT 'STAFF',
        PinCode NVARCHAR(10) NOT NULL,
        TwoFactorEnabled BIT NOT NULL DEFAULT 0,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

-- 2. TABLES & FLOOR MAPPING
IF OBJECT_ID('dbo.RestaurantTables', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.RestaurantTables (
        TableId NVARCHAR(50) PRIMARY KEY,
        TableName NVARCHAR(100) NOT NULL,
        FloorNumber INT NOT NULL,
        Capacity INT NOT NULL,
        Shape NVARCHAR(20) NOT NULL DEFAULT 'rect',
        PosX INT NOT NULL DEFAULT 50,
        PosY INT NOT NULL DEFAULT 50,
        Width INT NOT NULL DEFAULT 80,
        Height INT NOT NULL DEFAULT 60,
        IsVip BIT NOT NULL DEFAULT 0,
        Status NVARCHAR(30) NOT NULL DEFAULT 'available',
        MergedWith NVARCHAR(MAX) NULL,
        ParentTableId NVARCHAR(50) NULL,
        UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

-- 3. RESERVATIONS
IF OBJECT_ID('dbo.Reservations', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Reservations (
        ReservationId NVARCHAR(50) PRIMARY KEY,
        CustomerName NVARCHAR(150) NOT NULL,
        Phone NVARCHAR(30) NOT NULL,
        Email NVARCHAR(150) NULL,
        ReservationDate DATE NOT NULL,
        TimeSlot NVARCHAR(20) NOT NULL,
        Pax INT NOT NULL,
        FloorNumber INT NOT NULL,
        TableId NVARCHAR(50) NOT NULL,
        TableName NVARCHAR(100) NOT NULL,
        DecorationSet NVARCHAR(50) NOT NULL DEFAULT 'none',
        Occasion NVARCHAR(50) NOT NULL DEFAULT 'normal',
        SpecialEventTitle NVARCHAR(200) NULL,
        HasBlackboard BIT NOT NULL DEFAULT 0,
        DepositAmount DECIMAL(18, 2) NOT NULL DEFAULT 0,
        TotalAmount DECIMAL(18, 2) NOT NULL DEFAULT 0,
        PaymentStatus NVARCHAR(30) NOT NULL DEFAULT 'unpaid',
        PaymentMethod NVARCHAR(50) NULL,
        Source NVARCHAR(30) NOT NULL DEFAULT 'online',
        Status NVARCHAR(30) NOT NULL DEFAULT 'confirmed',
        Note NVARCHAR(MAX) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Reservations_Tables FOREIGN KEY (TableId) REFERENCES dbo.RestaurantTables(TableId)
    );
    CREATE INDEX IX_Reservations_Date_Slot ON dbo.Reservations(ReservationDate, TimeSlot);
    CREATE INDEX IX_Reservations_Phone ON dbo.Reservations(Phone);
END
GO

-- 4. KITCHEN ORDERS & KDS
IF OBJECT_ID('dbo.KitchenOrders', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.KitchenOrders (
        KitchenItemId NVARCHAR(50) PRIMARY KEY,
        OrderId NVARCHAR(50) NOT NULL,
        ReservationId NVARCHAR(50) NULL,
        TableId NVARCHAR(50) NOT NULL,
        TableName NVARCHAR(100) NOT NULL,
        MenuItemId NVARCHAR(50) NOT NULL,
        DishName NVARCHAR(150) NOT NULL,
        Quantity INT NOT NULL DEFAULT 1,
        Price DECIMAL(18, 2) NOT NULL,
        Status NVARCHAR(30) NOT NULL DEFAULT 'pending',
        Note NVARCHAR(500) NULL,
        Priority NVARCHAR(20) NOT NULL DEFAULT 'normal',
        OrderedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        StartedCookingAt DATETIME2 NULL,
        ReadyAt DATETIME2 NULL,
        ServedAt DATETIME2 NULL
    );
    CREATE INDEX IX_KitchenOrders_Status ON dbo.KitchenOrders(Status);
END
GO

-- 5. INVENTORY & RECIPES
IF OBJECT_ID('dbo.Ingredients', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Ingredients (
        IngredientId NVARCHAR(50) PRIMARY KEY,
        Name NVARCHAR(150) NOT NULL,
        NameEn NVARCHAR(150) NULL,
        Sku NVARCHAR(50) NOT NULL UNIQUE,
        Category NVARCHAR(50) NOT NULL,
        Unit NVARCHAR(20) NOT NULL,
        CurrentStock DECIMAL(18, 2) NOT NULL DEFAULT 0,
        MinThreshold DECIMAL(18, 2) NOT NULL DEFAULT 10,
        OptimalStock DECIMAL(18, 2) NOT NULL DEFAULT 50,
        CostPerUnit DECIMAL(18, 2) NOT NULL,
        SupplierId NVARCHAR(50) NULL,
        SupplierName NVARCHAR(150) NULL,
        Location NVARCHAR(100) NOT NULL,
        LastRestockedDate DATE NULL
    );
END
GO

-- 6. AUDIT LOGS
IF OBJECT_ID('dbo.AuditLogs', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.AuditLogs (
        LogId BIGINT IDENTITY(1,1) PRIMARY KEY,
        Timestamp DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UserId NVARCHAR(50) NOT NULL,
        UserName NVARCHAR(150) NOT NULL,
        UserRole NVARCHAR(50) NOT NULL,
        Action NVARCHAR(100) NOT NULL,
        Entity NVARCHAR(100) NOT NULL,
        EntityId NVARCHAR(100) NULL,
        Details NVARCHAR(MAX) NOT NULL,
        IpAddress NVARCHAR(50) NULL
    );
    CREATE INDEX IX_AuditLogs_Timestamp ON dbo.AuditLogs(Timestamp DESC);
END
GO
