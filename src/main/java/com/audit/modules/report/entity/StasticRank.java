package com.audit.modules.report.entity;
/**
 * 
 * @Description: 综合排名统计   
 * @throws  
 * 
 * @author  杨芃
 * @date 2017年6月1日 下午2:30:57
 */
public class StasticRank {
    private String id;

    private String regionName;

    private String scec;

    private String proportion;

    private String rotary;

    private String powerrate;

    private String switchers;

    private String smartMeter;

    private String consistent;

    private String feedback;

    private String total;

    private String year;
    
    private String typeCode;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id == null ? null : id.trim();
    }

    public String getRegionName() {
        return regionName;
    }

    public void setRegionName(String regionName) {
        this.regionName = regionName == null ? null : regionName.trim();
    }

    public String getScec() {
        return scec;
    }

    public void setScec(String scec) {
        this.scec = scec == null ? null : scec.trim();
    }

    public String getProportion() {
        return proportion;
    }

    public void setProportion(String proportion) {
        this.proportion = proportion == null ? null : proportion.trim();
    }

    public String getRotary() {
        return rotary;
    }

    public void setRotary(String rotary) {
        this.rotary = rotary == null ? null : rotary.trim();
    }

    public String getPowerrate() {
        return powerrate;
    }

    public void setPowerrate(String powerrate) {
        this.powerrate = powerrate == null ? null : powerrate.trim();
    }

    public String getSwitchers() {
        return switchers;
    }

    public void setSwitchers(String switchers) {
        this.switchers = switchers == null ? null : switchers.trim();
    }

    public String getSmartMeter() {
        return smartMeter;
    }

    public void setSmartMeter(String smartMeter) {
        this.smartMeter = smartMeter == null ? null : smartMeter.trim();
    }

    public String getConsistent() {
        return consistent;
    }

    public void setConsistent(String consistent) {
        this.consistent = consistent == null ? null : consistent.trim();
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback == null ? null : feedback.trim();
    }

    public String getTotal() {
        return total;
    }

    public void setTotal(String total) {
        this.total = total == null ? null : total.trim();
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year == null ? null : year.trim();
    }

	public String getTypeCode() {
		return typeCode;
	}

	public void setTypeCode(String typeCode) {
		this.typeCode = typeCode;
	}
}