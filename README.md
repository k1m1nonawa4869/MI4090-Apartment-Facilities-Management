# MI4090-Apartment-Facilities-Management
OOP project aims to manage facilities at apartment. For staffs and admins

# Project Implementation Report: Smart Apartment Management System

## 1. Project Overview
This project implements a **Console-Based Prototype** of the Smart Apartment Facilities Management System. The application is built using **C# (.NET 9.0)** and strictly adheres to the **MVC (Model-View-Controller)** architecture. It utilizes a text-file database (`.txt`) for data persistence to simulate a real-world environment without requiring a SQL server.

## 2. Architectural Patterns Implemented
The codebase is structured around **6 Key Object-Oriented Design Patterns**:
1.  **MVC (Model-View-Controller):** Separates User Interface (Console) from Logic (Services) and Data (Models).
2.  **Factory Pattern:** Centralizes the creation of complex Equipment objects.
3.  **Strategy Pattern:** Allows dynamic switching of maintenance algorithms (Quick vs. Deep repair) at runtime.
4.  **Repository Pattern:** Abstracts the text-file reading/writing, making data access generic.
5.  **Observer Pattern:** Automatically notifies the Manager and Technician when a fault is reported.
6.  **Singleton Pattern:** Ensures only one instance of the `SystemScheduler` runs to prevent audit conflicts.

---

## 3. File & Class Breakdown

### A. Domain Layer (Models)
*Represents the "Data" in MVC. Corresponds to the "Domain Entities" package in the Class Diagram.*

| File Name | Functionality | Connection to Diagram | OOP Techniques |
| :--- | :--- | :--- | :--- |
| **`Equipment.cs`** | Abstract base class defining common properties (`Id`, `Name`, `Status`) for all assets. | **Base Class**: Matches the abstract `Equipment` class. | **Inheritance** (Base class), **Polymorphism** (Abstract methods). |
| **`Router.cs`, `Table.cs`, `Chair.cs`** | Concrete implementations of Equipment. | **Subclasses**: Matches `Router`, `Table` in Domain Layer. | **Inheritance** (`: Equipment`), **Extensibility** (Easy to add new types). |
| **`WorkOrder.cs`** | Represents a log of maintenance performed (Who, When, What strategy). | **Entity**: Matches the `WorkOrder` class in the Maintenance package. | **Encapsulation** (Stores repair history). |

### B. Data Access Layer (Infrastructure)
*Handles saving/loading data. Corresponds to the "Repositories" package in the Class Diagram.*

| File Name | Functionality | Connection to Diagram | OOP Techniques |
| :--- | :--- | :--- | :--- |
| **`FileRepository.cs`** | Generic class that reads/writes JSON to `.txt` files. Handles all database operations. | **Interface Implementation**: Implements `IRepository<T>`. | **Generics** (`<T>`), **Repository Pattern** (Decouples storage from logic). |

### C. Service Layer (Business Logic)
*The "Brain" of the application. Corresponds to the "Services" package in the Class Diagram.*

| File Name | Functionality | Connection to Diagram | OOP Techniques |
| :--- | :--- | :--- | :--- |
| **`EquipmentService.cs`** | Manages inventory. Handles "Add Item" (via Factory) and "Update Status". | **Service**: Matches `EquipmentService`. | **Dependency Injection** (Uses Repo & Factory). |
| **`MaintenanceService.cs`** | Orchestrates repairs. Loads the item, runs the chosen Strategy, and saves a WorkOrder. | **Service**: Matches `MaintenanceService`. | **Strategy Pattern Consumer**. |
| **`SystemScheduler.cs`** | Background process that scans all items for random faults (Simulation). | **Singleton**: Matches `SystemScheduler` class. | **Singleton Pattern** (Private constructor, Static instance). |

### D. Design Pattern Implementations
*Specific folders implementing complex behaviors.*

