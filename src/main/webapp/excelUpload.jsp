<%@page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <script type="text/javascript" src="js/extends/jquery-3.1.1.min.js"/>
    <script type="text/javascript">

        function  updateE(){
            var ar = new Array;
            var watthourExtendVOs = {
                watthourId:1,
                whetherMeter:0,
                endAmmeter:1562,
                electricLoss:2,
                remarks:"测试测试",
                unitPrice:0.99,
                totalEleciric:8978,
                dayAmmeter:12
            };
            ar.push(watthourExtendVOs);
            $("#wa").val(ar);
            alert($("#wa").val());
        }
    </script>
</head>
<body>
    站点信息导入：
    <form action="siteInfo/excelImport.do"  enctype="multipart/form-data" method="post">
        <input type="file" value="请上传文件" name="file">
        <input type="submit" value="上传">
    </form>

    成本中心导入：
    <form action="costcenter/costCenterImport.do"  enctype="multipart/form-data" method="post">
        <input type="file" value="请上传文件" name="file">
        <input type="submit" value="上传">
    </form>

    塔维站点导入：
    <form action="towerSite/excelImport.do"  enctype="multipart/form-data" method="post">
        <input type="file" value="请上传文件" name="file">
        <input type="submit" value="上传">
    </form>
</body>
</html>
