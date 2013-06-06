namespace Fanex.PTRacing.BusinessObjects
{
    public interface IXMLObject
    {
        /// <summary>
        /// Convert a Element of XML File to Object
        /// </summary>
        /// <param name="element"></param>
        void Map(System.Xml.Linq.XElement element);
    }
}