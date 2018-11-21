<%@page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'MyUser.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
  </head>
  
  <body>
      <div>
        <table id="createModel">
          <tr>
            <td>流程名字：</td>
            <td><input name="name" value="电费稽核"/></td>
          </tr>
          <tr>
            <td>类型：</td>
            <td>
              <select name="type" onchange="changeType()">
                <option value="mandimension">自维</option>
                <option value="pagodadimension">塔维</option>
                <option value="3">基础数据变更</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>流程说明：</td>
            <td><input name="desc" value="说明"/></td>
          </tr>
          <tr>
            <td>地市：</td>
            <td>
              <select name="city">
                <option value="28">成都</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>区县：</td>
            <td>
              <select name="county">
                <option value="1186">锦江区</option>
              </select>
            </td>
          </tr>
        </table>
        <table id="electricity">
          <tr class="setp">
            <td id="index">1</td>
            <td id="stepName">第一级审批人</td>
            <td><input name="approver" value="33"/></td>
          </tr>
          <tr class="setp">
            <td id="index">2</td>
            <td id="stepName">第二级审批人</td>
            <td><input name="approver" value="35"/></td>
          </tr>
          <tr class="fixedSetp">
            <td id="index">3</td>
            <td id="stepName">第三级审批人</td>
            <td><input name="approver" value="36"/></td>
          </tr>
          <tr class="fixedSetp">
            <td id="index">4</td>
            <td id="stepName">第四级审批人</td>
            <td><input name="approver" value="37"/></td>
          </tr>
          <tr>
            <td colspan="3"><button onclick="createModel()">创建</button></td>
          </tr>
        </table>
        
        <table id="basicData" style="display: none">
          <tr class="basicDataFiex">
            <td id="index">1</td>
            <td id="stepName">地市网络部分管经理审</td>
            <td><input name="approver" value="33"/></td>
          </tr>
          <tr class="basicDataFiex">
            <td id="index">2</td>
            <td id="stepName">基础数据管理员审核</td>
            <td><input name="approver" value="35"/></td>
          </tr>
          <tr>
            <td colspan="3"><button onclick="createDataModel()">创建</button></td>
          </tr>
        </table>
      </div>
      
      <div style="margin-top: 70px;">
        <label>已有流程</label>
      </div>
      <div>
        <table>
          <tr>
            <td>流程名字</td>
          </tr>
          <c:forEach var="definition" items="${definitions}">
          <tr>
            <td>${definition.name }</td>
          </tr>
          </c:forEach>
        </table>
      </div>
      <script type="text/javascript" src="<%=request.getContextPath() %>/js/extends/jquery-3.1.1.min.js"></script>
      <script type="text/javascript">
        function createModel() {
        	var data = {
        	  "name" : $("#createModel input[name='name']").val(),
        	  "desc" : $("#createModel input[name='desc']").val(),
        	  "city" : $("#createModel select[name='city']").val(),
        	  "county" : $("#createModel select[name='county']").val(),
        	  "type" : $("select[name='type']").val()
        	}
        	
        	debugger;
        	// 可变节点
        	var setpRows = $(".setp");
        	var setps = new Array();
        	for (var i = 0; i < setpRows.length; i++) {
        		var setp = {};
        		var curRow = setpRows[i];
        		setp["index"] = $(curRow).find("#index").text();
        		setp["stepName"] = $(curRow).find("#stepName").text();
        		setp["approver"] = $(curRow).find("input[name='approver']").val();
        		setp["type"] = "variable";
        		setps.push(setp);
        	}
        	data["variableSetps"] = setps;
        	
        	// 固定节点 
        	var setpRows = $(".fixedSetp");
        	var setps = new Array();
        	for (var i = 0; i < setpRows.length; i++) {
        		var setp = {};
        		var curRow = setpRows[i];
        		setp["index"] = $(curRow).find("#index").text();
        		setp["stepName"] = $(curRow).find("#stepName").text();
        		setp["approver"] = $(curRow).find("input[name='approver']").val();
        		setp["type"] = "fixed";
        		setps.push(setp);
        	}
        	data["fixedSetps"] = setps;
        	
        	debugger;
        	$.ajax({ 
                type:"POST", 
                url:"workflowManage/createModel.do", 
                dataType:"json",      
                contentType:"application/json",               
                data:JSON.stringify(data), 
                success:function(data){ 
                          debugger;                 
                } 
            });
        }
        
        // 查询
        var queryData = {
        	"city" : "成都",
        	"type" : "mandimension"
        }
        $.post("workflowManage/queryWorkflowPage.do", queryData, function(rs){
        	debugger;
        }, "json")
        
        function changeType() {
        	var type = $("select[name='type']").val();
        	if (type == "3") {
        		$("#electricity").hide();
        		$("#basicData").show();
        		$("#createModel input[name='name']").val("基础数据修改");
        	}
        	if (type == "mandimension" || type == "pagodadimension") {
        		$("#electricity").show();
        		$("#basicData").hide();
        		$("#createModel input[name='name']").val("电费稽核");
        	}
        }
        
        function createDataModel() {
        	var data = {
              	  "name" : $("#createModel input[name='name']").val(),
              	  "desc" : $("#createModel input[name='desc']").val(),
              	  "city" : $("#createModel select[name='city']").val(),
              	  "county" : $("#createModel select[name='county']").val(),
              	  "type" : "pagodadimension"
              	}
              	
              	// 固定节点 
              	var setpRows = $(".basicDataFiex");
              	var setps = new Array();
              	for (var i = 0; i < setpRows.length; i++) {
              		var setp = {};
              		var curRow = setpRows[i];
              		setp["index"] = $(curRow).find("#index").text();
              		setp["stepName"] = $(curRow).find("#stepName").text();
              		setp["approver"] = $(curRow).find("input[name='approver']").val();
              		setp["stepType"] = "variable";
              		setps.push(setp);
              	}
              	data["variableSetps"] = setps;
              	
              	debugger;
              	$.ajax({ 
                      type:"POST", 
                      url:"workflowManage/createModel.do", 
                      dataType:"json",      
                      contentType:"application/json",               
                      data:JSON.stringify(data), 
                      success:function(data){ 
                                debugger;                 
                      } 
                  });
        }
        
      </script>
  </body>
</html>
