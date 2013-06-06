namespace Fanex.PTRacing.BusinessObjects
{
    using System.ComponentModel;
    public class BettingCommSetting : IBettingCommSetting
    {
        public decimal? MinBet { get; set; }

        public decimal? MaxBet { get; set; }

        public decimal? MaxPerMatch { get; set; }

        public decimal? MinBetMin { get; set; }

        public decimal? MaxBetMax { get; set; }

        public decimal? MaxPerMatchMax { get; set; }

        public decimal? Discount { get; set; }

        public decimal? DiscountMax { get; set; }

        public decimal? MasterDiscount { get; set; }

        public decimal? AgentDiscount { get; set; }

        public bool? Disable { get; set; }

        public bool? DisableDownlines { get; set; }

        public bool? DisableUplines { get; set; }

        [DefaultValue(false)]
        public bool IsApplyPresetPt { get; set; }
    }
}