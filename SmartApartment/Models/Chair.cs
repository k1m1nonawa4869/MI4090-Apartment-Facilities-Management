public class Chair : Equipment
    {
        // Unique property for Chairs
        public string FabricType { get; set; }

        public override string GetDetails()
        {
            return $"[Chair] {Name} ({FabricType})";
        }
    }