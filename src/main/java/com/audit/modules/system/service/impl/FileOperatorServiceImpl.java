package com.audit.modules.system.service.impl;

import com.audit.modules.basedata.dao.AccountSiteTransDao;
import com.audit.modules.basedata.dao.WhiteMgDao;
import com.audit.modules.basedata.entity.TransEleFile;
import com.audit.modules.basedata.service.WhiteMgService;
import com.audit.modules.common.ResultVO;
import com.audit.modules.common.utils.FTPClientUtil;
import com.audit.modules.common.utils.FileUtil;
import com.audit.modules.common.utils.JsonUtil;
import com.audit.modules.common.utils.LogUtil;
import com.audit.modules.common.utils.SftpUtil;
import com.audit.modules.common.utils.StringUtils;
import com.audit.modules.system.dao.FileDao;
import com.audit.modules.system.entity.CheckReturn;
import com.audit.modules.system.entity.SysFile;
import com.audit.modules.system.entity.UserVo;
import com.audit.modules.system.entity.WhiteMg;
import com.audit.modules.system.service.FileOperatorService;
import com.audit.modules.towerbasedata.trans.dao.TowerTransDao;
import com.audit.modules.towerbasedata.trans.entity.TowerTransEleFile;
import com.google.common.collect.Maps;

import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.io.FileUtils;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @author : jiadu
 * @Description : 附件上传下载
 * @date : 2017/3/9
 * Copyright (c) , IsoftStone All Right reserved.
 */
@Transactional
@Service
public class FileOperatorServiceImpl implements FileOperatorService{

    @Autowired
    private FileDao fileDao;
    @Autowired
    private WhiteMgDao whiteMgDao;
    @Autowired
    private AccountSiteTransDao accountSiteTransDao;
    @Autowired
    private TowerTransDao towerTransDao;


    @Override
    public Map<String,String> saveFile(MultipartFile[] multipartFile,HttpServletRequest request) {
        SysFile sysFile = new SysFile();
        Object object =  request.getSession().getAttribute("userInfo");
        UserVo userInfo=new UserVo();
        if(object!=null){
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
            sysFile.setCreatorid(userInfo.getUserId());
            sysFile.setCreator(userInfo.getUserName());
        }
        //获取操作系统的名称
        String systemName = System.getProperties().getProperty("os.name");
        String basePath ="";
        if(systemName.indexOf("Windows")!=-1){
            basePath=read("FILEUPLOADWIDOWSPATH");
        }else {
            basePath=read("FILEUPLOADLINUXPATH");
        }
        Map<String,String> maps = Maps.newHashMap();
//        basePath = "localhost:8080//UploadFile";
        try {
            for(MultipartFile file:multipartFile){
                String fileName = file.getOriginalFilename().substring(0,file.getOriginalFilename().lastIndexOf("."));
                String id = upload(request,file,sysFile,basePath);
                maps.put(id,fileName);
            }
        } catch (IOException e) {
            LogUtil.getLogger().error(e.getMessage());
            throw new RuntimeException(e);
        }
        return maps;
    }
    
    //自维转供电
    @Override
    public Map<String,String> saveFileTrans(MultipartFile[] multipartFile,HttpServletRequest request) {
        SysFile sysFile = new SysFile();
        Object object =  request.getSession().getAttribute("userInfo");
        UserVo userInfo=new UserVo();
        if(object!=null){
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
            sysFile.setCreatorid(userInfo.getUserId());
            sysFile.setCreator(userInfo.getUserName());
        }
        String systemName = System.getProperties().getProperty("os.name");
        String basePath ="";
        if(systemName.indexOf("Windows")!=-1){
            basePath=read("FILEUPLOADWIDOWSPATH");
        }else {
            basePath=read("FILEUPLOADLINUXPATH");
        }
        Map<String,String> maps = Maps.newHashMap();
        try {
            for(MultipartFile file:multipartFile){
                String fileName = file.getOriginalFilename().substring(0,file.getOriginalFilename().lastIndexOf("."));
                String id = uploadTrans(request,file,sysFile,basePath);
                maps.put(id,fileName);
            }
        } catch (IOException e) {
            LogUtil.getLogger().error(e.getMessage());
            throw new RuntimeException(e);
        }
        return maps;
    }
    //塔维自维转供电
    @Override
    public Map<String,String> saveFileTowerTrans(MultipartFile[] multipartFile,HttpServletRequest request) {
        SysFile sysFile = new SysFile();
        Object object =  request.getSession().getAttribute("userInfo");
        UserVo userInfo=new UserVo();
        if(object!=null){
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
            sysFile.setCreatorid(userInfo.getUserId());
            sysFile.setCreator(userInfo.getUserName());
        }
        String systemName = System.getProperties().getProperty("os.name");
        String basePath ="";
        if(systemName.indexOf("Windows")!=-1){
            basePath=read("FILEUPLOADWIDOWSPATH");
        }else {
            basePath=read("FILEUPLOADLINUXPATH");
        }
        Map<String,String> maps = Maps.newHashMap();
        try {
            for(MultipartFile file:multipartFile){
                String fileName = file.getOriginalFilename().substring(0,file.getOriginalFilename().lastIndexOf("."));
                String id = uploadTowerTrans(request,file,sysFile,basePath);
                maps.put(id,fileName);
            }
        } catch (IOException e) {
            LogUtil.getLogger().error(e.getMessage());
            throw new RuntimeException(e);
        }
        return maps;
    }
    
    
    
    
    
