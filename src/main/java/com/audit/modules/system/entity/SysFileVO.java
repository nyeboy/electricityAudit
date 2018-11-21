package com.audit.modules.system.entity;

import java.io.Serializable;

/**
 * @author : jiadu
 * @Description : 附件VO
 * @date : 2017/3/12
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class SysFileVO implements Serializable{
    private static final long serialVersionUID = 2172058456481881046L;
    private String id;
    private String filename;//附件名
    private String ext;//扩展名

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getExt() {
        return ext;
    }

    public void setExt(String ext) {
        this.ext = ext;
    }
}
