package com.audit.modules.data.service.impl;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.List;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.audit.modules.common.utils.ConfigUtil;
import com.audit.modules.common.utils.XmlUtil;
import com.audit.modules.data.dao.DataDao;
import com.audit.modules.data.entity.DptsPo;
import com.audit.modules.data.entity.EmpDptPo;
import com.audit.modules.data.entity.EmpDutyPo;
import com.audit.modules.data.entity.EmpRolesPo;
import com.audit.modules.data.entity.EmployeePo;
import com.audit.modules.data.entity.EmpsPo;
import com.audit.modules.data.entity.OrgDetailPo;
import com.audit.modules.data.entity.OrganizationPo;
import com.audit.modules.data.service.DataService;

@Transactional
@Service
public class DataServiceImpl implements DataService {

//	private final static String ORG_XML_PATH = "organization.xml";
//	private final static String DPT_XML_PATH = "GetDptsBy.xml";
//	private final static String EMP_XML_PATH = "GetEmpsBy.xml";
	
	
	@Autowired
	private DataDao dataDao;
	
	@Override
	public Boolean importEleContract() {
//		String path = this.getClass().getClassLoader().getResource("/").getPath();
//		String xml_path = "data/"+EMP_XML_PATH;
		/*Document doc = null;
		SAXReader reader = null;
		reader = new SAXReader();
		doc = reader.read(new File(path+"data/"+"GetDptsBy.xml"));
		Element root = doc.getRootElement();
		Object obj = parse(root); 
		System.out.println(obj);
		
		DptsPo dptsPo = (DptsPo)convertXmlFileToObject(DptsPo.class,path+"data/"+"GetDptsBy.xml");
		System.out.println(dptsPo);
		*/
		
		
		
		/*VendorPo vendorPo = (VendorPo)convertXmlFileToObject(VendorPo.class,path+xml_path);
		System.out.println(vendorPo);*/
		
//		convertXmlFileToObject()
//		URL reqURL = new URL("http://10.101.11.247/ElectricityAuditContractQuery/ContractQuery.svc"); //
//		HttpsURLConnection httpsConn = (HttpsURLConnection) reqURL.openConnection();
//
//		// dom4j 数据解析
//		Document doc = null;
//		InputStream ins = null;
//		SAXReader reader = null;
//
//		
//		reader = new SAXReader();
//		
//		ins = httpsConn.getInputStream();
//		doc = reader.read(ins);
//		
//		//返回类型未知，已知DOM结构的时候可以强制转换
//		Object obj = parse(root); 
//		//控制台数据输出
//		System.out.println(obj); 
//
//		ins.close();
//		httpsConn.disconnect();
		return null;
	}
	
	@Override
	public Boolean addVendor(){
		return false;
	}
	/** 
     * 将file类型的xml转换成对象 
     */  
    @SuppressWarnings("unused")
	private Object convertXmlFileToObject(Class<?> clazz, String xmlPath) {
        Object xmlObject = null;
        try {
            JAXBContext context = JAXBContext.newInstance(clazz);
            Unmarshaller unmarshaller = context.createUnmarshaller();
            InputStreamReader isr = null;
            try {
				isr =new InputStreamReader(new FileInputStream(xmlPath),"UTF-8");

            }catch (FileNotFoundException e) {
                e.printStackTrace();
            }catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
            xmlObject = unmarshaller.unmarshal(isr);
        } catch (JAXBException e) {
            e.printStackTrace();
        }
        return xmlObject;
    }
    
	@Override
	public Boolean addAllDpts() {
		boolean isSuccess = false;
		OrganizationPo organizationPo =(OrganizationPo)XmlUtil.convertXmlStreamToObject(
				OrganizationPo.class,ConfigUtil.getInstance().get("OA_ORGANIZATION_URL"));
//		String path = this.getClass().getClassLoader().getResource("/").getPath();
//		String xml_path = "data"+File.separator+ORG_XML_PATH;
//		OrganizationPo organizationPo = (OrganizationPo)convertXmlFileToObject(OrganizationPo.class,path+xml_path);
		if(organizationPo != null){
			isSuccess = recursiveSaveDpt(organizationPo.getDepartments());
		}
		return isSuccess;
	}

