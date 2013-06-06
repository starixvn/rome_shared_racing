namespace Fanex.PTRacing.BusinessObjects
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Web;
    using Fanex.Logging;
    using Fanex.PTRacing.Services;

    public class Customer : ICustomer
    {
        public int CustId { get; set; }

        public string UserName { get; set; }

        public string NewUserName { get; set; }

        public string Password { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public int Creator { get; set; }

        public string Phone { get; set; }

        public string MobilePhone { get; set; }

        public string Email { get; set; }

        public string Fax { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Country { get; set; }

        public string Postal { get; set; }

        public string TransferOption { get; set; }

        public decimal Credit { get; set; }

        public decimal MinCredit { get; set; }

        public decimal MaxCredit { get; set; }

        public decimal MemberMaxCredit { get; set; }

        public decimal MemberMinCredit { get; set; }

        public string SiteName { get; set; }

        public int CurrencyId { get; set; }

        public string Group { get; set; }

        public bool IsInternal { get; set; }

        public int SRecommend { get; set; }

        public int MRecommend { get; set; }

        public int ARecommend { get; set; }

        public string Language { get; set; }

        public bool DisableAutoMasterPt { get; set; }

        public IPTGrid<SportType> Settings { get; set; }

        public Customer()
        {
            Password = string.Empty;
            Settings = new PTGrid();
        }

        public Hashtable MapToSpParameters(IRequestContext context, ICustomer oldSettings)
        {
            var parameters = new Hashtable();
            try
            {              
                Settings.MapToSpParameters(parameters, context, oldSettings.Settings.SportTypes);
            }
            catch (Exception ex)
            {
                LogService.Error(ex.Message);
                throw new System.ArgumentException("Mapping configuration format is invalid.", ex);
            }

            return parameters;
        }

        public void MapToSpUpdateMultipleParameters(ref Hashtable parameters, Hashtable updateParameters, bool isUpdateBettingLimit)
        {
            try
            {
                //// Map BettingLimit to Sp Parameters
                //if (isUpdateBettingLimit)
                //{
                //    BettingCommSetting.MapToSpUpdateMultipleParameters(ref parameters, updateParameters);
                //}

                // Map PT to Sp Parameters
                //Settings.MapToSpUpdateMultipleParameters(ref parameters, updateParameters, isUpdateBettingLimit);
            }
            catch (Exception ex)
            {
                LogService.Error(ex.Message);
                throw new System.ArgumentException("Mapping configuration format is invalid.", ex);
            }

        }
        private void MapToSpParametersCustomerInfo(Hashtable parameters, IRequestContext context)
        {
            parameters.Add("userid", context.CustId);
            parameters.Add("custid", CustId);
            parameters.Add("username", UserName == null ? string.Empty : UserName);
            parameters.Add("userpwd", Password);
            parameters.Add("address", Address == null ? string.Empty : HttpUtility.HtmlDecode(Address));
            parameters.Add("postal", Postal == null ? string.Empty : HttpUtility.HtmlDecode(Postal));
            parameters.Add("city", City == null ? string.Empty : HttpUtility.HtmlDecode(City));
            parameters.Add("state", State == null ? string.Empty : HttpUtility.HtmlDecode(State));
            parameters.Add("country", Country == null ? string.Empty : HttpUtility.HtmlDecode(Country));
            parameters.Add("lastname", LastName == null ? string.Empty : HttpUtility.HtmlDecode(LastName));
            parameters.Add("firstname", FirstName == null ? string.Empty : HttpUtility.HtmlDecode(FirstName));
            parameters.Add("email", Email == null ? string.Empty : HttpUtility.HtmlDecode(Email));
            parameters.Add("phone", Phone == null ? string.Empty : HttpUtility.HtmlDecode(Phone));
            parameters.Add("mobilephone", MobilePhone == null ? string.Empty : HttpUtility.HtmlDecode(MobilePhone));
            parameters.Add("fax", Fax == null ? string.Empty : HttpUtility.HtmlDecode(Fax));
            parameters.Add("credit", Credit);
            parameters.Add("subaccid", context.SubAccId);
            if (context.RoleId == (int)CustomerRole.Master && context.TargetRoleId == (int)CustomerRole.Agent)
            {
                parameters.Add("maxcredit", MemberMaxCredit);
            }
            else
            {
                parameters.Add("maxcredit", MaxCredit);
            }

            parameters.Add("srecommend", SRecommend);
            parameters.Add("mrecommend", context.CustId);
            parameters.Add("recommend", context.CustId);
            parameters.Add("language", Language == null ? string.Empty : Language);
            parameters.Add("ip", context.IP);
            parameters.Add("site", SiteName == null ? string.Empty : SiteName);
            parameters.Add("sitename", SiteName == null ? string.Empty : SiteName); // For parameter of Add New Agent
            parameters.Add("currency", this.CurrencyId > 0 ? this.CurrencyId.ToString() : string.Empty);
            parameters.Add("isinternal", IsInternal);
            parameters.Add("transferoption", TransferOption);
            parameters.Add("ugroup", Group);
            parameters.Add("creator", context.AdminId);
        }

        #region ReadFromDataRecord

        /// <summary>
        /// Set data reader to object Customer
        /// </summary>
        /// <param name="context"></param>
        /// <param name="reader"></param>
        public void ReadFromDataRecord(IRequestContext context, System.Data.IDataReader reader)
        {
            // Customer Information
            SRecommend = context.CustId;
            Creator = context.CustId;
            CustId = context.TargetCustId;

            UserName = string.Format("{0}", reader["username"]);            
            LastName =  string.Format("{0}", reader["lastname"]);
            FirstName = string.Format("{0}", reader["firstname"]);
            Phone = string.Format("{0}", reader["phone"]);
            MobilePhone = string.Format("{0}", reader["mobilephone"]);
            Fax = string.Format("{0}", reader["fax"]);
            
            Language = context.LangKey;
            CurrencyId = reader.HasColumn("currency") ? int.Parse(reader["currency"].ToString()) : 0;
            DisableAutoMasterPt = reader.HasColumn("disableautompt") ? bool.Parse(reader["disableautompt"].ToString()) : true;
            // PTGrid
            Settings.MapFromDataReader(context, reader);
        }
               

        #endregion ReadFromDataRecord

        public void InitDefaultValue()
        {
            // Customer Info
            this.UserName = string.Empty;
            this.Password = string.Empty;
            this.FirstName = string.Empty;
            this.LastName = string.Empty;
            this.Phone = string.Empty;
            this.MobilePhone = string.Empty;
            this.Email = string.Empty;
            this.Fax = string.Empty;
            this.Address = string.Empty;
            this.City = string.Empty;
            this.State = string.Empty;
            this.Country = string.Empty;
            this.Postal = string.Empty;
            this.Language = string.Empty;
            this.IsInternal = false;
            this.Settings.Populate(null);

        }
    }
}