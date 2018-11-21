package com.audit.modules.towerbasedata.trans.entity;
/**
 * @author : 塔维转供电附件表实体类
 * @Description :
 * @date : 
 * Copyright (c) , IsoftStone All Right reserved.
 */
public class TowerTransEleFile {
	private String id;
    private String filename;//附件名
    private String filepath;//附件地址
    private String note;//说明
    private String creatorid;//上传人ID
    private String creator;//上传人
    private Long totalbytes;//总字节
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
	public String getFilepath() {
		return filepath;
	}
	public void setFilepath(String filepath) {
		this.filepath = filepath;
	}
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	public String getCreatorid() {
		return creatorid;
	}
	public void setCreatorid(String creatorid) {
		this.creatorid = creatorid;
	}
	public String getCreator() {
		return creator;
	}
	public void setCreator(String creator) {
		this.creator = creator;
	}
	public Long getTotalbytes() {
		return totalbytes;
	}
	public void setTotalbytes(Long totalbytes) {
		this.totalbytes = totalbytes;
	}
	public String getExt() {
		return ext;
	}
	public void setExt(String ext) {
		this.ext = ext;
	}

}
