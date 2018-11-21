
package com.audit.modules.system.entity;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ContractQuery_In complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ContractQuery_In">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="SOURCESYSTEMID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="SOURCESYSTEMNAME" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="USERID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="USERNAME" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="LASTUPDATETIMEFROM" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="LASTUPDATETIMETO" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ContractQuery_In", propOrder = {
    "sourcesystemid",
    "sourcesystemname",
    "userid",
    "username",
    "lastupdatetimefrom",
    "lastupdatetimeto"
})
public class ContractQueryIn {

    @XmlElement(name = "SOURCESYSTEMID")
    protected String sourcesystemid;
    @XmlElement(name = "SOURCESYSTEMNAME")
    protected String sourcesystemname;
    @XmlElement(name = "USERID")
    protected String userid;
    @XmlElement(name = "USERNAME")
    protected String username;
    @XmlElement(name = "LASTUPDATETIMEFROM")
    protected String lastupdatetimefrom;
    @XmlElement(name = "LASTUPDATETIMETO")
    protected String lastupdatetimeto;

    /**
     * Gets the value of the sourcesystemid property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSOURCESYSTEMID() {
        return sourcesystemid;
    }

    /**
     * Sets the value of the sourcesystemid property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSOURCESYSTEMID(String value) {
        this.sourcesystemid = value;
    }

    /**
     * Gets the value of the sourcesystemname property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSOURCESYSTEMNAME() {
        return sourcesystemname;
    }

    /**
     * Sets the value of the sourcesystemname property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSOURCESYSTEMNAME(String value) {
        this.sourcesystemname = value;
    }

    /**
     * Gets the value of the userid property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUSERID() {
        return userid;
    }

    /**
     * Sets the value of the userid property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUSERID(String value) {
        this.userid = value;
    }

    /**
     * Gets the value of the username property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUSERNAME() {
        return username;
    }

    /**
     * Sets the value of the username property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUSERNAME(String value) {
        this.username = value;
    }

    /**
     * Gets the value of the lastupdatetimefrom property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLASTUPDATETIMEFROM() {
        return lastupdatetimefrom;
    }

    /**
     * Sets the value of the lastupdatetimefrom property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLASTUPDATETIMEFROM(String value) {
        this.lastupdatetimefrom = value;
    }

    /**
     * Gets the value of the lastupdatetimeto property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLASTUPDATETIMETO() {
        return lastupdatetimeto;
    }

    /**
     * Sets the value of the lastupdatetimeto property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLASTUPDATETIMETO(String value) {
        this.lastupdatetimeto = value;
    }

}
