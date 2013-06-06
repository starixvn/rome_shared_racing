namespace Fanex.PTRacing.BusinessObjects
{
    public interface IBetType
    {
        int Id { get; set; }

        string Name { get; set; }

        string Title { get; set; }

        string ResourceKey { get; set; }

        int? CopyFromBetType { get; set; }

        int? CopyFromSportType { get; set; }

        bool? Visible { get; set; }

        int? MinWidth { get; set; }

        IPT Pt { get; set; }
        
    }
}