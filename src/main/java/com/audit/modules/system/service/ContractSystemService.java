package com.audit.modules.system.service;

import com.audit.modules.system.entity.ContractQueryIn;
import com.audit.modules.system.entity.ContractQueryOut;
import com.audit.modules.system.entity.ContractQueryOutItem;
import com.audit.modules.system.entity.ContractQueryRun;
import com.audit.modules.system.entity.IContractQuery;
/*import com.oss.model.Contract;
import com.oss.model.ContractTmp;
import com.sun.org.apache.xpath.internal.operations.And;
import com.thoughtworks.xstream.XStream;*/
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 合同系统SOAP对接service
 * Created by yezhang on 2/13/2017.
 */
@Service
public class ContractSystemService {
    @Autowired
 /*   private ContractDataService contractDataService;*/



    /**
     * 从移动合同系统获取合同信息并保存到数据库
     *
     * @param fromDateString 格式必须如下  2015-06-29 00:00:00
     * @param toDateString   格式必须如下  2015-06-29 00:00:00
     * @return
     */
   /* public String getContractInfoAndSaveToDB(String fromDateString, String toDateString) {

        ContractQueryRun contractQueryRun = new ContractQueryRun();
        IContractQuery contractQuery = contractQueryRun.getBasicHttpBindingIContractQuery();
        ContractQueryIn contractQueryIn = new ContractQueryIn();
        contractQueryIn.setSOURCESYSTEMID("DFJH_WGZX_CW");
        contractQueryIn.setSOURCESYSTEMNAME("四川移动电费稽核系统");
        contractQueryIn.setUSERID("SC_WGZX");
        contractQueryIn.setUSERNAME("四川移动网络管理中心");
        contractQueryIn.setLASTUPDATETIMEFROM(fromDateString);
        contractQueryIn.setLASTUPDATETIMETO(toDateString);
        String message = null;

        ContractQueryOut contractQueryOut = contractQuery.contractQuerySrvRun(contractQueryIn);
        List<ContractQueryOutItem> contractQueryOutItem = contractQueryOut.getContractInfoItems().getContractQueryOutItem();
        for (ContractQueryOutItem result :
                contractQueryOutItem) {
            saveToDataBase(result.getContractInfo());
           message = result.getContractInfo();
        }
        return message;
       // return "success";
    }*/

