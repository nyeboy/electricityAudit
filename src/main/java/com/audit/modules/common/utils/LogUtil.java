package com.audit.modules.common.utils;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * @author  liuyan
 * @date 2017年3月10日 
 */
public class LogUtil {    
    private Log log = null;    

    private LogUtil() {    
        log = LogFactory.getLog(this.getClass());    
    }    
     
    private LogUtil(Class<?> c) {    
        log = LogFactory.getLog(c);    
    }    
     
    private LogUtil(String className) {    
        log = LogFactory.getLog(className);    
    }    
     
    public static LogUtil getLogger() {    
        return new LogUtil();    
    }    
     
    public static LogUtil getLogger(Class<?> c) {    
             
        return new LogUtil(c);    
    }    
     
    public static LogUtil getLogger(String className) {    
        return new LogUtil(className);    
    }    
     
    public void trace(String info) {    
        if (log.isTraceEnabled())    
            log.trace(info);    
    }    
     
    public void debug(String info) {    
        if (log.isDebugEnabled())    
            log.debug(info);    
    }    
     
    public void info(String info) {    
        if (log.isInfoEnabled())    
            log.info(info);            
    }    
     
    public void warn(String info) {    
        if (log.isWarnEnabled())    
            log.warn(info);    
    }    
     
    public void error(String info) {    
        if (log.isErrorEnabled())    
            log.error(info);    
    }    
     
    public void fatal(String info) {    
        if (log.isFatalEnabled())    
            log.fatal(info);    
    }    
     
    public boolean isTraceEnabled() {    
        return log.isTraceEnabled();    
    }    
     
    public boolean isDebugEnabled() {    
        return log.isDebugEnabled();    
    }    
     
    public boolean isInfoEnabled() {    
        return log.isInfoEnabled();    
    }    
     
    public boolean isWarnEnabled() {    
        return log.isWarnEnabled();    
    }    
     
    public boolean isErrorEnabled() {    
        return log.isErrorEnabled();    
    }    
     
    public boolean isFatalEnabled() {    
        return log.isFatalEnabled();    
    }    
}   
