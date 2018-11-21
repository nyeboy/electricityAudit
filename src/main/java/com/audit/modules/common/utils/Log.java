package com.audit.modules.common.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author liuyan
 */
public final class Log {
    //系统默认日志
    private final static Logger logger = LoggerFactory.getLogger("log");
    //系统debug日志
    private final static Logger debug = LoggerFactory.getLogger("debug");


    public static void info(String s) {
        logger.info(s);
    }

    /**
     * 将错误信息记录到日志，系统将自动记录堆栈信息
     *
     * @param s
     */
    public static void error(String s) {
        StringBuilder sb = new StringBuilder(s + ":\n");
        StackTraceElement[] e = Thread.currentThread().getStackTrace();
        if (e.length > 2) {
            for (int i = 2; i < e.length; i++) {
                sb.append("    ").append(e[i].toString()).append("\n");
            }
        }
        logger.error(sb.toString());
    }

    /**
     * 将错误堆栈信息记录到日志
     *
     * @param t
     */
    public static void error(Throwable t) {
        logger.error(t.getMessage(), t);
    }

    /**
     * 将错误信息和堆栈信息记录到日志
     *
     * @param errorInfo
     * @param ex
     */
    public static void error(String errorInfo, Throwable ex) {
        logger.error(errorInfo, ex);
    }

    public static void debug(Object info) {
        debug.debug(info + "");
    }

}