   /* public void saveToDataBase(String xmlContract) {
        *//**
         * 由于 xstream 插件的限制，节点中有 '_' 的属性不能获取，所以必须将传入的 xml格式的 字符串替换掉
         *//*
        String new1 = xmlContract.replaceAll("contract_number", "contractNumber");
        String new2 = new1.replaceAll("contract_title", "contractTitle");
        String new3 = new2.replaceAll("execution_begin_date", "executionBeginDate");
        String new4 = new3.replaceAll("execution_end_date", "executionEndDate");
        String new5 = new4.replaceAll("contract_company_code", "contractCompanyCode");
        String new6 = new5.replaceAll("Company_Name", "companyName");
        String new7 = new6.replaceAll("contract_status", "contractStatus");


       // contractDataService.save(contractData);

        String ContractID = getKeyValue("ContractID", new7);
        String contractNumber = getKeyValue("contractNumber", new7);
        String contractTitle = getKeyValue("contractTitle", new7);
        String executionBeginDate = getKeyValue("executionBeginDate", new7);
        String executionEndDate = getKeyValue("executionEndDate", new7);
        String contractCompanyCode = getKeyValue("contractCompanyCode", new7);
        String companyName = getKeyValue("companyName", new7);
        String contractStatus = getKeyValue("contractStatus", new7);
        String LastUpdateTime = getKeyValue("LastUpdateTime", new7);
        
        // 写入临时表
        ContractTmp contracttmp = new ContractTmp();
        contracttmp.set("contract_id", ContractID);
        contracttmp.set("contract_number", contractNumber);
        contracttmp.set("contract_name", contractTitle);
        contracttmp.set("eip_code", contractCompanyCode);
        contracttmp.set("eip_company_name", companyName);
        if(executionBeginDate != null && !executionBeginDate.equalsIgnoreCase(""))
        	contracttmp.set("execution_begin_date", executionBeginDate);
        if(executionEndDate != null && !executionEndDate.equalsIgnoreCase(""))
        	contracttmp.set("execution_end_date", executionEndDate);
        
        contracttmp.save();
        
        // 合同不存在，则写入数据库
        Contract contractinfo = Contract.ct.findFirst("select * from t_contract where contract_id= ?", ContractID);
        if(contractinfo != null && contractinfo.getStr("rentail_name") != null) {
        	System.out.println("【" + contractTitle + "】已经修改了，忽略导入");
        	return;
        }
        if(contractinfo != null ){
        	if(companyName.equalsIgnoreCase(contractinfo.getStr("eip_company_name")) ) {
            	contractinfo.set("eip_code", contractCompanyCode);
            	contractinfo.set("eip_company_name", companyName);
            	contractinfo.update();
            	System.out.println("修改合同:" + ContractID);
            }else{
            	System.out.println("【" + contractTitle + "】已经存在了，忽略导入");
            	return;
            }
        	
        }else{// 不存在
        	Contract contract = new Contract();
            contract.set("contract_id", ContractID);
            contract.set("contract_number", contractNumber);
            contract.set("contract_name", contractTitle);
            contract.set("eip_code", contractCompanyCode);
            contract.set("eip_company_name", companyName);
            if(executionBeginDate != null && !executionBeginDate.equalsIgnoreCase(""))
            	contract.set("execution_begin_date", executionBeginDate);
            if(executionEndDate != null && !executionEndDate.equalsIgnoreCase(""))
            	contract.set("execution_end_date", executionEndDate);
            contract.save();
            
            System.out.println("导入合同:" + ContractID);
        }

      
       
       
      
       
       
		
        
    }*/

    //原本就注释了
/*    <ContractInfoItem ContractID="1003958" ContractNewOppositeSourceType="自行选择-其它"
    		contractNumber="【南充分公司-网络部】20140600001" contractTitle="蓬安德仁医院基站建设场地租赁合同"
    		executionBeginDate="2014-06-10 00:00:00" executionEndDate="2017-06-09 00:00:00" 
    		contractCompanyCode="18" companyName="南充分公司" contractStatus="已归档" 
    		LastUpdateTime="2014-06-12 16:58:38" /><ContractInfoItem ContractID="1004088"
    		ContractNewOppositeSourceType="自行选择-其它" contractNumber="【南充分公司-网络部】20140600001"
    		contractTitle="场地租赁合同" executionBeginDate="2014-05-08 00:00:00"
    		executionEndDate="2017-05-07 00:00:00" contractCompanyCode="18" companyName="南充分公司"
    		contractStatus="已归档" LastUpdateTime="2014-06-16 09:16:20" />
    		<ContractInfoItem ContractID="1004510" ContractNewOppositeSourceType="自行选择-其它"
    		contractNumber="【南充分公司-网络部】20140600001" contractTitle="南部妇幼保健院基站场地租赁合同" 
    		executionBeginDate="2014-06-20 00:00:00" executionEndDate="2016-06-19 00:00:00" 
    		contractCompanyCode="18" companyName="南充分公司" contractStatus="已归档" LastUpdateTime="2014-06-25 09:15:04" />*/
    
    public String getKeyValue(String key, String content) {
    	String value = "";
    	
    	int startPos = content.indexOf(key);
    	if(startPos >= 0) {
    		int endPos = content.indexOf( "\"", startPos + key.length() + 2);
    		if(endPos > 0 && endPos > startPos) {
    			value = content.substring(startPos + key.length() + 2, endPos);
    		}
    	}
    	
    	return value;
    }
}
