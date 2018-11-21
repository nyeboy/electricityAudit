
package com.audit.modules.system.entity;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ArrayOfContractQuery_OutItem complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ArrayOfContractQuery_OutItem">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="ContractQuery_OutItem" type="{http://tempuri.org/}ContractQuery_OutItem" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ArrayOfContractQuery_OutItem", propOrder = {
    "contractQueryOutItem"
})
public class ArrayOfContractQueryOutItem {

    @XmlElement(name = "ContractQuery_OutItem", nillable = true)
    protected List<ContractQueryOutItem> contractQueryOutItem;

    /**
     * Gets the value of the contractQueryOutItem property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the contractQueryOutItem property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getContractQueryOutItem().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ContractQueryOutItem }
     * 
     * 
     */
    public List<ContractQueryOutItem> getContractQueryOutItem() {
        if (contractQueryOutItem == null) {
            contractQueryOutItem = new ArrayList<ContractQueryOutItem>();
        }
        return this.contractQueryOutItem;
    }

}
