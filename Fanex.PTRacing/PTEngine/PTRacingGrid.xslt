<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:strip-space elements="*" />
  <xsl:output method="text" omit-xml-declaration="yes" indent="no"/>
  <xsl:template match="/">
    var grid = {
    name: '<xsl:value-of select="PTGrid/@name" />',
    sportTypes:[
    <xsl:for-each select="PTGrid/sportTypes/sportType">
      <xsl:if test="position() > 1">,</xsl:if>
      {
      id:<xsl:value-of select="@id"/>,
      name:'<xsl:value-of select="@name"/>',
      isHide:'<xsl:value-of select="@isHide"/>',
      <xsl:if test="@collapsed">
        collapsed:<xsl:value-of select="@collapsed"/>,
      </xsl:if>
      betTypeGroups:[
      <xsl:for-each select="betTypeGroups/betTypeGroup">
        <xsl:if test="position() > 1">,</xsl:if>
        {
        id:<xsl:value-of select="@id"/>,
        name:'<xsl:value-of select="@name"/>',
        isHide:'<xsl:value-of select="@isHide"/>',
        allowCurrencies:'<xsl:value-of select="@allowCurrencies"/>',
        bettingCommSetting: bettingCommSetting,
        betTypes:[
        <xsl:for-each select="betTypes/betType">
          <xsl:if test="not(@visible)">
            <xsl:if test="position() > 1">,</xsl:if>
            {
            id:<xsl:value-of select="@id"/>,
            name:'<xsl:value-of select="@name"/>',
            pt:pt
            }
          </xsl:if>
        </xsl:for-each>
        }
      </xsl:for-each>
      ]
      }
    </xsl:for-each>
    ]
    }
  </xsl:template>
</xsl:stylesheet>