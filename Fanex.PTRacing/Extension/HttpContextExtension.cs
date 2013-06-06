namespace Fanex.PTRacing
{
    using System;
    using System.Web.UI;
    using System.Web;

    public static class HttpContextExtension
    {
        public static string GetWebResourceUrl(this HttpContext context, string resource)
        {
            return _WebUtils.GetWebResourceUrl(resource);
        }

        public static string GetWebResourceUrl(this HttpContext context, Type type, string resource)
        {
            return _WebUtils.GetWebResourceUrl(type, resource);
        }

        public static string GenerateStyleSheetLink(string resource)
        {
            string linkCss = "<link href='{0}' rel='stylesheet' type='text/css' />";
            return string.Format(linkCss, resource);
        }

        public static string GenerateScriptLink(string resource)
        {
            string linkScript = "<script src='{0}' type='text/javascript'></script>";
            return string.Format(linkScript, resource);
        }
        
        public static class _WebUtils
        {
            static _WebUtils()
            {
                cachedPage = new Page();
            }

            private static Page cachedPage;

            public static string GetWebResourceUrl(string resource)
            {
                return cachedPage.ClientScript.GetWebResourceUrl(typeof(HttpContextExtension), resource);
            }

            public static string GetWebResourceUrl(Type type, string resource)
            {
                return cachedPage.ClientScript.GetWebResourceUrl(type, resource);
            }
        }
    }
}