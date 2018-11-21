package com.audit.modules.common.utils;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.SocketException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Vector;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpATTRS;
import com.jcraft.jsch.SftpException;



/**
 * Content ：sftp协议文件上传下载
 * Created by kl on 2016/5/6.
 */
public class SftpUtil {
	
	  /** 
	   * 日志 
	   */
	  private static final Logger LOGGER = LoggerFactory.getLogger(SftpUtil.class); 
	  
	  /** 
	   * 服务器ip
	   */
	  public static final String SERVER_IP = "SERVER_IP"; 
	  
	  /** 
	   * 端口号 
	   */
	  public static final String SERVER_PORT = "SERVER_PORT"; 
	  
	  /** 
	   * 用户名 
	   */
	  public static final String USER_NAME = "USER_NAME"; 
	  
	  /** 
	   * 密码
	   */
	  public static final String PASSWORD = "PASSWORD"; 
	  /** 
	   * 保存路径
	   */
//	  public static final String PATH = "PATH"; 
	  
	  
	    
	  
	  public static Map<String, Object> serverCfg = new HashMap<String, Object>(); 
	    
	  static Properties prop; 
	    
	  static{ 
	    LOGGER.info("开始加载ftp.properties文件!"); 
	    prop = new Properties(); 
	    try { 
	    	InputStream sfps = SftpUtil.class.getClassLoader().getResourceAsStream("conf/sftp.properties");
//	      InputStream fps = FTPClientUtil.class.getResourceAsStream("/ftp.properties"); 
	      prop.load(sfps); 
	      sfps.close(); 
	    } catch (Exception e) { 
	      LOGGER.error("读取ftp.properties文件异常!",e); 
	    } 
	    serverCfg.put(SftpUtil.SERVER_IP, values("SERVER_IP")); 
	    serverCfg.put(SftpUtil.SERVER_PORT, Integer.parseInt(values("SERVER_PORT"))); 
	    serverCfg.put(SftpUtil.USER_NAME, values("USER_NAME")); 
	    serverCfg.put(SftpUtil.PASSWORD, values("PASSWORD")); 
	    LOGGER.info(String.valueOf(serverCfg)); 
	  } 
	  
	  public static String values(String key) { 
		    String value = prop.getProperty(key); 
		    if (value != null) { 
		      return value; 
		    } else { 
		      return null; 
		    } 
		  }
	  
	  public static final void sftpFileUploadStep( String fielPath,String serverFileName,InputStream instream)throws Exception {
		  	String ip = (String) serverCfg.get(SERVER_IP); 
		    Integer port = (Integer) serverCfg.get(SERVER_PORT); 
		    String user = (String) serverCfg.get(USER_NAME); 
		    String psw = (String) serverCfg.get(PASSWORD); 
//		    String path = (String) serverCfg.get(PATH); 
		  
		  sftpFileUpload(ip,port,user,psw,fielPath,serverFileName, instream); 
	  }
		  
