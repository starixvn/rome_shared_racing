namespace Fanex.PTRacing.BusinessObjects
{
    using System.Collections.Generic;

    public interface ISportType<T> where T : IBetTypeGroup<BetType>
    {
        int Id { get; set; }

        string Name { get; set; }

        string Key { get; set; }

        string Title { get; set; }

        bool IsHide { get; set; }

        string ResourceKey { get; set; }

        bool? Collapsed { get; set; }

        IList<T> BetTypeGroups { get; set; }
    }
}