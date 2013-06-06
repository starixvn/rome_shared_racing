namespace Fanex.PTRacing.Services
{
    using Fanex.PTRacing.BusinessObjects;
using System.Collections;

    /// <summary>
    /// Do action on Customer Setting
    /// </summary>
    public interface ICustomerService
    {
        /// <summary>
        /// Gets the customer.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <returns></returns>
        ICustomer GetCustomer(IRequestContext context);

        /// <summary>
        /// SaveCustomer method
        /// </summary>
        /// <param name="oldSettings">oldSettings param</param>
        /// <param name="newSettings">newSettings param</param>
        /// <param name="context">context param</param>
        /// <param name="parameters">parameters param</param>
        /// <returns>return Result</returns>
        Result SaveCustomer(ICustomer oldSettings, ICustomer newSettings, IRequestContext context, Hashtable otherSettings);

    }
}
