namespace Fanex.PTRacing.BusinessObjects
{
    using System.Collections;
    using System.Collections.Generic;

    /// <summary>
    /// All PT settings. Auto mapping PTMappingSection.config
    /// </summary>
    public interface IPTGrid<T> where T : ISportType<BetTypeGroup>
    {
        string Name { get; set; }

        IList<T> SportTypes { get; set; }

        /// <summary>
        ///
        /// </summary>
        /// <param name="context"></param>
        /// <param name="map"></param>
        void MapToSpParameters(Hashtable parameters, IRequestContext context, IList<SportType> oldSettings);

        /// <summary>
        ///
        /// </summary>
        /// <param name="context"></param>
        /// <param name="map"></param>
        void MapToSpUpdateMultipleParameters(ref Hashtable parameters, Hashtable updateParameters, bool isUpdateBettingLimit, IRequestContext context);

        /// <summary>
        ///
        /// </summary>
        /// <param name="context"></param>
        /// <param name="record"></param>
        /// <param name="map"></param>
        void MapFromDataReader(IRequestContext context, System.Data.IDataReader reader);

        /// <summary>
        ///
        /// </summary>
        /// <param name="excludeInvisibleBetTypes"></param>
        void Populate(IRequestContext context);
    }
}