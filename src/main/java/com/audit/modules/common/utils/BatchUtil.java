package com.audit.modules.common.utils;

import org.mybatis.spring.SqlSessionTemplate;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * @author : jiadu
 * @Description : 批量处理工具类（用法参考SiteInfoServiceImpl.toInsertOrUpdate方法）
 * @date : 2017/4/13
 * Copyright (c) , IsoftStone All Right reserved.
 */

public class BatchUtil<T> {

    /**
     * @param : className 调用dao的全路径，methodName调用的方法名
     * @return :
     * @throws
     * @Description: 批量插入
     */
    public void batchSave(Collection<T> collections, String className, String methodName, SqlSessionTemplate sqlSessionTemplate) {
        List<T> data = new ArrayList<>(collections);
        int size = data.size();
        int unitNum = 500;
        int startIndex = 0;
        int endIndex = 0;
        while (size > 0) {
            if (size > unitNum) {
                endIndex = startIndex + unitNum;
            } else {
                endIndex = startIndex + size;
            }
            List<T> insertData = data.subList(startIndex, endIndex);
//            Method method = clazz.getMethod(methodName, List.class);
//            method.invoke(clazz, insertData);
            sqlSessionTemplate.insert(className + "." + methodName, insertData);
            size = size - unitNum;
            startIndex = endIndex;
        }
    }

    public void batchupdate(Collection<T> collections, String className, String methodName, SqlSessionTemplate sqlSessionTemplate) {
        List<T> data = new ArrayList<>(collections);
        int size = data.size();
        int unitNum = 500;
        int startIndex = 0;
        int endIndex = 0;
        while (size > 0) {
            if (size > unitNum) {
                endIndex = startIndex + unitNum;
            } else {
                endIndex = startIndex + size;
            }
            List<T> insertData = data.subList(startIndex, endIndex);
            sqlSessionTemplate.update(className + "." + methodName, insertData);
            size = size - unitNum;
            startIndex = endIndex;
        }
    }

    public void batchDelete(Collection<T> collections, String className, String methodName, SqlSessionTemplate sqlSessionTemplate) {
        List<T> data = new ArrayList<>(collections);
        int size = data.size();
        int unitNum = 500;
        int startIndex = 0;
        int endIndex = 0;
        while (size > 0) {
            if (size > unitNum) {
                endIndex = startIndex + unitNum;
            } else {
                endIndex = startIndex + size;
            }
            List<T> insertData = data.subList(startIndex, endIndex);
            sqlSessionTemplate.delete(className + "." + methodName, insertData);
            size = size - unitNum;
            startIndex = endIndex;
        }
    }
}
