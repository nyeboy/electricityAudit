package com.audit.modules.site.entity;

import com.google.common.collect.Lists;

import java.io.Serializable;
import java.util.List;

/**
 * @author : jiadu
 * @Description :
 * @date : 2017/4/14
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class ExcelErrorInfo implements Serializable {
    private String message;
    private List<Integer> rows = Lists.newArrayList();

    public List<Integer> getRows() {
        return rows;
    }

    public void setRows(List<Integer> rows) {
        this.rows = rows;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        StringBuffer buffer = new StringBuffer();
        String m = "";
        if (rows.size() > 0) {
            buffer.append("第【");
            for (Integer row : rows) {
                buffer.append(row).append(",");
            }
            m = buffer.substring(0, buffer.length() - 1);
            m += "】 行 " + message;
        } else {
            return "";
        }
        return m;
    }
}