| File Name | Functionality | Connection to Diagram | OOP Techniques |
| :--- | :--- | :--- | :--- |
| **`IEquipmentFactory.cs`** / **`EquipmentFactory.cs`** | Decides which class (`Router` vs `Chair`) to instantiate based on string input. | **Factory**: Matches `IEquipmentFactory`. | **Factory Method Pattern**. |
| **`IMaintenanceStrategy.cs`** | Interface defining the `Execute()` contract for all repairs. | **Strategy Interface**: Matches `IMaintenanceStrategy`. | **Polymorphism** (Interface-based). |
| **`QuickRepairStrategy.cs`** | Performs a simple repair logic (updates status immediately). | **Concrete Strategy**: Matches `QuickRepair`. | **Strategy Pattern**. |
| **`DeepRepairStrategy.cs`** | Performs complex 4-step repair logic (Disassemble -> Clean -> Fix -> Assemble). | **Concrete Strategy**: Matches `DeepService`. | **Strategy Pattern**. |
| **`InspectionStrategy.cs`** | Checks item without fixing (False Alarm check). | **Concrete Strategy**: Matches logic discussed in Sequence Diagram. | **Strategy Pattern**. |
| **`NotificationCenter.cs`** | Maintains a list of subscribers (Manager, Tech) and broadcasts messages. | **Subject**: Matches `NotificationCenter`. | **Observer Pattern**. |
| **`Manager.cs`**, **`Technician.cs`** | Listeners that receive alerts via `Update()`. | **Observers**: Match `IObserver` implementation. | **Observer Pattern**. |

### E. Presentation Layer (Controllers)
*The "Entry Point" for user actions. Corresponds to the "Controllers" package.*

| File Name | Functionality | Connection to Diagram | OOP Techniques |
| :--- | :--- | :--- | :--- |
| **`EquipmentController.cs`** | Handles User Input for adding/viewing items. Delegates to Service. | **Controller**: Matches `EquipmentController`. | **MVC** (Separates Console I/O from Logic). |
| **`MaintenanceController.cs`** | Handles User Input for selecting IDs and strategies. | **Controller**: Matches `MaintenanceController`. | **MVC**. |
| **`FaultReportController.cs`** | Handles reporting faults. Triggers the Observer notification. | **Controller**: Matches `FaultReportController`. | **MVC**, **Event-Driven** (Triggers Notifier). |
| **`DashboardController.cs`** | Aggregates stats (Active vs Faulty) and displays them. | **Controller**: Matches `DashboardController`. | **MVC**. |

### F. Application Entry
| File Name | Functionality | Connection to Diagram | OOP Techniques |
| :--- | :--- | :--- | :--- |
| **`Program.cs`** | **Composition Root**: Creates all Repositories, Services, and Controllers, then wires them together. Runs the main menu loop. | **Main System**: The entry point. | **Dependency Injection (Manual)**. |

---

## 4. Key OOP Techniques & Concepts Used

### 1. JSON Polymorphism (Handling Derived Types)
* **Concept:** Standard JSON serializers struggle with inheritance (saving a `Router` but reading it back as generic `Equipment`).
* **Implementation:** We used `[JsonDerivedType]` attributes in `Equipment.cs`.
* **Result:** The text database correctly identifies `"$type": "Router"` vs `"$type": "Chair"`, allowing us to save different properties for different assets in the same list.

### 2. Dependency Injection (DI)
* **Concept:** High-level modules should not depend on low-level modules; both should depend on abstractions.
* **Implementation:** In `Program.cs`, we create the `FileRepository` first, then pass it into `EquipmentService`. The Service doesn't know *how* to create the database; it is just given one.
    ```csharp
    // Program.cs
    var repo = new FileRepository<Equipment>(...);
    var service = new EquipmentService(repo, ...); // Injected
    ```

### 3. Open/Closed Principle (SOLID)
* **Concept:** Software entities should be open for extension, but closed for modification.
* **Implementation (Strategy Pattern):** We can add a new repair method (e.g., `ReplacePartStrategy.cs`) **without changing** the `MaintenanceService` code. We just create a new class and the system accepts it.
* **Implementation (Factory Pattern):** We can add a new `SmartLight.cs` class. We only need to touch the Factory switch case, leaving the rest of the application (Controllers, Repositories) untouched.

### 4. Global Namespace (Simplicity)
* **Concept:** Reducing code noise.
* **Implementation:** We utilized C# 10 features (implicit usings and top-level statements logic) and removed explicit `namespace SmartApartment { }` wrapping to keep the prototype code clean and readable, mimicking a flat project structure often used in rapid prototyping.

## 5. Traceability Matrix (Code vs. Diagrams)

| Requirement / Diagram Element | Implemented In Code |
| :--- | :--- |
| **Use Case: Report Fault** | `FaultReportController.ReportFault()` |
| **Use Case: Perform Maintenance** | `MaintenanceController.PerformMaintenance()` |
| **Sequence: View Dashboard** | `DashboardController.ShowDashboard()` |
| **Sequence: Daily Audit** | `SystemScheduler.RunDailyAudit()` |
| **Class: WorkOrder** | `WorkOrder.cs` |
| **Pattern: Observer** | `NotificationCenter.cs` |
