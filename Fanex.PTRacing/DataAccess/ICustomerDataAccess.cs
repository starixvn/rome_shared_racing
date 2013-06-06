namespace Fanex.PTRacing.DataAccess
{
    using System.Collections;
    using Fanex.PTRacing.BusinessObjects;

    public interface ICustomerDataAccess
    {
        #region Get Customer Information
        /// <summary>
        /// Get Customer For Edit Super
        /// </summary>
        /// <param name="context">The context of Edit Super</param>
        /// <returns>Return a ICustomer contains value default of Super</returns>
        ICustomer Acc_CustomerSelHRSuper_All(IRequestContext requestContext);

        /// <summary>
        /// Get Customer For Edit Master
        /// </summary>
        /// <param name="context">The context of Edit Master</param>
        /// <returns>Return a ICustomer contains value default of Master</returns>
        ICustomer Acc_CustomerSelHRMaster_All(IRequestContext requestContext);

        /// <summary>
        /// Get Customer For Edit Agent By Super
        /// </summary>
        /// <param name="context">The context of Edit Agent</param>
        /// <returns>Return a ICustomer contains value default of Agent</returns>
        ICustomer Acc_CustomerSelHRAgent_SAg(IRequestContext requestContext);

        /// <summary>
        /// Get Customer For Edit Agent
        /// </summary>
        /// <param name="context">The context of Edit Agent</param>
        /// <returns>Return a ICustomer contains value default of Agent</returns>
        ICustomer Acc_CustomerSelHRAgent_All(IRequestContext requestContext);

        /// <summary>
        /// Get Customer For Edit Member
        /// </summary>
        /// <param name="context">The context of Edit Member</param>
        /// <returns>Return a ICustomer contains value default of Member</returns>
        ICustomer Acc_CustomerSelHRMember_All(IRequestContext requestContext);

        /// <summary>
        /// Get Customer For Super Edit Member
        /// </summary>
        /// <param name="context">The context of Edit Member</param>
        /// <returns>Return a ICustomer contains value default of Member</returns>
        ICustomer Acc_CustomerSelHREditMember_SAg(IRequestContext requestContext);

        /// <summary>
        /// Get Customer For Master Edit Member
        /// </summary>
        /// <param name="context">The context of Edit Member</param>
        /// <returns>Return a ICustomer contains value default of Member</returns>
        ICustomer Acc_CustomerSelHREditMember_MAg(IRequestContext requestContext);
        #endregion Get Customer Information

        #region Update customer's pt settings
        /// <summary>
        /// Update Super's setting
        /// </summary>        
        Result Acc_CustomerUpdSuperHR_All(Hashtable parameters);
        /// <summary>
        /// Update Master's setting
        /// </summary>        
        Result Acc_CustomerUpdMasterHR_All(Hashtable parameters);
        /// <summary>
        /// Update Agent's setting
        /// </summary>        
        Result Acc_CustomerUpdAgentHR_All(Hashtable parameters);
        /// <summary>
        /// Update Member's setting
        /// </summary>        
        Result Acc_CustomerUpdMemberHR_All(Hashtable parameters);
        /// <summary>
        /// Update Super on Member setting
        /// </summary>        
        Result Acc_CustomerUpdMemberHR_SAg(Hashtable parameters);
        /// <summary>
        /// Update Master on Member setting
        /// </summary>        
        Result Acc_CustomerUpdMemberHR_MAg(Hashtable parameters);
        #endregion

    }
}