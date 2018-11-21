package com.audit.modules.workflow.service.impl;

import javax.xml.stream.XMLInputFactory;

/**
 * XML解析器工厂
 * 
 * @author luoyun
 */
public class WorkflowXMLInputFactory {
	
	/**
	 * 创建XML解析工厂
	 * 
	 * @return
	 */
	public static XMLInputFactory createSafeXmlInputFactory() {
		XMLInputFactory xif = XMLInputFactory.newInstance();
		if (xif.isPropertySupported(XMLInputFactory.IS_REPLACING_ENTITY_REFERENCES)) {
			xif.setProperty(XMLInputFactory.IS_REPLACING_ENTITY_REFERENCES, false);
		}

		if (xif.isPropertySupported(XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES)) {
			xif.setProperty(XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES, false);
		}

		if (xif.isPropertySupported(XMLInputFactory.SUPPORT_DTD)) {
			xif.setProperty(XMLInputFactory.SUPPORT_DTD, false);
		}
		return xif;
	}
}
