namespace Fanex.PTRacing.BusinessObjects
{
    using System;
    using System.Collections;
    using System.Reflection;
    using System.Xml.Linq;
    using Fanex.Common.Extensions;
    using Fanex.PTRacing.XmlMapping;
    using System.Collections.Generic;

    public class BetType : IBetType, IXMLObject
    {
        public BetType()
        {
            Pt = new PT();
        }

        public BetType(XElement element)
            : this()
        {
            Map(element);
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public string Title { get; set; }

        public string ResourceKey { get; set; }
        
        public IPT Pt { get; set; }
        
        public int? CopyFromBetType { get; set; }

        public int? CopyFromSportType { get; set; }

        public bool? Visible { get; set; }

        public int? MinWidth { get; set; }

        public void Map(XElement element)
        {
            foreach (XAttribute attribute in element.Attributes())
            {
                switch (attribute.Name.LocalName)
                {
                    case Constant.BET_TYPE_ID:
                        Id = int.Parse(attribute.Value);
                        break;
                    case Constant.BET_TYPE_NAME:
                        Name = attribute.Value;
                        break;
                    case Constant.BET_TYPE_TITLE:
                        Title = attribute.Value;
                        break;
                    case Constant.BET_TYPE_RESOURCE_KEY:
                        ResourceKey = attribute.Value;
                        break;
                    case Constant.BET_TYPE_COPY_FROM_BET_TYPE:
                        CopyFromBetType = int.Parse(attribute.Value);
                        break;
                    case Constant.BET_TYPE_COPY_FROM_SPORT_TYPE:
                        CopyFromSportType = int.Parse(attribute.Value);
                        break;
                    case Constant.BET_TYPE_VISIBLE:
                        Visible = bool.Parse(attribute.Value);
                        break;
                    case Constant.BET_TYPE_MIN_WIDTH:
                        MinWidth = int.Parse(attribute.Value);
                        break;
                    default:
                        break;
                }

                if (string.IsNullOrEmpty(Title) && !string.IsNullOrEmpty(Name))
                {
                    Title = Name;
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
        public void ReadFromDataReader(IRequestContext context, System.Data.IDataReader reader, PTRacingMappingSection ptMappingSection, RacingBettingCommSettingMappingSection bettingCommSettingMappingSection, int sportTypeId)
        {
            var formId = context.FormId;

            // Use the same mapping for Edit PT / Add New
            if (formId == FormType.Add)
            {
                formId = FormType.EditPT;
            }
            #region pt mapping
            foreach (PTRacingMappingElement mappingElement in ptMappingSection.Mapping)
            {
                // Compare to get exact pattern
                if (mappingElement.Type == Enum.GetName(typeof(MappingType), MappingType.Out)
                    && int.Parse(mappingElement.RoleId) == context.RoleId
                    && int.Parse(mappingElement.TargetRoleId) == context.TargetRoleId
                    && int.Parse(mappingElement.FormId) == (int)formId)
                {
                    PropertyInfo[] propertyInfos;
                    propertyInfos = typeof(PT).GetProperties();

                    // Get all properties of PT Object and value
                    foreach (PropertyInfo propertyInfo in propertyInfos)
                    {
                        if (propertyInfo.Name == mappingElement.MappingTarget)
                        {
                            // Replace pattern
                            string formattedPattern = FormatPtPattern(context, mappingElement, sportTypeId, this.Id);

                            // Add parameters
                            if (propertyInfo.PropertyType == typeof(bool?))
                            {
                                bool value = false;
                                if (reader.HasColumn(formattedPattern))
                                {
                                    value = reader.ToBoolean(formattedPattern);
                                }

                                propertyInfo.SetValue(this.Pt, value, null);
                            }
                            else
                            {
                                if (reader.HasColumn(formattedPattern))
                                {
                                    propertyInfo.SetValue(this.Pt, reader.ToDecimal(formattedPattern), null);
                                }
                            }
                        }
                    }
                }
            }
            #endregion
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="parameters"></param>
        /// <param name="context"></param>
        /// <param name="ptMappingSection"></param>
        /// <param name="sportTypeId"></param>
        /// <param name="isLive"></param>
        public void MapToSpParameters(Hashtable parameters, IRequestContext context, PTRacingMappingSection ptMappingSection, 
            RacingBettingCommSettingMappingSection bettingCommSettingMappingSection, int sportTypeId, IPT oldPt)
        {
            var formId = context.FormId;

            // Use the same mapping for Edit PT / Add New
            if (formId == FormType.Add)
            {
                formId = FormType.EditPT;
            }

            #region pt mappting
            foreach (PTRacingMappingElement mappingElement in ptMappingSection.Mapping)
            {
                // Compare to get exact pattern
                if (mappingElement.Type == Enum.GetName(typeof(MappingType), MappingType.In)
                    && int.Parse(mappingElement.RoleId) == context.RoleId
                    && int.Parse(mappingElement.TargetRoleId) == context.TargetRoleId
                    && int.Parse(mappingElement.FormId) == (int)formId)
                {
                    PropertyInfo[] propertyInfos;
                    propertyInfos = typeof(PT).GetProperties();                    
                    // Get all properties of PT Object and value
                    foreach (PropertyInfo propertyInfo in propertyInfos)
                    {
                        if (propertyInfo.Name == mappingElement.MappingTarget)
                        {
                            var isChanged = false;
                            // Replace pattern
                            string formattedPattern = FormatPtPattern(context, mappingElement, sportTypeId, this.Id);

                            // Add parameters
                            var oldValue = propertyInfo.GetValue(oldPt, null);
                            var newValue = propertyInfo.GetValue(this.Pt, null);
                            if (oldValue != null && newValue != null)
                            {
                                if (oldValue.Equals(newValue))
                                {
                                    this.SetParamInput(ref parameters, "updatepositiontaking", false);
                                }
                                else
                                {
                                    this.SetParamInput(ref parameters, "updatepositiontaking", true);
                                    isChanged = true;
                                }
                                this.SetParamInput(ref parameters, "ischanged", isChanged);

                                parameters.Add(formattedPattern, propertyInfo.GetValue(this.Pt, null));
                            }
                            
                        }
                    }
                }
            }
            #endregion
        }

        #region private functions
        /// <summary>
        /// This Function will format pattern of Sport Type, Bet Type and Live or not
        /// </summary>
        /// <param name="mappingElement"></param>
        /// <param name="sportTypeId"></param>
        /// <param name="bettypeId"></param>
        /// <param name="isLive"></param>
        /// <returns></returns>
        private string FormatPtPattern(IRequestContext requestContext, PTRacingMappingElement mappingElement, int sportTypeId, int bettypeId)
        {
            string formattedPattern = mappingElement.Pattern;

            // Format sport type id
            if (int.Parse(mappingElement.SportTypeId.OmitWhenDefault) == sportTypeId)
            {
                formattedPattern = formattedPattern.Replace(Constant.SPORT_ID_MAP, string.Empty);
            }
            else
            {
                formattedPattern = formattedPattern.Replace(Constant.SPORT_ID_MAP, string.Format(mappingElement.SportTypeId.Format, sportTypeId));
            }

            // Format bettype Id
            if (int.Parse(mappingElement.BetTypeId.OmitWhenDefault) == 0)
            {
                formattedPattern = formattedPattern.Replace(Constant.BET_TYPE_ID_MAP, bettypeId.ToString());
            }
            else
            {
                formattedPattern = formattedPattern.Replace(Constant.BET_TYPE_ID_MAP, string.Format(mappingElement.BetTypeId.Format, bettypeId));
            }

            return formattedPattern;
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