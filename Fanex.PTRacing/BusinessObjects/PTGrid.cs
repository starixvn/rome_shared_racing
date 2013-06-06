namespace Fanex.PTRacing.BusinessObjects
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Web;
    using System.Xml.Linq;
    using Fanex.Logging;
    using Fanex.PTRacing.XmlMapping;

    public class PTGrid : IPTGrid<SportType>
    {
        public string Name { get; set; }

        public IList<SportType> SportTypes { get; set; }

        public PTGrid()
        {
            SportTypes = new List<SportType>();
        }

        protected PTRacingMappingSection PTMappingSection
        {
            get
            {
                return (PTRacingMappingSection)System.Configuration.ConfigurationManager.GetSection("PTRacingMappingSection");
            }
        }

        protected RacingBettingCommSettingMappingSection BettingCommSettingSection
        {
            get
            {
                return (RacingBettingCommSettingMappingSection)System.Configuration.ConfigurationManager.GetSection("RacingBettingCommSettingMappingSection");
            }
        }

        /// <summary>
        /// Caching configuration file, implemented by internal constructor + safe singleton + lazy load pattern
        /// </summary>
        internal static class _Configuration
        {
            static _Configuration()
            {
                try
                {
                    Document = XDocument.Load(HttpContext.Current.Server.MapPath(Constant.PT_GRID_CONFIG));
                }
                catch (Exception ex)
                {
                    throw new Exception("Could not load PTGrid configruation file.", ex);
                }
            }

            internal static XDocument Document
            {
                get;
                set;
            }
        }

        #region IPTGrid Members

        /// <summary>
        /// This function will populate current instance from a XML File
        /// </summary>
        public void Populate(IRequestContext context)
        {
            XDocument document = _Configuration.Document;

            Name = document.Root.Attribute(Constant.PT_GRID_NAME).Value.Trim();
            XElement root = document.Root.Element(Constant.ROOT_ELEMENT_PT_GRID);
            foreach (XElement sportTypeElement in root.Elements())
            {
                // Init new sport type or populate to existing sport type
                SportType sportType = new SportType(sportTypeElement);
                if (!sportType.IsHide) {
                    SportType currentSportType = (from st in this.SportTypes
                                                  where st.Id == sportType.Id && st.Key == sportType.Key
                                                  select st).FirstOrDefault();

                    if (currentSportType == null)
                    {
                        currentSportType = sportType;
                        this.SportTypes.Add(sportType);
                    }

                    currentSportType.Populate(sportTypeElement, context);
                }
            }
        }

        /// <summary>
        /// Mapping Pattern with config file for SPs
        /// </summary>
        /// <param name="context"></param>
        /// <param name="map"></param>
        public void MapToSpParameters(Hashtable parameters, IRequestContext context, IList<SportType> oldSettings)
        {
            this.Populate(context);

            try
            {
                foreach (SportType sportType in this.SportTypes)
                {
                    SportType oldSport = (from s in oldSettings where s.Id == sportType.Id select s).FirstOrDefault();
                    sportType.MapToSpParameters(parameters, context, this.PTMappingSection, this.BettingCommSettingSection, this.SportTypes, oldSport.BetTypeGroups);
                }
            }
            catch (Exception ex)
            {
                LogService.Error(ex.Message);
                throw new System.ArgumentException("Mapping configuration format is invalid.", ex);
            }
        }

        /// <summary>
        /// Mapping Pattern with config file for SPs
        /// </summary>
        /// <param name="context"></param>
        /// <param name="map"></param>
        public void MapToSpUpdateMultipleParameters(ref Hashtable parameters, Hashtable updateParameters, bool isUpdateBettingLimit, IRequestContext context)
        {
            int i = 1;
            if (isUpdateBettingLimit)
            {
                i = Constant.SPORT_TYPE_INDEX_UPDATE_PARAMETER;
            }

            this.Populate(context);

            try
            {
                foreach (SportType sportType in this.SportTypes)
                {
                    string formattedPattern = string.Empty;
                    if (int.Parse(this.PTMappingSection.Mapping[0].SportTypeId.OmitWhenDefault) != sportType.Id)
                    {
                        formattedPattern = string.Format(this.PTMappingSection.Mapping[0].SportTypeId.Format, sportType.Id);                        
                    }

                    parameters.Add(Constant.SPORT_TYPE_UPDATE + formattedPattern, Convert.ToInt16(updateParameters[i]));
                    
                    i++;
                }
            }
            catch (Exception ex)
            {
                LogService.Error(ex.Message);
                throw new System.ArgumentException("Mapping configuration format is invalid.", ex);
            }
        }

        /// <summary>
        /// Mapping pattern to get data from Data Reader
        /// </summary>
        /// <param name="context"></param>
        /// <param name="record"></param>
        /// <param name="map"></param>
        public void MapFromDataReader(IRequestContext context, System.Data.IDataReader reader)
        {
            this.Populate(context);

            try
            {
                foreach (SportType sportType in SportTypes)
                {
                    sportType.ReadFromDataReader(context, reader, this.PTMappingSection, this.BettingCommSettingSection);
                }
            }
            catch (Exception ex)
            {
                LogService.Error(ex.Message);
                throw new System.ArgumentException("Mapping configuration format is invalid.", ex);
            }
        }

        #endregion IPTGrid Members

    }
}