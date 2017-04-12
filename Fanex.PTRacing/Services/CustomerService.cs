// -----------------------------------------------------------------------
// <copyright file="CustomerService.cs" company="Nexcel Solutions">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------
namespace Fanex.PTRacing.Services
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Reflection;
    using Fanex.PTRacing.BusinessObjects;
    using Fanex.PTRacing.DataAccess;
    using System.Configuration;
    /// <summary>
    /// Do action on Customer Setting
    /// </summary>
    public class CustomerService : ICustomerService
    {
        private readonly byte _systemId;

        public CustomerService(byte systemId = 1)
        {
            _systemId = systemId;
        }

        #region ICustomerService Members

        /// <summary>
        /// Gets the customer.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <returns></returns>
        /// <exception cref="System.NotImplementedException">
        /// </exception>
        public ICustomer GetCustomer(IRequestContext context)
        {
            ICustomerDataAccess customerDataAccess = new CustomerDataAccess();

            switch (context.TargetRoleId)
            {
                case Constant.SUPER_ROLEID:
                    return customerDataAccess.Acc_CustomerSelHRSuper_All(context);
                case Constant.MASTER_ROLEID:
                    return customerDataAccess.Acc_CustomerSelHRMaster_All(context);
                case Constant.AGENT_ROLEID:
                    switch (context.RoleId)
                    {
                        case Constant.SUPER_ROLEID:
                            if (context.FormId == FormType.ViewPT)
                            {
                                return customerDataAccess.Acc_CustomerSelHRAgent_SAg(context);
                            }
                            else
                            {
                                return customerDataAccess.Acc_CustomerSelHRAgent_All(context);
                            }
                        case Constant.MASTER_ROLEID:
                            return customerDataAccess.Acc_CustomerSelHRAgent_All(context);
                        default:
                            throw new NotImplementedException();
                    }
                case Constant.MEMBER_ROLEID:
                    switch (context.RoleId)
                    {
                        case Constant.SUPER_ROLEID:
                            return customerDataAccess.Acc_CustomerSelHREditMember_SAg(context);
                        case Constant.MASTER_ROLEID:
                            return customerDataAccess.Acc_CustomerSelHREditMember_MAg(context);
                        case Constant.AGENT_ROLEID:
                            return customerDataAccess.Acc_CustomerSelHRMember_All(context);
                        default:
                            throw new NotImplementedException();
                    }

                default:
                    throw new NotImplementedException();
            }
        }

        /// <summary>
        /// SaveCustomer method
        /// </summary>
        /// <param name="oldSettings">oldSettings param</param>
        /// <param name="newSettings">newSettings param</param>
        /// <param name="context">context param</param>
        /// <param name="parameters">parameters param</param>
        /// <returns>return Result</returns>
        public Result SaveCustomer(ICustomer oldSettings, ICustomer newSettings, IRequestContext context, Hashtable otherSettings)
        {
            var result = new Result();

            switch (context.TargetRoleId)
            {
                case Constant.SUPER_ROLEID:
                    return this.UpdateSuperSettings(oldSettings, newSettings, context);
                case Constant.MASTER_ROLEID:
                    return this.UpdateMasterSettings(oldSettings, newSettings, context, otherSettings);
                case Constant.AGENT_ROLEID:
                    return this.UpdateAgentSettings(oldSettings, newSettings, context, otherSettings);
                case Constant.MEMBER_ROLEID:
                    switch (context.RoleId)
                    {
                        case Constant.SUPER_ROLEID:
                            return this.SuperUpdateMemberSettings(oldSettings, newSettings, context);
                        case Constant.MASTER_ROLEID:
                            return this.MasterUpdateMemberSettings(oldSettings, newSettings, context);
                        case Constant.AGENT_ROLEID:
                            return this.UpdateMemberSettings(oldSettings, newSettings, context);
                        default:
                            throw new NotImplementedException();
                    }

                default:
                    throw new NotImplementedException();
            }
        }
        #endregion ICustomerService Members   

        #region Private functions
        private Result UpdateSuperSettings(ICustomer oldSettings, ICustomer newSettings, IRequestContext context)
        {
            var result = new Result();
            ICustomerDataAccess customerDataAccess = new CustomerDataAccess();

            if (oldSettings != null && oldSettings.Settings.SportTypes.Count > 0 
                && newSettings != null && newSettings.Settings.SportTypes.Count > 0)
            {
                var parameters = new Hashtable();
                parameters = newSettings.MapToSpParameters(context, oldSettings);

                parameters.Add("custid", context.TargetCustId);
                parameters.Add("userid", context.AdminId);
                parameters.Add("subaccid", context.SubAccId);
                parameters.Add("language", context.Language);
                parameters.Add("ip", context.IP);
                parameters.Add("systemid", _systemId);

                if (parameters.Contains("ischanged") && ((bool)parameters["ischanged"]))
                    result = customerDataAccess.Acc_CustomerUpdSuperHR_All(parameters);
            }

            return result;
        }

        private Result UpdateMasterSettings(ICustomer oldSettings, ICustomer newSettings, IRequestContext context, Hashtable otherSettings)
        {
            var result = new Result();
            ICustomerDataAccess customerDataAccess = new CustomerDataAccess();

            if (oldSettings != null && oldSettings.Settings.SportTypes.Count > 0
                && newSettings != null && newSettings.Settings.SportTypes.Count > 0)
            {
                var parameters = new Hashtable();
                parameters = newSettings.MapToSpParameters(context, oldSettings);

                parameters.Add("custid", context.TargetCustId);
                parameters.Add("userid", context.AdminId);
                parameters.Add("subaccid", context.SubAccId);
                parameters.Add("language", context.Language);
                parameters.Add("ip", context.IP);
                parameters.Add("systemid", _systemId);

                if (otherSettings != null && otherSettings.Contains("isupdateallmembers"))
                {
                    parameters.Add("updateallmembers", (bool)otherSettings["isupdateallmembers"]);
                    parameters.Add("newspositiontaking", otherSettings["newspositiontaking"]);
                }

                if (parameters.Contains("ischanged") && ((bool)parameters["ischanged"]))
                    result = customerDataAccess.Acc_CustomerUpdMasterHR_All(parameters);
            }
            return result;
        }

        private Result UpdateAgentSettings(ICustomer oldSettings, ICustomer newSettings, IRequestContext context, Hashtable otherSettings)
        {
            var result = new Result();
            ICustomerDataAccess customerDataAccess = new CustomerDataAccess();

            if (oldSettings != null && oldSettings.Settings.SportTypes.Count > 0
                && newSettings != null && newSettings.Settings.SportTypes.Count > 0)
            {
                var parameters = new Hashtable();
                parameters = newSettings.MapToSpParameters(context, oldSettings);

                parameters.Add("custid", context.TargetCustId);
                parameters.Add("userid", context.AdminId);
                parameters.Add("subaccid", context.SubAccId);
                parameters.Add("language", context.Language);
                parameters.Add("ip", context.IP);
                parameters.Add("systemid", _systemId);

                if (otherSettings != null  &&otherSettings.Contains("isupdateallmembers"))
                {
                    parameters.Add("updateallmembers", (bool)otherSettings["isupdateallmembers"]);
                    parameters.Add("newmpositiontaking", otherSettings["newmpositiontaking"]);
                }

                if (parameters.Contains("ischanged") && ((bool)parameters["ischanged"]))
                    result = customerDataAccess.Acc_CustomerUpdAgentHR_All(parameters);
            }
            return result;
        }

        private Result UpdateMemberSettings(ICustomer oldSettings, ICustomer newSettings, IRequestContext context)
        {
            var result = new Result();
            ICustomerDataAccess customerDataAccess = new CustomerDataAccess();

            if (oldSettings != null && oldSettings.Settings.SportTypes.Count > 0
                && newSettings != null && newSettings.Settings.SportTypes.Count > 0)
            {
                var parameters = new Hashtable();
                parameters = newSettings.MapToSpParameters(context, oldSettings);

                parameters.Add("custid", context.TargetCustId);
                parameters.Add("userid", context.AdminId);
                parameters.Add("subaccid", context.SubAccId);
                parameters.Add("language", context.Language);
                parameters.Add("ip", context.IP);
                parameters.Add("systemid", _systemId);

                if (parameters.Contains("ischanged") && ((bool)parameters["ischanged"]))
                    result = customerDataAccess.Acc_CustomerUpdMemberHR_All(parameters);
            }
            return result;
        }

        private Result SuperUpdateMemberSettings(ICustomer oldSettings, ICustomer newSettings, IRequestContext context)
        {
            var result = new Result();
            ICustomerDataAccess customerDataAccess = new CustomerDataAccess();

            if (oldSettings != null && oldSettings.Settings.SportTypes.Count > 0
                && newSettings != null && newSettings.Settings.SportTypes.Count > 0)
            {
                var parameters = new Hashtable();
                parameters = newSettings.MapToSpParameters(context, oldSettings);

                parameters.Add("custid", context.TargetCustId);
                parameters.Add("userid", context.AdminId);
                parameters.Add("subaccid", context.SubAccId);
                parameters.Add("language", context.Language);
                parameters.Add("ip", context.IP);
                parameters.Add("systemid", _systemId);

                if (parameters.Contains("ischanged") && ((bool)parameters["ischanged"]))
                    result = customerDataAccess.Acc_CustomerUpdMemberHR_SAg(parameters);
            }

            return result;
        }

        private Result MasterUpdateMemberSettings(ICustomer oldSettings, ICustomer newSettings, IRequestContext context)
        {
            var result = new Result();
            ICustomerDataAccess customerDataAccess = new CustomerDataAccess();

            if (oldSettings != null && oldSettings.Settings.SportTypes.Count > 0
                && newSettings != null && newSettings.Settings.SportTypes.Count > 0)
            {
                var parameters = new Hashtable();
                parameters = newSettings.MapToSpParameters(context, oldSettings);

                parameters.Add("custid", context.TargetCustId);
                parameters.Add("userid", context.AdminId);
                parameters.Add("subaccid", context.SubAccId);
                parameters.Add("language", context.Language);
                parameters.Add("ip", context.IP);
                parameters.Add("systemid", _systemId);

                if (parameters.Contains("ischanged") && ((bool)parameters["ischanged"]))
                    result = customerDataAccess.Acc_CustomerUpdMemberHR_MAg(parameters);
            }

            return result;
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
        #endregion
    }
}