	/**
	 * 递归算法保存部门数据(由于部门数据以层级形式存放数据)
	 * 
	 * @return
	 */
	private boolean recursiveSaveDpt(List<OrgDetailPo> lst){
		boolean isSuccess = false;
		if (lst != null && lst.size() != 0) {
			for(OrgDetailPo po : lst){
				isSuccess = dataDao.addDpt(po);
				System.out.println(po);
				if(isSuccess){
					recursiveSaveDpt(po.getDepartments());
				}
			}
		}
		return isSuccess;
	}
	
	@Override
	public Boolean addDpts(String startTime,String endTime) {
		boolean isSuccess = false;
		//解析部门XML数据
		String url = ConfigUtil.getInstance().get("OA_GETDPTSBY_URL")+
				"&Update_Begin_Date="+startTime+"&Update_End_Date="+endTime;
		DptsPo dptsPo =(DptsPo)XmlUtil.convertXmlStreamToObject(
					DptsPo.class, url);
		
//		String path = this.getClass().getClassLoader().getResource("/").getPath();
//		String xml_path = "data"+File.separator+DPT_XML_PATH;
//		DptsPo dptsPo = (DptsPo)convertXmlFileToObject(DptsPo.class,path+xml_path);
		if(dptsPo != null){
			isSuccess = dataDao.addDpts(dptsPo.getDepartments());
		}
		return isSuccess;
	}

	@Override
	public Boolean addEmps(String startTime,String endTime) {
		boolean isSuccess = false;
		//解析人员XML数据
		String url = ConfigUtil.getInstance().get("OA_EMP_URL")+
				"&Update_Begin_Date="+startTime+"&Update_End_Date="+endTime;
		EmpsPo empsPo =(EmpsPo)XmlUtil.convertXmlStreamToObject(
					EmpsPo.class, url);
		
//		String path = this.getClass().getClassLoader().getResource("/").getPath();
//		String xml_path = "data"+File.separator+EMP_XML_PATH;
//		EmpsPo empsPo = (EmpsPo)convertXmlFileToObject(EmpsPo.class,path+xml_path);
		if(empsPo != null){
			//保存人员基本信息
			List<EmployeePo> employees = empsPo.getEmployees();
//			isSuccess = dataDao.addEmployees(employees);
			if(!isSuccess){
				for(EmployeePo employee : employees){
					isSuccess =this.addEmpDepartment(employee);
				}
			}
		}
		return isSuccess;
	}
	/**
	 * 保存员工部门关系
	 * @return
	 */
	private Boolean addEmpDepartment(EmployeePo employee){
		for(EmpDptPo empDptPo :employee.getOwnDepartments()){
			empDptPo.setRowNo(employee.getRowNo());
			this.addEmpRole(empDptPo);
			this.addEmpDuty(empDptPo);
		}
		dataDao.addEmpDepartment(employee.getOwnDepartments());
		
		return true;
	}
	/**
	 * 保存员工角色关系
	 * @return
	 */
	private Boolean addEmpRole(EmpDptPo empDptPo){
		for(EmpRolesPo empRolesPo :empDptPo.getRoles()){
			empRolesPo.setRowNo(empDptPo.getRowNo());
			System.out.println(empRolesPo);
		}
		if(empDptPo.getRoles() != null && empDptPo.getRoles().size() > 0){
			dataDao.addEmpRole(empDptPo.getRoles());
		}
		
		return true;
	}
	/**
	 * 保存员工职位关系
	 * @return
	 */
	private Boolean addEmpDuty(EmpDptPo empDptPo){
		for(EmpDutyPo empDutyPo :empDptPo.getDuty()){
			empDutyPo.setRowNo(empDptPo.getRowNo());
			System.out.println(empDutyPo);
		}
		
		if(empDptPo.getDuty() != null && empDptPo.getDuty().size() > 0){
			dataDao.addEmpDuty(empDptPo.getDuty());
		}
		return true;
	}
	
}