    @Override
    public Map<String,String> saveFileagain(MultipartFile[] multipartFile,HttpServletRequest request,String szydno) {
        SysFile sysFile = new SysFile();
        Object object =  request.getSession().getAttribute("userInfo");
        UserVo userInfo=new UserVo();
        if(object!=null){
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
            sysFile.setCreatorid(userInfo.getUserId());
            sysFile.setCreator(userInfo.getUserName());
        }
        String systemName = System.getProperties().getProperty("os.name");
        String basePath ="";
        if(systemName.indexOf("Windows")!=-1){
            basePath=read("FILEUPLOADWIDOWSPATH");
        }else {
            basePath=read("FILEUPLOADLINUXPATH");
        }
        Map<String,String> maps = Maps.newHashMap();
        try {
            for(MultipartFile file:multipartFile){
                String fileName = file.getOriginalFilename().substring(0,file.getOriginalFilename().lastIndexOf("."));
                String id = uploadagain(request,file,sysFile,basePath,szydno);
                maps.put(id,fileName);
            }
        } catch (IOException e) {
            LogUtil.getLogger().error(e.getMessage());
            throw new RuntimeException(e);
        }
        return maps;
    }
    
    
    
    
    @Override
    public Map<String,String> saveFileExcel(MultipartFile[] multipartFile,HttpServletRequest request) {
        SysFile sysFile = new SysFile();
        Object object =  request.getSession().getAttribute("userInfo");
        UserVo userInfo=new UserVo();
        if(object!=null){
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
            sysFile.setCreatorid(userInfo.getUserId());
            sysFile.setCreator(userInfo.getUserName());
        }
        String systemName = System.getProperties().getProperty("os.name");
        String basePath ="";
        if(systemName.indexOf("Windows")!=-1){
            basePath=read("FILEUPLOADWIDOWSPATH");
        }else {
            basePath=read("FILEUPLOADLINUXPATH");
        }
        Map<String,String> maps = Maps.newHashMap();
        try {
            for(MultipartFile file:multipartFile){
                String fileName = file.getOriginalFilename().substring(0,file.getOriginalFilename().lastIndexOf("."));
                String id = uploadexecl(request,file,sysFile,basePath);
                String substring = id.substring(0, 4);
                if("填写错误".equals(substring)){
                	maps.put("wrong", id);
                }else{
                	 maps.put(id,fileName);
                }
            }
        } catch (IOException e) {
            LogUtil.getLogger().error(e.getMessage());
            throw new RuntimeException(e);
        }
        return maps;
    }
    
    
    
    //修改白名单状态下的上传
    @Override
    public Map<String,String> saveFileExcel1(MultipartFile[] multipartFile,HttpServletRequest request) {
        SysFile sysFile = new SysFile();
        Object object =  request.getSession().getAttribute("userInfo");
        UserVo userInfo=new UserVo();
        if(object!=null){
            userInfo = JsonUtil.valueOf(object.toString(), UserVo.class);
            sysFile.setCreatorid(userInfo.getUserId());
            sysFile.setCreator(userInfo.getUserName());
        }
        String systemName = System.getProperties().getProperty("os.name");
        String basePath ="";
        if(systemName.indexOf("Windows")!=-1){
            basePath=read("FILEUPLOADWIDOWSPATH");
        }else {
            basePath=read("FILEUPLOADLINUXPATH");
        }
        Map<String,String> maps = Maps.newHashMap();
        try {
            for(MultipartFile file:multipartFile){
                String fileName = file.getOriginalFilename().substring(0,file.getOriginalFilename().lastIndexOf("."));
                String id = uploadexecl1(request,file,sysFile,basePath);
                maps.put(id,fileName);
            }
        } catch (IOException e) {
            LogUtil.getLogger().error(e.getMessage());
            throw new RuntimeException(e);
        }
        return maps;
    }
    
    

