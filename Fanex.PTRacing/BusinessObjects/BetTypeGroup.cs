namespace Fanex.PTRacing.BusinessObjects
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Xml.Linq;
    using Fanex.PTRacing.XmlMapping;

    public class BetTypeGroup : IBetTypeGroup<BetType>, IXMLObject
    {
        public BetTypeGroup()
        {
            BetTypes = new List<BetType>();
            BettingCommSetting = new BettingCommSetting();
        }

        public BetTypeGroup(XElement element)
            : this()
        {
            Map(element);
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public string Title { get; set; }

        public string ResourseKey { get; set; }

        public bool IsHide { get; set; }

        public string AllowCurrencies { get; set; }

        public IBettingCommSetting BettingCommSetting { get; set; }

        public IList<BetType> BetTypes { get; set; }

        public void Map(XElement element)
        {
            foreach (XAttribute attribute in element.Attributes())
            {
                switch (attribute.Name.LocalName)
                {
                    case Constant.BET_TYPE_GROUP_ID:
                        Id = int.Parse(attribute.Value);
                        break;
                    case Constant.BET_TYPE_GROUP_NAME:
                        Name = string.Format("{0}", attribute.Value);
                        break;
                    case Constant.BET_TYPE_GROUP_RESOURCE_KEY:
                        ResourseKey = string.Format("{0}", attribute.Value);
                        break;
                    case Constant.BET_TYPE_GROUP_IS_HIDE:
                        IsHide = bool.Parse(attribute.Value);
                        break;
                    case Constant.BET_TYPE_GROUP_ALLOW_CURRENCIES:
                        AllowCurrencies = string.Format("{0}", attribute.Value);
                        break;
                    default:
                        break;
                }
            }
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="element"></param>
        /// <param name="excluldeInvisibleBetTypes"></param>
        public void Populate(XElement element)
        {
            foreach (var betTypesElement in element.Elements())
            {
                foreach (var betTypeElement in betTypesElement.Elements())
                {
                    // Init new bet type or populate to existing bet type
                    BetType betType = new BetType(betTypeElement);
                    BetType currentBetType = (from bt in this.BetTypes
                                              where bt.Id == betType.Id
                                              select bt).FirstOrDefault();
                    if (currentBetType == null)
                    {
                        // Excluding invisible bet type
                        if (betType.Visible == false)
                        {
                            continue;
                        }

                        this.BetTypes.Add(betType);
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
        /// <param name="sportTypeId"></param>
        /// <param name="isLive"></param>
        public void ReadFromDataReader(IRequestContext context, System.Data.IDataReader reader, PTRacingMappingSection ptMappingSection, 
            RacingBettingCommSettingMappingSection bettingCommSettingMappingSection, int sportTypeId)
        {
            #region betting - comm setting
            foreach (BettingCommSettingElement mappingBettingCommElement in bettingCommSettingMappingSection.BetSettingCollection)
            {
                // Compare to get exact pattern
                if (mappingBettingCommElement.Type == Enum.GetName(typeof(MappingType), MappingType.Out)
                    //&& mappingBettingCommElement.TargetRoleId == context.TargetRoleId
                    )
                {
                    PropertyInfo[] propertyInfos;
                    propertyInfos = typeof(BettingCommSetting).GetProperties();

                    // Get all properties of BettingComm Object and value
                    foreach (PropertyInfo propertyInfo in propertyInfos)
                    {
                        if (propertyInfo.Name == mappingBettingCommElement.MappingTarget)
                        {
                            // Replace pattern
                            string formattedPattern = FormatBettingCommPattern(context, mappingBettingCommElement, sportTypeId, this.Id);

                            // Add parameters
                            if (propertyInfo.PropertyType == typeof(bool?))
                            {
                                bool value = false;
                                if (reader.HasColumn(formattedPattern))
                                {
                                    value = reader.ToDecimal(formattedPattern) > 0 ? true : false;
                                }

                                propertyInfo.SetValue(this.BettingCommSetting, value, null);
                            }
                            else
                            {
                                if (reader.HasColumn(formattedPattern))
                                {
                                    propertyInfo.SetValue(this.BettingCommSetting, reader.ToDecimal(formattedPattern), null);
                                }
                            }
                        }
                    }
                }
            }
            #endregion

            // Read data for bettype
            foreach (BetType betType in this.BetTypes)
            {
                betType.ReadFromDataReader(context, reader, ptMappingSection, bettingCommSettingMappingSection, sportTypeId);
            }
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="parameters"></param>
        /// <param name="context"></param>
        /// <param name="ptMappingSection"></param>
        /// <param name="sportTypeId"></param>
        /// <param name="isLive"></param>
        /// <param name="sportTypes"></param>
        public void MapToSpParameters(Hashtable parameters, IRequestContext context, PTRacingMappingSection ptMappingSection,
            RacingBettingCommSettingMappingSection bettingCommSettingMappingSection, int sportTypeId, IList<SportType> newSettings, BetTypeGroup oldBettypeGroup)
        {
            #region betting - comm setting
            if (context.RoleId - context.TargetRoleId == 1)
            {
                var compareBettingCommSetting = this.ComparingObjectProperties(oldBettypeGroup.BettingCommSetting, this.BettingCommSetting);
                var isUpdateMinMaxBet = false;
                var isUpdateStatus = false;
                var isUpdateDiscount = false;
                var isChanged = false;
                if (compareBettingCommSetting.Count > 0)
                {
                    #region disable
                    if (compareBettingCommSetting.Contains("disable") || compareBettingCommSetting.Contains("disabledownlines"))
                    {
                        isUpdateStatus = true;
                        isChanged = true;
                    }
                    else
                    {
                        isUpdateStatus = false;
                    }
                    #endregion
                    #region betting limit
                    if (compareBettingCommSetting.Contains(string.Format("minbet", sportTypeId, this.Id)) |
                        compareBettingCommSetting.Contains(string.Format("maxbet", sportTypeId, this.Id)) |
                        compareBettingCommSetting.Contains(string.Format("maxpermatch", sportTypeId, this.Id)))
                    {
                        isUpdateMinMaxBet = true;
                        isChanged = true;
                    }
                    else
                    {
                        isUpdateMinMaxBet = false;
                    }
                    #endregion
                    #region comm
                    if (compareBettingCommSetting.Contains(string.Format("discount", sportTypeId, this.Id)))
                    {
                        isUpdateDiscount = true;
                        isChanged = true;
                    }
                    else
                    {
                        isUpdateDiscount = false;
                    }
                    #endregion

                    #region pt
                    if (compareBettingCommSetting.Contains("isapplypresetpt"))
                    {
                        this.SetParamInput(ref parameters, "updatepositiontaking", true);
                        isChanged = true;
                    }
                    #endregion
                }
                this.SetParamInput(ref parameters, string.Format("updatedisable{0}_{1}", sportTypeId, this.Id), isUpdateStatus);
                this.SetParamInput(ref parameters, string.Format("updateminmaxbet{0}_{1}", sportTypeId, this.Id), isUpdateMinMaxBet);
                this.SetParamInput(ref parameters, "updatecommission", isUpdateDiscount);
                this.SetParamInput(ref parameters, "ischanged", isChanged);

                foreach (BettingCommSettingElement mappingBettingCommElement in bettingCommSettingMappingSection.BetSettingCollection)
                {
                    // Compare to get exact pattern
                    if (mappingBettingCommElement.Type == Enum.GetName(typeof(MappingType), MappingType.In))
                    {
                        PropertyInfo[] propertyInfos;
                        propertyInfos = typeof(BettingCommSetting).GetProperties();

                        // Get all properties of BettingComm Object and value
                        foreach (PropertyInfo propertyInfo in propertyInfos)
                        {
                            if (propertyInfo.Name == mappingBettingCommElement.MappingTarget)
                            {
                                // Replace pattern
                                string formattedPattern = FormatBettingCommPattern(context, mappingBettingCommElement, sportTypeId, this.Id);
                                // Add parameters
                                parameters.Add(formattedPattern, propertyInfo.GetValue(this.BettingCommSetting, null));
                            }
                        }
                    }
                }
            }
            #endregion

            #region pt mapping
            foreach (BetType betType in this.BetTypes)
            {
                // Handle copy bettype setting for invisible bet types
                if ((betType.CopyFromSportType != null) &&
                    (betType.CopyFromBetType != null) &&
                    (betType.Visible == false))
                {
                    // Find correct bet type need to copy pt
                    betType.Pt = (from st in newSettings
                                  where betType.CopyFromSportType == st.Id // Sport types

                                  from btg in st.BetTypeGroups
                                  where btg.IsHide == true

                                  from bt in btg.BetTypes // Bet types
                                  where bt.Id == betType.CopyFromBetType

                                  select bt).FirstOrDefault().Pt;
                }

                // Mapping for bettype
                var oldPt = (from b in oldBettypeGroup.BetTypes where b.Id == betType.Id select b).FirstOrDefault().Pt;
                betType.MapToSpParameters(parameters, context, ptMappingSection, bettingCommSettingMappingSection, sportTypeId, oldPt);
            }
            #endregion
        }

        #region private functions
        private string FormatBettingCommPattern(IRequestContext requestContext, BettingCommSettingElement mappingElement, int sportTypeId, int toteId)
        {
            string formattedPattern = mappingElement.Pattern;

            // Format sport type id
            if (int.Parse(mappingElement.SportId.OmitWhenDefault) == sportTypeId)
            {
                formattedPattern = formattedPattern.Replace(Constant.SPORT_ID_MAP, string.Empty);
            }
            else
            {
                formattedPattern = formattedPattern.Replace(Constant.SPORT_ID_MAP, string.Format(mappingElement.SportId.Format, sportTypeId));
            }

            // Format bettype Id
            if (int.Parse(mappingElement.BetTypeId.OmitWhenDefault) == 0)
            {
                formattedPattern = formattedPattern.Replace(Constant.BET_TYPE_ID_MAP, toteId.ToString());
            }
            else
            {
                formattedPattern = formattedPattern.Replace(Constant.BET_TYPE_ID_MAP, string.Format(mappingElement.BetTypeId.Format, toteId));
            }

            return formattedPattern;
        }

        /// <summary>
        /// ComparingObjectProperties method
        /// </summary>
        /// <typeparam name="T">T typeparam</typeparam>
        /// <param name="oldSettings">oldSettings param</param>
        /// <param name="newSettings">newSettings param</param>
        /// <returns>return string</returns>
        private List<string> ComparingObjectProperties<T>(T oldSettings, T newSettings)
        {
            var resultDiffProperty = new List<string>();
            if (oldSettings != null && newSettings != null)
            {
                Type type = typeof(T);
                PropertyInfo[] propertyInfos;
                propertyInfos = typeof(T).GetProperties();
                foreach (PropertyInfo propertyInfo in propertyInfos)
                {
                    var propertyName = propertyInfo.Name;
                    var oldValue = type.GetProperty(propertyName).GetValue(oldSettings, null);
                    var newValue = type.GetProperty(propertyName).GetValue(newSettings, null);

                    if (newValue != null && !newValue.Equals(oldValue))
                    {
                        resultDiffProperty.Add(propertyName.ToLower());
                    }
                }
            }

            return resultDiffProperty;
        }

        private void SetParamInput(ref Hashtable settingParams, string paramName, bool isUpdate)
        {
            if (!settingParams.ContainsKey(paramName))
            {
                settingParams.Add(paramName, false);
            }
            if (isUpdate)
            {
                settingParams[paramName] = isUpdate;
            }
        }
        #endregion
        
    }
}