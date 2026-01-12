// Services/Strategies/DeepRepairStrategy.cs
public class DeepRepairStrategy : IMaintenanceStrategy
    {
        public void Execute(Equipment equipment)
        {
            Console.WriteLine($"[Strategy] STARTING DEEP REPAIR on {equipment.Name}...");
            Console.WriteLine(" - [1/4] Disassembling housing...");
            Console.WriteLine(" - [2/4] Cleaning internal components...");
            Console.WriteLine(" - [3/4] Replacing worn gaskets/circuits...");
            Console.WriteLine(" - [4/4] Reassembling and Calibrating...");

            // Logic: Deep repair always resets status to Active
            equipment.Status = "Active";
            
            Console.WriteLine($"[Result] Deep Repair Complete. Device {equipment.Name} is fully restored.");
        }
    }
// 
