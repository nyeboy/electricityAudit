package com.audit.filter.exception;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import com.audit.modules.common.ResultVO;
import com.audit.modules.common.utils.Log;

/**
 * Created on 15-7-30.
 * 对异常的统一处理类
 * @author 王松
 */
public class ExceptionHandler implements HandlerExceptionResolver {
    @Override
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response,
                                         Object handler, Exception ex) {
        List<Throwable> throwable = getCauseAndPre(ex);
        Throwable cause = throwable.get(1);


        String msg = cause.getMessage();
        ResultVO result = ResultVO.failed(msg, ex.toString());
        boolean logEnable = true;
        //如果是ReturnException，说明该异常只是想返回特定值，而不是真的异常，所以不用记录异常日志
        if(cause instanceof ReturnException){
            logEnable = false;
        }
        if(logEnable){
            logError(request, ex);
        }
        render(response, result);
        return null;
    }
    private List<Throwable> getCauseAndPre(Throwable throwable){
        List<Throwable> result = new ArrayList<>();

        Throwable pre = throwable;
        Throwable cause = throwable.getCause();

        if(cause == null){
            result.add(throwable);
            result.add(throwable);
            return result;
        }

        while (cause.getCause() != null) {
            pre = cause;
            cause = cause.getCause();
        }
        result.add(pre);
        result.add(cause);

        return result;
    }
    private static void logError(HttpServletRequest request, Exception ex){
        String logInfo = (request.getRequestURL().toString() + "\n"
                + "    sessionId=" + request.getSession(true).getId()) + "\n"
                + "    parameters=" + request.getParameterMap();

        Log.error(logInfo, ex);
    }
    private static void render(HttpServletResponse response, ResultVO result) {
        PrintWriter writer = null;
        try {
            response.setContentType("application/json");
            writer = response.getWriter();
            writer.write(result.toString());
            writer.flush();
        } catch (IOException e) {
            Log.error("json render fail!", e);
        } finally {
            try {
                if (null != writer) {
                    writer.close();
                }
            } catch (Exception ex) {
                // do nothing
            }
        }
    }

}
