namespace Fanex.PTRacing.BusinessObjects
{
    public interface IBettingCommSetting
    {
        decimal? MinBet { get; set; }

        decimal? MaxBet { get; set; }

        decimal? MaxPerMatch { get; set; }

        decimal? MinBetMin { get; set; }

        decimal? MaxBetMax { get; set; }

        decimal? MaxPerMatchMax { get; set; }

        decimal? Discount { get; set; }

        decimal? DiscountMax { get; set; }

        decimal? MasterDiscount { get; set; }

        decimal? AgentDiscount { get; set; }

        bool? Disable { get; set; }

        bool? DisableDownlines { get; set; }

        bool? DisableUplines { get; set; }
                
        bool IsApplyPresetPt { get; set; }
    }
}