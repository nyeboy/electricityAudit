
package com.audit.modules.system.entity;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ContractQuery_Out complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ContractQuery_Out">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="ERRORFLAG" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ERRORMESSAGE" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ContractInfoItems" type="{http://tempuri.org/}ArrayOfContractQuery_OutItem" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ContractQuery_Out", propOrder = {
    "errorflag",
    "errormessage",
    "contractInfoItems"
})
public class ContractQueryOut {

    @XmlElement(name = "ERRORFLAG")
    protected String errorflag;
    @XmlElement(name = "ERRORMESSAGE")
    protected String errormessage;
    @XmlElement(name = "ContractInfoItems")
    protected ArrayOfContractQueryOutItem contractInfoItems;

    /**
     * Gets the value of the errorflag property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getERRORFLAG() {
        return errorflag;
    }

    /**
     * Sets the value of the errorflag property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setERRORFLAG(String value) {
        this.errorflag = value;
    }

    /**
     * Gets the value of the errormessage property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getERRORMESSAGE() {
        return errormessage;
    }

    /**
     * Sets the value of the errormessage property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setERRORMESSAGE(String value) {
        this.errormessage = value;
    }

    /**
     * Gets the value of the contractInfoItems property.
     * 
     * @return
     *     possible object is
     *     {@link ArrayOfContractQueryOutItem }
     *     
     */
    public ArrayOfContractQueryOutItem getContractInfoItems() {
        return contractInfoItems;
    }

    /**
     * Sets the value of the contractInfoItems property.
     * 
     * @param value
     *     allowed object is
     *     {@link ArrayOfContractQueryOutItem }
     *     
     */
    public void setContractInfoItems(ArrayOfContractQueryOutItem value) {
        this.contractInfoItems = value;
    }

}
