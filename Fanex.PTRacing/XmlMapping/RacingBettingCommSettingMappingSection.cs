namespace Fanex.PTRacing.XmlMapping
{
    using System.Configuration;

    public class RacingBettingCommSettingMappingSection : ConfigurationSection
    {
        [ConfigurationProperty("BettingCommSettingMapping", IsDefaultCollection = true)]
        [ConfigurationCollection(typeof(BettingCommSettingMappingCollection),
            AddItemName = "add")]
        public BettingCommSettingMappingCollection BetSettingCollection
        {
            get
            {
                var collection =
                    (BettingCommSettingMappingCollection)base["BettingCommSettingMapping"];
                return collection;
            }
        }

        public static RacingBettingCommSettingMappingSection Instance
        {
            get
            {
                var section =
                 ConfigurationManager.GetSection("RacingBettingCommSettingMappingSection") as RacingBettingCommSettingMappingSection;
                return section;
            }
        }
    }

    /// <summary>
    /// Betting Limit Mapping
    /// </summary>
    public class BettingCommSettingMappingCollection : ConfigurationElementCollection
    {
        public BettingCommSettingMappingCollection()
        {
        }

        public override ConfigurationElementCollectionType CollectionType
        {
            get
            {
                return ConfigurationElementCollectionType.AddRemoveClearMap;
            }
        }

        public void Add(BettingCommSettingElement betSettingElement)
        {
            this.BaseAdd(betSettingElement);
        }

        protected override void BaseAdd(ConfigurationElement element)
        {
            this.BaseAdd(element, false);
        }

        public BettingCommSettingElement this[int index]
        {
            get
            {
                return (BettingCommSettingElement)this.BaseGet(index);
            }

            set
            {
                if (this.BaseGet(index) != null)
                {
                    this.BaseRemoveAt(index);
                }

                this.BaseAdd(index, value);
            }
        }

        new public BettingCommSettingElement this[string name]
        {
            get
            {
                return (BettingCommSettingElement)this.BaseGet(name);
            }
        }

        public int IndexOf(BettingCommSettingElement betSettingElement)
        {
            return this.BaseIndexOf(betSettingElement);
        }

        protected override sealed ConfigurationElement CreateNewElement()
        {
            return new BettingCommSettingElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((BettingCommSettingElement)element).MappingTarget + ((BettingCommSettingElement)element).TargetRoleId + ((BettingCommSettingElement)element).Pattern + ((BettingCommSettingElement)element).Type;
        }
    }

    /// <summary>
    ///
    /// </summary>
    public class BettingCommSettingElement : ConfigurationElement
    {
        public BettingCommSettingElement()
        {
        }

        [ConfigurationProperty("Type", IsRequired = false)]
        public string Type
        {
            get
            {
                return (string)this["Type"];
            }

            set
            {
                this["Type"] = value;
            }
        }

        [ConfigurationProperty("TargetRoleId", IsRequired = false)]
        public int TargetRoleId
        {
            get
            {
                return (int)this["TargetRoleId"];
            }

            set
            {
                this["TargetRoleId"] = value;
            }
        }

        [ConfigurationProperty("MappingTarget", IsRequired = false)]
        public string MappingTarget
        {
            get
            {
                return (string)this["MappingTarget"];
            }

            set
            {
                this["MappingTarget"] = value;
            }
        }

        [ConfigurationProperty("Pattern", IsRequired = false)]
        public string Pattern
        {
            get
            {
                return (string)this["Pattern"];
            }

            set
            {
                this["Pattern"] = value;
            }
        }

        // Create a SportId element.
        [ConfigurationProperty("SportId")]
        public SportIdElement SportId
        {
            get
            {
                return (SportIdElement)this["SportId"];
            }

            set
            {
                this["SportId"] = value;
            }
        }

        // Create a BetTypeId element.
        [ConfigurationProperty("BetTypeId")]
        public BetTypeIdElement BetTypeId
        {
            get
            {
                return (BetTypeIdElement)this["BetTypeId"];
            }

            set
            {
                this["BetTypeId"] = value;
            }
        }
    }

    /// <summary>
    ///
    /// </summary>
    public class SportIdElement : ConfigurationElement
    {
        public SportIdElement()
        {
        }

        [ConfigurationProperty("Format", IsRequired = false)]
        public string Format
        {
            get
            {
                return (string)this["Format"];
            }

            set
            {
                this["Format"] = value;
            }
        }

        [ConfigurationProperty("OmitWhenDefault", IsRequired = false)]
        public string OmitWhenDefault
        {
            get
            {
                return (string)this["OmitWhenDefault"];
            }

            set
            {
                this["OmitWhenDefault"] = value;
            }
        }
    }
}