    /**
     * 上传文件到指定服务器
     * @param ip 连接ip
     * @param user 用户名
     * @param psw 密码
     * @param port 端口 <=0 为默认端口
     * @param fielPath 上传的服务器路径
     * @param serverFileName 服务器保存的文件名
     * @param instream 要上传的文件流
     * @throws Exception
     */
    public static void sftpFileUpload(String ip,int port, String user, String psw, String fielPath,String serverFileName,InputStream instream) throws Exception {
        Session session =getSession( ip,  user,  psw,  port);
        Channel channel = null;
        try {
            //创建sftp通信通道
            channel = (Channel) session.openChannel("sftp");
            channel.connect(1000);
            ChannelSftp sftp = (ChannelSftp) channel;
            String createFilePath = createFilePath(sftp,fielPath,serverFileName);
            //进入服务器指定的文件夹
            sftp.cd(createFilePath);
//            sftp.cd(fielPath);
            OutputStream outstream = sftp.put(serverFileName);
            byte b[] = new byte[1024*200];//每次传输200k
            int n;
            while ((n = instream.read(b)) != -1) {
                outstream.write(b, 0, n);
            }
            outstream.flush();
            outstream.close();
            instream.close();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            session.disconnect();
            if (channel!=null)channel.disconnect();
        }
    }
    /**
     * 创建文件目录
     *
     * @param tempPath
     * @param fileName
     *            文件名称
     * @return 文件的完整目录
     * @throws SftpException 
     */
    public static String createFilePath(ChannelSftp sftp,String tempPath, String fileName) throws SftpException {
    	String webUrlBefore  = tempPath.substring(0,tempPath.lastIndexOf("/"));
    	String webUrlAfter = tempPath.substring(tempPath.lastIndexOf("/")+1);
    	sftp.cd(webUrlBefore);
    	SftpATTRS attrs3 = null;  
	     try {  
	         attrs3 = sftp.stat(webUrlAfter);  
	     } catch (Exception e) {  
	    	 System.out.println("创建文件夹出问题=============================="+e.getMessage());
	     }  
	     if (attrs3 == null) {  
	         sftp.mkdir(webUrlAfter);  
	     }else{
	    	 sftp.cd(tempPath);
	     }
    	//一步一步创建文件夹
//    	sftp.cd(tempPath);
    	Calendar cal = Calendar.getInstance();
        String year = String.valueOf(cal.get(Calendar.YEAR)); // 当前年份
        String month = String.valueOf(cal.get(Calendar.MONTH) + 1); // 当前月份
	     // 判断子目录文件夹是否存在，不存在即创建  
	     SftpATTRS attrs = null;  
	     try {  
	         attrs = sftp.stat(year);  
	     } catch (Exception e) {  
	    	 System.out.println("创建文件夹出问题=============================="+e.getMessage());
	     }  
	     if (attrs == null) {  
	         sftp.mkdir(year);  
	     }else{
	    	 sftp.cd(tempPath+"/"+year);
	     }
	     SftpATTRS attrs2 = null;
	     try {  
	         attrs2 = sftp.stat(month);  
	     } catch (Exception e) {  
	    	 System.out.println("创建文件夹出问题=============================="+e.getMessage());
	     }  
	     if (attrs2 == null) {  
	         sftp.mkdir(month);  
	     }else{
	    	 sftp.cd(tempPath+"/"+year+"/"+month);
	     }
        
        return tempPath+"/"+year+"/"+month;
    }
    /**
     * 从指定服务器下载文件到本地
     * @param ip 连接ip
     * @param user 用户名
     * @param psw 密码
     * @param port 端口 <=0 为默认端口
     * @param fielPath 服务器文件路径
     * @param serverFileName 要下载的文件名
     * @param outputStream 输出到本地的文件流
     * @throws Exception
     */
    public static void sftpFileDownload(String ip,int port, String user, String psw, String fielPath,String serverFileName,OutputStream outputStream) throws Exception {
        Session session =getSession( ip,  user,  psw,  port);
        Channel channel = null;
        try {
            //创建sftp通信通道
            channel = (Channel) session.openChannel("sftp");
            channel.connect(1000);
            ChannelSftp sftp = (ChannelSftp) channel;
            //进入服务器指定的文件夹
            sftp.cd(fielPath);
            sftp.get(serverFileName,outputStream);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            session.disconnect();
            if (channel!=null)channel.disconnect();
        }
    }
    /**
     * 删除服务器指定文件
     * @param ip 连接ip
     * @param user 用户名
     * @param psw 密码
     * @param port 端口 <=0 为默认端口
     * @param fielPath 服务器文件路径
     * @param serverFileName 要删除的文件名
     * @throws Exception
     */
    public static void sftpFileDelete(String ip,int port, String user, String psw, String fielPath,String serverFileName) throws Exception {
        Session session =getSession( ip,  user,  psw,  port);
        Channel channel = null;
        try {
            //创建sftp通信通道
            channel = (Channel) session.openChannel("sftp");
            channel.connect(1000);
            ChannelSftp sftp = (ChannelSftp) channel;
            //进入服务器指定的文件夹
            sftp.cd(fielPath);
            sftp.rm(serverFileName);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            session.disconnect();
            if (channel!=null)channel.disconnect();
        }
    }
    /**
     * 查看指定目录所有文件
     * @param ip
     * @param user
     * @param psw
     * @param port
     * @param fielPath
     * @throws Exception
     */
    public static Vector  seeServerFileList(String ip, int port,String user, String psw,  String fielPath)throws Exception{
        Session session =getSession( ip,  user,  psw,  port);
        Channel channel = null;
        Vector v=null;
        try {
            //创建sftp通信通道
            channel = (Channel) session.openChannel("sftp");
            channel.connect(1000);
            ChannelSftp sftp = (ChannelSftp) channel;
            //进入服务器指定的文件夹
            sftp.cd(fielPath);
            //列出服务器指定的文件列表
             v = sftp.ls(fielPath);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            session.disconnect();
            if (channel!=null)channel.disconnect();
        }
        return  v;
    }
    /**
     * 连接服务器
     * @param ip 服务器地址
     * @param user 用户名
     * @param psw  密码
     * @param port  连接端口
     * @return
     * @throws Exception
     */
    public static Session getSession(String ip, String user, String psw, int port)throws Exception{
        Session session = null;
        JSch jsch = new JSch();
        if (port <= 0) {
            //连接服务器，采用默认端口
            session = jsch.getSession(user, ip);
        } else {
            session = jsch.getSession(user, ip, port);
        }
        //如果服务器连接不上，则抛出异常
        if (session == null) {
            throw new Exception("sftp session is null");
        }
        
      
          
        
        
        Properties sshConfig = new Properties();  
        sshConfig.put("StrictHostKeyChecking", "no");//不需要验证hostkey
        session.setConfig(sshConfig);  
        session.setPassword(psw);//设置密码
        session.connect(30000);//30s
        return  session;
    }

}