    public static String read(String key) {
        Properties properties=new Properties();
        InputStream iStream= FileOperatorServiceImpl.class.getClassLoader().getResourceAsStream("conf/dataImport.properties");
        if(iStream!=null){
            try {
                properties.load(iStream);
                String keys=properties.getProperty(key);
                return keys;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    @Override
    public SysFile findByID(String id) {
        return fileDao.findByID(id);
    }
    
    //自维
    @Override
    public TransEleFile findByIDTrans(String id) {
        return accountSiteTransDao.findByIDTrans(id);
    }
    //塔维
    @Override
    public TowerTransEleFile findByIDTowerTrans(String id) {
        return towerTransDao.findByIDTrans(id);
    }

    @Override
    public ResultVO fileDelete(String[] ids) {
        if(ids==null||ids.length==0){
            return ResultVO.failed("ID不能为空！");
        }
        List<SysFile> sysFiles = fileDao.findByIDs(Arrays.asList(ids));
        if(sysFiles==null||sysFiles.isEmpty()){
            return ResultVO.success();
        }
        for(SysFile sysFile:sysFiles){
            if(StringUtils.isNotBlank(sysFile.getFilepath())){
                File filepath =  new File(sysFile.getFilepath());
                if(filepath.exists()){
                    try {
                        filepath.delete();
                    }catch (Exception e){

                    }
                }
            }
        }
        fileDao.deleteFiles(Arrays.asList(ids));
        return ResultVO.success();
    }

    public String upload(HttpServletRequest request,MultipartFile file,SysFile sysFile,String basePath) throws IOException {

        String oriFileName = file.getOriginalFilename();//获取附件名
        String extName = oriFileName.substring(oriFileName.indexOf(".")+1,oriFileName.length());//获取扩展名
        String fileID = StringUtils.getUUid();
        String fileName = fileID+"."+extName;
        
        //白名单传附件时获取上传人
       /* HttpSession session = request.getSession();
        UserVo user=(UserVo)session.getAttribute("user");
        Map<String, Object> map=new HashMap<String,Object>();
        map.put("cperson", user.getUserId());
        map.put("fileid", fileID);
        map.put("id", fileID);
        whiteMgDao.addCpersonFile(map);*/
        
        sysFile.setId(fileID);
        sysFile.setFilename(oriFileName.substring(0,oriFileName.lastIndexOf(".")));
        sysFile.setTotalbytes(file.getSize());
        sysFile.setExt(extName);
        
        
        //上传路径
//      String filepath = "/usr/share/apache-tomcat-7.0.82/webapps/testupload";
        String uploadPath = read("FILEUPLOADTOMCAT");
        //唯一标识符，每个上传不一样，作为区分
        String upKnow = request.getParameter("upKnow");
        if(upKnow==null){
        	upKnow = "other";
        }
        //这里是电费稽核的附件，增加一个标识符会好点
        uploadPath = uploadPath+"/"+upKnow;
        //把file转换成inputstream信息
        CommonsMultipartFile cFile = (CommonsMultipartFile) file;
        DiskFileItem fileItem = (DiskFileItem) cFile.getFileItem();
        InputStream inputStream = fileItem.getInputStream();
        try {
        	//开始上传sftp
			SftpUtil.sftpFileUploadStep(uploadPath, fileName,inputStream);
		} catch (Exception e) {
			e.printStackTrace();
		}
        Calendar cal = Calendar.getInstance();
        Integer year = cal.get(Calendar.YEAR); // 当前年份
        Integer month = cal.get(Calendar.MONTH) + 1; // 当前月份
        //取到访问地址
        String filePath = read("GOONURL")+"/"+upKnow+"/"+year+"/"+month+"/"+fileName;
//        String filePath = createFilePath(basePath,fileName);//生成filePath
        
//        FileUtil.writeByte(filePath, file.getBytes());
        
        sysFile.setNote(FileUtil.getSize(file.getSize()));
        sysFile.setFilepath(filePath);
        fileDao.uploadFile(sysFile);
        
        
        return fileID;
    }
    
    //自维转供电文件保存
    public String uploadTrans(HttpServletRequest request,MultipartFile file,SysFile sysFile,String basePath) throws IOException {
    	TransEleFile transEleFile = new TransEleFile();
        String oriFileName = file.getOriginalFilename();//获取附件名
        String extName = oriFileName.substring(oriFileName.indexOf(".")+1,oriFileName.length());//获取扩展名
        String fileID = StringUtils.getUUid();
        String fileName = fileID+"."+extName;
        
        transEleFile.setCreator(sysFile.getCreator());
        transEleFile.setCreatorid(sysFile.getCreatorid());
        transEleFile.setId(fileID);
        transEleFile.setFilename(oriFileName.substring(0,oriFileName.lastIndexOf(".")));
        transEleFile.setTotalbytes(file.getSize());
        transEleFile.setExt(extName);
        String filePath = createFilePath(basePath,fileName);//生成filePath
        FileUtil.writeByte(filePath, file.getBytes());
        transEleFile.setNote(FileUtil.getSize(file.getSize()));
        transEleFile.setFilepath(filePath);
        accountSiteTransDao.uploadFileTrans(transEleFile);
        
        
  
     
        
        return fileID;
    }
    
    //塔维转供电文件保存
    public String uploadTowerTrans(HttpServletRequest request,MultipartFile file,SysFile sysFile,String basePath) throws IOException {
    	TowerTransEleFile towerTransEleFile = new TowerTransEleFile();
        String oriFileName = file.getOriginalFilename();//获取附件名
        String extName = oriFileName.substring(oriFileName.indexOf(".")+1,oriFileName.length());//获取扩展名
        String fileID = StringUtils.getUUid();
        String fileName = fileID+"."+extName;
        
        towerTransEleFile.setCreator(sysFile.getCreator());
        towerTransEleFile.setCreatorid(sysFile.getCreatorid());
        towerTransEleFile.setId(fileID);
        towerTransEleFile.setFilename(oriFileName.substring(0,oriFileName.lastIndexOf(".")));
        towerTransEleFile.setTotalbytes(file.getSize());
        towerTransEleFile.setExt(extName);
        String filePath = createFilePath(basePath,fileName);//生成filePath
        FileUtil.writeByte(filePath, file.getBytes());
        towerTransEleFile.setNote(FileUtil.getSize(file.getSize()));
        towerTransEleFile.setFilepath(filePath);
        towerTransDao.uploadFileTrans(towerTransEleFile);
        
        
  
     
        
        return fileID;
    }
    
    
    public String uploadagain(HttpServletRequest request,MultipartFile file,SysFile sysFile,String basePath,String szydno) throws IOException {

        String oriFileName = file.getOriginalFilename();//获取附件名
        String extName = oriFileName.substring(oriFileName.indexOf(".")+1,oriFileName.length());//获取扩展名
        String fileID = StringUtils.getUUid();
        String fileName = fileID+"."+extName;
        
        //白名单传附件时获取上传人
        /*HttpSession session = request.getSession();
        UserVo user=(UserVo)session.getAttribute("user");
       
        whiteMgDao.addCpersonFile(map);*/
        //存入sys_white_mid_file表中
        Map<String, Object> map=new HashMap<String,Object>();
        map.put("szydno", szydno);
        map.put("fjid", fileID);
        map.put("id", fileID);
        whiteMgDao.addsyswhitemidfile(map);
        sysFile.setId(fileID);
        sysFile.setFilename(oriFileName.substring(0,oriFileName.lastIndexOf(".")));
        sysFile.setTotalbytes(file.getSize());
        sysFile.setExt(extName);
        String filePath = createFilePath(basePath,fileName);//生成filePath
        FileUtil.writeByte(filePath, file.getBytes());
        sysFile.setNote(FileUtil.getSize(file.getSize()));
        sysFile.setFilepath(filePath);
        fileDao.uploadFile(sysFile);
        return fileID;
    }
    
    
    
    public String uploadexecl(HttpServletRequest request,MultipartFile file,SysFile sysFile,String basePath) throws IOException {
    	HttpSession session = request.getSession();
    	UserVo user= (UserVo)session.getAttribute("user");
    	String userId = user.getUserId();
    	whiteMgDao.delwrong(user.getUserId());
        String oriFileName = file.getOriginalFilename();//获取附件名
        String extName = oriFileName.substring(oriFileName.indexOf(".")+1,oriFileName.length());//获取扩展名
        String fileID = StringUtils.getUUid();
        String fileName = fileID+"."+extName;
        sysFile.setId(fileID);
        sysFile.setFilename(oriFileName.substring(0,oriFileName.lastIndexOf(".")));
        sysFile.setTotalbytes(file.getSize());
        sysFile.setExt(extName);
        String filePath = createFilePath(basePath,fileName);//生成filePath
        FileUtil.writeByte(filePath, file.getBytes());
        sysFile.setNote(FileUtil.getSize(file.getSize()));
        sysFile.setFilepath(filePath);
        if(extName.equalsIgnoreCase("xlsx")||extName.equalsIgnoreCase("xls")){
        	String execelFile = filePath;
        	try {
    			// 构造 Workbook 对象，execelFile 是传入文件路径(获得Excel工作区)
    			Workbook book = null;
    			try {
    				// Excel 2007获取方法
    				book = new XSSFWorkbook(new FileInputStream(execelFile));
    			} catch (Exception ex) {
    				// Excel 2003获取方法
    				book = new HSSFWorkbook(new FileInputStream(execelFile));
    			}
    			// 读取表格的第一个sheet页
    			Sheet sheet = book.getSheetAt(0);
    			// 定义 row、cell
    			Row row;
    			String cell;
    			// 总共有多少行,从0开始
    			int totalRows = sheet.getLastRowNum();
    			// 循环输出表格中的内容,首先循环取出行,再根据行循环取出列
    			for (int i = 1; i <= totalRows; i++) {
    				row = sheet.getRow(i);
    				// 处理空行
    				if (row == null) {
    					continue;
    				}
    				// 总共有多少列,从0开始
    				int totalCells = row.getLastCellNum();
    				//有合同
					//无合同
    					List list=new ArrayList();
    				for (int j = row.getFirstCellNum(); j < totalCells; j++) {
    					if(i>2){
    						String id = UUID.randomUUID().toString().replaceAll("-", "");
    						// 处理空列
        					if (row.getCell(j) == null) {
        						continue;
        					}
        					// 通过 row.getCell(j).toString() 获取单元格内容
        					Cell cell2 = row.getCell(j);
        					cell = row.getCell(j).toString();
        					if(j==0){
        						list.add(id+cell);
        					}else{
        						
        						
        						if (0 == cell2.getCellType()) {
        							//判断是否为日期类型
        							if(HSSFDateUtil.isCellDateFormatted(cell2)){
        							//用于转化为日期格式
        							Date d = cell2.getDateCellValue();
        							DateFormat formater = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        							String format = formater.format(d);
        							list.add(format);
        							}else{
            							// 用于格式化数字，只保留数字的整数部分
            							DecimalFormat df = new DecimalFormat("########.##");
            							String format = df.format(cell2.getNumericCellValue());
            							list.add(format);
            							}
        					}else{
        						list.add(cell);
        					}
        						
        						
        						
        					}
    					}
    				}
    				WhiteMg whiteMg=new WhiteMg();
    				if(i>2){
    					Map<String, Object> map=new HashMap<String,Object>();
    					if(list.get(0).toString()==null||list.get(0).toString()==""){
    						map.put("num", i+1);
        					map.put("de", "序列不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
    					}
        				whiteMg.setId(list.get(0).toString());
        				whiteMg.setCityName(list.get(1).toString());
        				//验证zg_space_city 中的CITY_NAME字段数据一致
        				int checkCityName = whiteMgDao.checkCityName(list.get(1).toString());
        				if(checkCityName<1){
        					map.put("num", i+1);
        					map.put("de", "地市有误");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				whiteMg.setZhLabel(list.get(2).toString());
        				//验证1、必须与资管表：zg_space_county 中的ZH_LABEL字段数据一致2、CITY_ID值与地市匹配
        				int checkZhlabel = whiteMgDao.checkZhlabel(list.get(2).toString());
        				if(checkZhlabel<1){
        					map.put("num", i+1);
        					map.put("de", "区县有误");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				whiteMg.setZiguanName(list.get(3).toString());
        				//验证资管站点名
        				int checkZiguan = whiteMgDao.checkZiguan(list.get(3).toString());
        				if(checkZiguan<1){
        					map.put("num", i+1);
        					map.put("de", "资管站点名称有误");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				int j = whiteMgDao.checkziguanname1(list.get(3).toString());
        				if(j>=1){
        					map.put("num", i+1);
        					map.put("de", "该站点名已出库");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				int checkziguanname = whiteMgDao.checkziguanname(list.get(3).toString());
        				int checkziguanname2 = whiteMgDao.checkziguanname2(list.get(3).toString());
        				if(checkziguanname>0 ||checkziguanname2>0){
        					map.put("num", i+1);
        					map.put("de", "资管站点重复");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				//白名单场景不能为空
        				if(list.get(4)==null ||list.get(4)==""){
        					map.put("num", i+1);
        					map.put("de", "白名单场景不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				if(Integer.parseInt(String.valueOf(list.get(4)))>5||Integer.parseInt(String.valueOf(list.get(4)))<1){
        					map.put("num", i+1);
        					map.put("de", "白名单场景不正确");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				String trim = list.get(4).toString().trim();
        				int indexOf = trim.indexOf(".");
        				if(indexOf>0){
        					String substring = trim.substring(0, indexOf);
        					whiteMg.setCj(Integer.parseInt(substring));
        				}else{
        					whiteMg.setCj(Integer.parseInt(trim));
        				}
        				//验证原账务站点名不能为
        				if(list.get(5)==null ||list.get(5)==""){
        					
        					map.put("num", i+1);
        					map.put("de", "原账务站点不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				whiteMg.setSiteName(list.get(5).toString());
        				//查找站点id
        				String siteId = whiteMgDao.getSiteIdBySiteName(list.get(3).toString());
        				whiteMg.setSiteId(siteId);
        				//验证合同名
        				if(list.get(6)==null ||list.get(6)==""){
        					map.put("num", i+1);
        					map.put("de", "虚拟合同名不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				
        				
        				whiteMg.setContractName(list.get(6).toString());
        				
        				//验证合同时间
        				SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
        				try {
							Date start = sdf.parse(list.get(7).toString());
							Date end = sdf.parse(list.get(8).toString());
							if(end.getTime()<start.getTime()){
								map.put("num", i+1);
	        					map.put("de", "合同时间填写有误");
	        					map.put("user", userId);
	        					whiteMgDao.addwrong(map);
	        					continue;
							}
						} catch (ParseException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
							continue;
						}
        				
        				
        				
        				whiteMg.setContractDate(list.get(7).toString());
        				whiteMg.setContractEndTime(list.get(8).toString());
        				if(list.get(9)==null || list.get(9)==""){
        					map.put("num", i+1);
        					map.put("de", "缴费周期不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				String trim2 = list.get(9).toString().trim();
        				int indexOf2 = trim2.indexOf(".");
        				if(indexOf2>0){
        					String substring = trim2.substring(0, indexOf);
        					if(Integer.parseInt(substring)!=1&&Integer.parseInt(substring)!=2&&
        							Integer.parseInt(substring)!=3&&
        							Integer.parseInt(substring)!=4&&
        							Integer.parseInt(substring)!=5){
        						
        						map.put("num",i+1);
            					map.put("de", "缴费周期请按要求填写");
            					map.put("user", userId);
            					whiteMgDao.addwrong(map);
            					continue;
        					}
        					whiteMg.setPayType(Integer.parseInt(substring));
        				}else{
        					if(Integer.parseInt(trim2)!=1&&Integer.parseInt(trim2)!=2&&
        							Integer.parseInt(trim2)!=3&&
        							Integer.parseInt(trim2)!=4&&
        							Integer.parseInt(trim2)!=5){
        						map.put("num", i+1);
            					map.put("de", "缴费周期请按要求填写");
            					map.put("user", userId);
            					whiteMgDao.addwrong(map);
            					continue;
        						
        						
        					}
        					whiteMg.setPayType(Integer.parseInt(trim2));
        				}
        				DecimalFormat df=new DecimalFormat("#0.00");
        				if(list.get(10)==null || list.get(10)==""){
        					
        					map.put("num", i+1);
        					map.put("de", "单价不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				String trim4 = list.get(10).toString().trim();
        				String format = df.format(Double.valueOf(trim4));
        				if(Double.valueOf(format)<0){
        					map.put("num", i+1);
        					map.put("de", "单价按要求填写");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;

        					
        				}
        				whiteMg.setPrice(Double.valueOf(format));
        				
        				DecimalFormat df1=new DecimalFormat("#0.00");
        				if(list.get(11)==null || list.get(11)==""){
        					map.put("num", i+1);
        					map.put("de", "分摊不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				String trim5 = list.get(11).toString().trim();
        				String format1 = df.format(Double.valueOf(trim5));
        				if(Double.valueOf(format1)<0 || Double.valueOf(format1)>100 ){
        					map.put("num", i+1);
        					map.put("de", "分摊按要求填写");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				whiteMg.setfTan(Double.valueOf(format1));
        				whiteMg.setContractStatus(1);
        				//验证供应商姓名
        				int checkSupplyName = whiteMgDao.checkSupplyName(list.get(13).toString());
        				if(checkSupplyName<1){
        					map.put("num", i+1);
        					map.put("de", "无对应供应商");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				whiteMg.setSupplyName(list.get(13).toString());
        				int checkSupplySiteId = whiteMgDao.checkSupplySiteId(list.get(14).toString());
        				if(checkSupplySiteId<1){
        					
        					map.put("num", i+1);
        					map.put("de", "无对应供应商地点id");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				whiteMg.setSupplySiteId(list.get(14).toString());
        				int checkSupplyOrgId = whiteMgDao.checkSupplyOrgId(list.get(15).toString());
        				if(checkSupplyOrgId<1){
        					
        					map.put("num", i+1);
        					map.put("de", "无对应供应商组织id");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				whiteMg.setSupplyerOrganizationId(list.get(15).toString());
        				if(list.get(16)==null||list.get(16)==""){
        					map.put("num", i+1);
        					map.put("de", "开户行不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        					
        				}
        				whiteMg.setBankName(list.get(16).toString());
        				if(list.get(17)==null||list.get(17)==""){
        					
        					map.put("num", i+1);
        					map.put("de", "账户行不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				whiteMg.setBankacName(list.get(17).toString());
        				if(list.get(18)==null||list.get(18)==""){
        					
        					map.put("num", i+1);
        					map.put("de", "账号不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				whiteMg.setBankNum(list.get(18).toString());
        				//合同id
        				String contractId="HT"+new SimpleDateFormat("yyyy-MM-dd").format(new Date())+((int)(Math.random()*(9999-1000+1)+1000));
        				whiteMg.setContractId(contractId);
        				String getsupplyid = whiteMgDao.getsupplyid(whiteMg);
        				if(getsupplyid==null){
        					map.put("num", i+1);
        					map.put("de", "根据填写的供应商数据没有对应供应商");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				whiteMg.setSupplyId(getsupplyid);
        				int num = whiteMgDao.addWhite(whiteMg);
    				}
    				
    				//判断有几行错误
    				  //CheckReturn check = check(list);
    				for(int k=0;k<list.size();k++){
    					System.out.print(list.get(k)+"\t");
    				}
    				System.out.println("");
    			}
    		} catch (FileNotFoundException e) {
    			e.printStackTrace();
    		} catch (IOException e) {
    			e.printStackTrace();
    		}
        }
        fileDao.uploadFile(sysFile);
        return fileID;
    }
    
    
    
    public String uploadexecl1(HttpServletRequest request,MultipartFile file,SysFile sysFile,String basePath) throws IOException {
    	
    	HttpSession session = request.getSession();
    	UserVo user= (UserVo)session.getAttribute("user");
    	whiteMgDao.delwrong(user.getUserId());
    	String userId = user.getUserId();
        String oriFileName = file.getOriginalFilename();//获取附件名
        String extName = oriFileName.substring(oriFileName.indexOf(".")+1,oriFileName.length());//获取扩展名
        String fileID = StringUtils.getUUid();
        String fileName = fileID+"."+extName;
        sysFile.setId(fileID);
        sysFile.setFilename(oriFileName.substring(0,oriFileName.lastIndexOf(".")));
        sysFile.setTotalbytes(file.getSize());
        sysFile.setExt(extName);
        String filePath = createFilePath(basePath,fileName);//生成filePath
        FileUtil.writeByte(filePath, file.getBytes());
        sysFile.setNote(FileUtil.getSize(file.getSize()));
        sysFile.setFilepath(filePath);
        fileDao.uploadFile(sysFile);
        if(extName.equalsIgnoreCase("xlsx")||extName.equalsIgnoreCase("xls")){
        	String execelFile = filePath;
        	try {
    			// 构造 Workbook 对象，execelFile 是传入文件路径(获得Excel工作区)
    			Workbook book = null;
    			try {
    				// Excel 2007获取方法
    				book = new XSSFWorkbook(new FileInputStream(execelFile));
    			} catch (Exception ex) {
    				// Excel 2003获取方法
    				book = new HSSFWorkbook(new FileInputStream(execelFile));
    			}
    			// 读取表格的第一个sheet页
    			Sheet sheet = book.getSheetAt(0);
    			// 定义 row、cell
    			Row row;
    			String cell;
    			// 总共有多少行,从0开始
    			int totalRows = sheet.getLastRowNum();
    			// 循环输出表格中的内容,首先循环取出行,再根据行循环取出列
    			for (int i = 1; i <= totalRows; i++) {
    				row = sheet.getRow(i);
    				// 处理空行
    				if (row == null) {
    					continue;
    				}
    				// 总共有多少列,从0开始
    				int totalCells = row.getLastCellNum();
    				//有合同
					//无合同
    					List list=new ArrayList();
    				for (int j = row.getFirstCellNum(); j < totalCells; j++) {
    					if(i>2){
    						String id = UUID.randomUUID().toString().replaceAll("-", "");
    						// 处理空列
        					if (row.getCell(j) == null) {
        						continue;
        					}
        					// 通过 row.getCell(j).toString() 获取单元格内容
        					Cell cell2 = row.getCell(j);
        					cell = row.getCell(j).toString();
        					if(j==0){
        						list.add(id+cell);
        					}else{
        						
        						
        						if (0 == cell2.getCellType()) {
        							//判断是否为日期类型
        							if(HSSFDateUtil.isCellDateFormatted(cell2)){
        							//用于转化为日期格式
        							Date d = cell2.getDateCellValue();
        							DateFormat formater = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        							String format = formater.format(d);
        							list.add(format);
        							}else{
        							// 用于格式化数字，只保留数字的整数部分
        							DecimalFormat df = new DecimalFormat("########");
        							String format = df.format(cell2.getNumericCellValue());
        							list.add(format);
        							}
        					}else{
        						list.add(cell);
        					}
        						
        						
        						
        					}
    					}
    				}
    				WhiteMg whiteMg=new WhiteMg();
    				if(i>2){
    					Map<String, Object> map=new HashMap<String,Object>();
    					if(list.get(0).toString()==null||list.get(0).toString()==""){
    						map.put("num", i+1);
        					map.put("de", "序列不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
    					}
        				whiteMg.setId(list.get(0).toString());
        				whiteMg.setCityName(list.get(1).toString());
        				//验证zg_space_city 中的CITY_NAME字段数据一致
        				int checkCityName = whiteMgDao.checkCityName(list.get(1).toString());
        				if(checkCityName<1){
        					map.put("num", i+1);
        					map.put("de", "地市有误");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				whiteMg.setZhLabel(list.get(2).toString());
        				//验证1、必须与资管表：zg_space_county 中的ZH_LABEL字段数据一致2、CITY_ID值与地市匹配
        				int checkZhlabel = whiteMgDao.checkZhlabel(list.get(2).toString());
        				if(checkZhlabel<1){
        					map.put("num", i+1);
        					map.put("de", "区县有误");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				whiteMg.setZiguanName(list.get(3).toString());
        				//验证资管站点名
        				int checkZiguan = whiteMgDao.checkZiguan(list.get(3).toString());
        				if(checkZiguan<1){
        					map.put("num", i+1);
        					map.put("de", "资管站点名称有误");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				
        				
        				int j = whiteMgDao.checkziguanname1(list.get(3).toString());
        				if(j>=1){
        					map.put("num", i+1);
        					map.put("de", "该站点名已出库");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				
        				int checkziguanname = whiteMgDao.checkziguanname(list.get(3).toString());
        				int checkziguanname2 = whiteMgDao.checkziguanname2(list.get(3).toString());
        				if(checkziguanname>0 ||checkziguanname2>0){
        					map.put("num", i+1);
        					map.put("de", "资管站点重复");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				//白名单场景不能为空
        				if(list.get(4)==null ||list.get(4)==""){
        					map.put("num", i+1);
        					map.put("de", "白名单场景不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				if(Integer.parseInt(String.valueOf(list.get(4)))>5||Integer.parseInt(String.valueOf(list.get(4)))<1){
        					map.put("num", i+1);
        					map.put("de", "白名单场景不正确");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				
        				String trim = list.get(4).toString().trim();
        				int indexOf = trim.indexOf(".");
        				if(indexOf>0){
        					String substring = trim.substring(0, indexOf);
        					whiteMg.setCj(Integer.parseInt(substring));
        				}else{
        					whiteMg.setCj(Integer.parseInt(trim));
        				}
        				//验证原账务站点名不能为
        				if(list.get(5)==null ||list.get(5)==""){
        					
        					map.put("num", i+1);
        					map.put("de", "原账务站点不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				whiteMg.setSiteName(list.get(5).toString());
        				//查找站点id
        				String siteId = whiteMgDao.getSiteIdBySiteName(list.get(3).toString());
        				whiteMg.setSiteId(siteId);
        				//验证合同名
        				if(list.get(6)==null ||list.get(6)==""){
        					map.put("num", i+1);
        					map.put("de", "虚拟合同名不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				whiteMg.setContractName(list.get(6).toString());
        				//验证合同时间
        				SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
        				try {
							Date start = sdf.parse(list.get(7).toString());
							Date end = sdf.parse(list.get(8).toString());
							if(end.getTime()<start.getTime()){
								map.put("num", i+1);
	        					map.put("de", "合同时间填写有误");
	        					map.put("user", userId);
	        					whiteMgDao.addwrong(map);
	        					continue;
							}
						} catch (ParseException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
							continue;
						}
        				
        				
        				
        				
        				whiteMg.setContractDate(list.get(7).toString());
        				whiteMg.setContractEndTime(list.get(8).toString());
        				if(list.get(9)==null || list.get(9)==""){
        					map.put("num", i+1);
        					map.put("de", "缴费周期不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				String trim2 = list.get(9).toString().trim();
        				int indexOf2 = trim2.indexOf(".");
        				if(indexOf2>0){
        					String substring = trim2.substring(0, indexOf);
        					if(Integer.parseInt(substring)!=1&&Integer.parseInt(substring)!=2&&
        							Integer.parseInt(substring)!=3&&
        							Integer.parseInt(substring)!=4&&
        							Integer.parseInt(substring)!=5){
        						
        						map.put("num", i+1);
            					map.put("de", "缴费周期请按要求填写");
            					map.put("user", userId);
            					whiteMgDao.addwrong(map);
            					continue;
        					}
        					whiteMg.setPayType(Integer.parseInt(substring));
        				}else{
        					if(Integer.parseInt(trim2)!=1&&Integer.parseInt(trim2)!=2&&
        							Integer.parseInt(trim2)!=3&&
        							Integer.parseInt(trim2)!=4&&
        							Integer.parseInt(trim2)!=5){
        						map.put("num", i+1);
            					map.put("de", "缴费周期请按要求填写");
            					map.put("user", userId);
            					whiteMgDao.addwrong(map);
            					continue;
        						
        						
        					}
        					whiteMg.setPayType(Integer.parseInt(trim2));
        				}
        				DecimalFormat df=new DecimalFormat("#0.00");
        				if(list.get(10)==null || list.get(10)==""){
        					
        					map.put("num", i+1);
        					map.put("de", "单价不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				String trim4 = list.get(10).toString().trim();
        				String format = df.format(Double.valueOf(trim4));
        				if(Double.valueOf(format)<0){
        					map.put("num", i+1);
        					map.put("de", "单价按要求填写");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;

        					
        				}
        				whiteMg.setPrice(Double.valueOf(format));
        				
        				DecimalFormat df1=new DecimalFormat("#0.00");
        				if(list.get(11)==null || list.get(11)==""){
        					map.put("num", i+1);
        					map.put("de", "分摊不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				String trim5 = list.get(11).toString().trim();
        				String format1 = df.format(Double.valueOf(trim5));
        				if(Double.valueOf(format1)<0 || Double.valueOf(format1)>100 ){
        					map.put("num", i+1);
        					map.put("de", "分摊按要求填写");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				whiteMg.setfTan(Double.valueOf(format1));
        				whiteMg.setContractStatus(1);
        				//验证供应商姓名
        				int checkSupplyName = whiteMgDao.checkSupplyName(list.get(13).toString());
        				if(checkSupplyName<1){
        					map.put("num", i+1);
        					map.put("de", "无对应供应商");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				whiteMg.setSupplyName(list.get(13).toString());
        				int checkSupplySiteId = whiteMgDao.checkSupplySiteId(list.get(14).toString());
        				if(checkSupplySiteId<1){
        					
        					map.put("num", i+1);
        					map.put("de", "无对应供应商地点id");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				whiteMg.setSupplySiteId(list.get(14).toString());
        				int checkSupplyOrgId = whiteMgDao.checkSupplyOrgId(list.get(15).toString());
        				if(checkSupplyOrgId<1){
        					
        					map.put("num", i+1);
        					map.put("de", "无对应供应商组织id");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				whiteMg.setSupplyerOrganizationId(list.get(15).toString());
        				if(list.get(16)==null||list.get(16)==""){
        					map.put("num", i+1);
        					map.put("de", "开户行不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        					
        				}
        				whiteMg.setBankName(list.get(16).toString());
        				if(list.get(17)==null||list.get(17)==""){
        					
        					map.put("num", i+1);
        					map.put("de", "账户行不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				whiteMg.setBankacName(list.get(17).toString());
        				if(list.get(18)==null||list.get(18)==""){
        					
        					map.put("num", i+1);
        					map.put("de", "账号不能为空");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        					
        				}
        				whiteMg.setBankNum(list.get(18).toString());
        				
        				//合同id
        				String contractId="HT"+new SimpleDateFormat("yyyy-MM-dd").format(new Date())+((int)(Math.random()*(9999-1000+1)+1000));
        				whiteMg.setContractId(contractId);
        				String getsupplyid = whiteMgDao.getsupplyid(whiteMg);
        				if(getsupplyid==null){
        					map.put("num", i+1);
        					map.put("de", "根据填写的供应商数据没有对应供应商");
        					map.put("user", userId);
        					whiteMgDao.addwrong(map);
        					continue;
        				}
        				whiteMg.setSupplyId(getsupplyid);
        				
        				
        				
        				int num = whiteMgDao.addWhite(whiteMg);
    				}
    				
    				//判断有几行错误
    				  //CheckReturn check = check(list);
    				for(int k=0;k<list.size();k++){
    					System.out.print(list.get(k)+"\t");
    				}
    				System.out.println("");
    			}
    		} catch (FileNotFoundException e) {
    			e.printStackTrace();
    		} catch (IOException e) {
    			e.printStackTrace();
    		}
        }
        return fileID;
    }
    
    
    
    
    
    
    
    //测试是否按模板填写是否正确
    public CheckReturn check(List list){
    	String cityName= list.get(1).toString();
    	return CheckReturn.success(true, "");
    }

    /**
     * 创建文件目录
     *
     * @param tempPath
     * @param fileName
     *            文件名称
     * @return 文件的完整目录
     */
    private String createFilePath(String tempPath, String fileName) {
        Calendar cal = Calendar.getInstance();
        Integer year = cal.get(Calendar.YEAR); // 当前年份
        Integer month = cal.get(Calendar.MONTH) + 1; // 当前月份
        File one = new File(tempPath + File.separator + year + File.separator
                + month);
        if (!one.exists()) {
            one.mkdirs();
        }
        return one.getPath() + File.separator + fileName;
    }
}
