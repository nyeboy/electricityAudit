package com.audit.file.excel.service;

import java.util.List;

public interface SiteService
{
    void saveExcel2DB(List<Object[]> list) throws Exception;
}
