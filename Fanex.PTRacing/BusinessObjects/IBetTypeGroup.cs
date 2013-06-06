namespace Fanex.PTRacing.BusinessObjects
{
    using System.Collections.Generic;

    public interface IBetTypeGroup<T> where T : IBetType
    {
        int Id { get; set; }

        string Name { get; set; }

        string Title { get; set; }

        string ResourseKey { get; set; }

        bool IsHide { get; set; }

        string AllowCurrencies { get; set; }

        IBettingCommSetting BettingCommSetting { get; set; }
        
        IList<T> BetTypes { get; set; }
    }
}