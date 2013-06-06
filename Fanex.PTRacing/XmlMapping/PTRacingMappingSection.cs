namespace Fanex.PTRacing.XmlMapping
{
    using System.Configuration;

    public class PTRacingMappingSection : ConfigurationSection
    {
        [ConfigurationProperty("Mapping", IsDefaultCollection = true)]
        [ConfigurationCollection(typeof(PTRacingMappingCollection),
            AddItemName = "add")]
        public PTRacingMappingCollection Mapping
        {
            get
            {
                var collection =
                    (PTRacingMappingCollection)base["Mapping"];
                return collection;
            }
        }

        public static PTRacingMappingSection Instance
        {
            get
            {
                var section =
                 ConfigurationManager.GetSection("PTRacingMappingSection") as PTRacingMappingSection;
                return section;
            }
        }
    }

    public class PTRacingMappingCollection : ConfigurationElementCollection
    {
        public PTRacingMappingCollection()
        {
        }

        public override ConfigurationElementCollectionType CollectionType
        {
            get
            {
                return ConfigurationElementCollectionType.AddRemoveClearMap;
            }
        }

        public void Add(PTRacingMappingElement mappingElement)
        {
            this.BaseAdd(mappingElement);
        }

        protected override void BaseAdd(ConfigurationElement element)
        {
            this.BaseAdd(element, false);
        }

        public PTRacingMappingElement this[int index]
        {
            get
            {
                return (PTRacingMappingElement)this.BaseGet(index);
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

        new public PTRacingMappingElement this[string name]
        {
            get
            {
                return (PTRacingMappingElement)this.BaseGet(name);
            }
        }

        public int IndexOf(PTRacingMappingElement mappingElement)
        {
            return this.BaseIndexOf(mappingElement);
        }

        protected override sealed ConfigurationElement CreateNewElement()
        {
            return new PTRacingMappingElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((PTRacingMappingElement)element).MappingTarget + ((PTRacingMappingElement)element).Type + ((PTRacingMappingElement)element).RoleId + ((PTRacingMappingElement)element).TargetRoleId + ((PTRacingMappingElement)element).FormId + ((PTRacingMappingElement)element).Pattern;
        }
    }

    public class PTRacingMappingElement : ConfigurationElement
    {
        public PTRacingMappingElement()
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

        [ConfigurationProperty("RoleId", IsRequired = false)]
        public string RoleId
        {
            get
            {
                return (string)this["RoleId"];
            }

            set
            {
                this["RoleId"] = value;
            }
        }

        [ConfigurationProperty("TargetRoleId", IsRequired = false)]
        public string TargetRoleId
        {
            get
            {
                return (string)this["TargetRoleId"];
            }

            set
            {
                this["TargetRoleId"] = value;
            }
        }

        [ConfigurationProperty("FormId", IsRequired = false)]
        public string FormId
        {
            get
            {
                return (string)this["FormId"];
            }

            set
            {
                this["FormId"] = value;
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

        [ConfigurationProperty("SportTypeFormat", IsRequired = false)]
        public string SportTypeFormat
        {
            get
            {
                return (string)this["SportTypeFormat"];
            }

            set
            {
                this["SportTypeFormat"] = value;
            }
        }

        [ConfigurationProperty("BettypeFormat", IsRequired = false)]
        public string BettypeFormat
        {
            get
            {
                return (string)this["BettypeFormat"];
            }

            set
            {
                this["BettypeFormat"] = value;
            }
        }

        [ConfigurationProperty("IsLiveFormat", IsRequired = false)]
        public string IsLiveFormat
        {
            get
            {
                return (string)this["IsLiveFormat"];
            }

            set
            {
                this["IsLiveFormat"] = value;
            }
        }

        // Create a SportTypeId" element.
        [ConfigurationProperty("SportTypeId")]
        public SportTypeIdElement SportTypeId
        {
            get
            {
                return (SportTypeIdElement)this["SportTypeId"];
            }

            set
            {
                this["SportTypeId"] = value;
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

        // Create a IsHide element.
        [ConfigurationProperty("IsHide")]
        public IsHideElement IsHide
        {
            get
            {
                return (IsHideElement)this["IsHide"];
            }

            set
            {
                this["IsHide"] = value;
            }
        }
    }

    public class SportTypeIdElement : ConfigurationElement
    {
        public SportTypeIdElement()
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

    public class BetTypeIdElement : ConfigurationElement
    {
        public BetTypeIdElement()
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

    public class IsHideElement : ConfigurationElement
    {
        public IsHideElement()
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