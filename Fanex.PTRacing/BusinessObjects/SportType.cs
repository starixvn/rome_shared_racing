namespace Fanex.PTRacing.BusinessObjects
{
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;
    using System.Xml.Linq;
    using Fanex.PTRacing.XmlMapping;

    public class SportType : ISportType<BetTypeGroup>, IXMLObject
    {
        public SportType()
        {
            BetTypeGroups = new List<BetTypeGroup>();
        }

        public SportType(XElement element)
            : this()
        {
            Map(element);
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public string Key { get; set; }

        public string Title { get; set; }

        public bool IsHide { get; set; }

        public string ResourceKey { get; set; }

        public bool? Collapsed { get; set; }

        public IList<BetTypeGroup> BetTypeGroups { get; set; }

        public void Map(XElement element)
        {
            foreach (XAttribute attribute in element.Attributes())
            {
                switch (attribute.Name.LocalName)
                {
                    case Constant.SPORT_TYPE_ID:
                        Id = int.Parse(attribute.Value);
                        break;
                    case Constant.SPORT_TYPE_NAME:
                        Name = attribute.Value;
                        break;
                    case Constant.SPORT_TYPE_KEY:
                        Key = attribute.Value;
                        break;
                    case Constant.SPORT_TYPE_RESOURCE_KEY:
                        ResourceKey = attribute.Value;
                        break;
                    case Constant.SPORT_TYPE_COLLAPSED:
                        Collapsed = bool.Parse(attribute.Value);
                        break;
                    case Constant.SPORT_TYPE_IS_HIDE:
                        IsHide = bool.Parse(attribute.Value);
                        break;
                    default:
                        break;
                }

                if (string.IsNullOrEmpty(Key) && !string.IsNullOrEmpty(Name))
                {
                    Key = Name;
                }
            }
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="element"></param>
        public void Populate(XElement element, IRequestContext context)
        {
            foreach (var betTypeGroupsElement in element.Elements())
            {
                foreach (var betTypeGroupElement in betTypeGroupsElement.Elements())
                {
                    // Init new bet type group or populate to existing bet type group
                    BetTypeGroup betTypeGroup = new BetTypeGroup(betTypeGroupElement);                    

                    if (CheckMemberCurrencyIsAllowToPlay(context.CurrencyId, betTypeGroup.AllowCurrencies)) {
                        BetTypeGroup currentBetTypeGroup = (from btgs in this.BetTypeGroups
                                                            where btgs.Id == betTypeGroup.Id
                                                            select btgs).FirstOrDefault();
                        if (currentBetTypeGroup == null)
                        {
                            currentBetTypeGroup = betTypeGroup;
                            this.BetTypeGroups.Add(betTypeGroup);
                        }

                        currentBetTypeGroup.Populate(betTypeGroupElement);
                    }                    
                }
            }
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="context"></param>
        /// <param name="reader"></param>
        /// <param name="ptMappingSection"></param>
        public void ReadFromDataReader(IRequestContext context, System.Data.IDataReader reader, PTRacingMappingSection ptMappingSection, RacingBettingCommSettingMappingSection bettingCommSettingMappingSection)
        {
            foreach (BetTypeGroup betTypeGroup in BetTypeGroups)
            {
                betTypeGroup.ReadFromDataReader(context, reader, ptMappingSection, bettingCommSettingMappingSection, this.Id);
            }
        }

        public void MapToSpParameters(Hashtable parameters, IRequestContext context, PTRacingMappingSection ptMappingSection,
            RacingBettingCommSettingMappingSection bettingCommSettingMappingSection, IList<SportType> newSettings, IList<BetTypeGroup> oldBettypeGroups)
        {
            foreach (BetTypeGroup betTypeGroup in this.BetTypeGroups)
            {
                var oldBettypeGroup = (from b in oldBettypeGroups where b.Id == betTypeGroup.Id select b).FirstOrDefault();
                betTypeGroup.MapToSpParameters(parameters, context, ptMappingSection, bettingCommSettingMappingSection, this.Id, newSettings, oldBettypeGroup);
            }
        }

        #region private functions
        private bool CheckMemberCurrencyIsAllowToPlay(int memberCurrencyId, string currencyListAllowToPlay)
        {
            if (string.IsNullOrEmpty(currencyListAllowToPlay) | currencyListAllowToPlay.Equals("*") | memberCurrencyId == 0)
            {
                return true;
            }
            return currencyListAllowToPlay.Split(',').Contains(memberCurrencyId.ToString());
            
        }
        #endregion
        
    }
}