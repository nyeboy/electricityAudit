
package com.audit.modules.system.entity;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ContractQuery_OutItem complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ContractQuery_OutItem">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="ContractInfo" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ContractQuery_OutItem", propOrder = {
    "contractInfo"
})
public class ContractQueryOutItem {

    @XmlElement(name = "ContractInfo")
    protected String contractInfo;

    /**
     * Gets the value of the contractInfo property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getContractInfo() {
        return contractInfo;
    }

    /**
     * Sets the value of the contractInfo property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setContractInfo(String value) {
        this.contractInfo = value;
    }

}
