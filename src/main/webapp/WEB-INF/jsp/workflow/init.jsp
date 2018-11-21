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
        <button onclick="startFlow()">自维启动</button>
      </div>
      
      <div>
        <button onclick="powerStart()">塔维启动</button>
      </div>
      
      <div>
        <button onclick="dataChangeStart()">基础数据启动</button>
      </div>
      
      <div>
        <table>
          <thead>
            <tr>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="table">
          </tbody>
        </table>
      </div>
      <div>
        <script type="text/javascript" src="<%=request.getContextPath() %>/js/extends/jquery-3.1.1.min.js"></script>
        <script type="text/javascript">
           /*  var data = new Array();
            data.push({'instanceId':'5007','approveState':1});
            data.push({'instanceId':'5001','approveState':1});
            $.ajax({ 
                type:"POST", 
                url:"workflow/approveList.do", 
                dataType:"json",      
                contentType:"application/json",               
                data:JSON.stringify(data), 
                success:function(data){ 
                          debugger;                 
                } 
             }); */
             
             $.post("workflow/queryFlow.do",{
            	 "pageNo":1,
            	 "pageSize":10
             },function(rs){
            	 for (var i = 0; i < rs.data.results.length; i++ ) {
            		 var rowData = rs.data.results[i];
            		 var tr_row = "<tr><td>";
            		 tr_row += '<a href="javascript:;  click=lookUp(' + rowData.instanceId + ')">查看</a> ';
            		 if (rowData.flowState == 0 && rowData.operation == true) {
            			 tr_row += '<a href="javascript:; click=approve(' + rowData.instanceId + ',' + 1 + ',' + rowData.flowState + ')">提交(被驳回)</a>'
            		 }
            		 if (rowData.flowState == 1 && rowData.operation == true) {
            			 tr_row += '<a href="javascript:; click=approve(' + rowData.instanceId + ',' + 1 + ',' + rowData.flowState + ')">提交(等待提交稽核)</a>';
            		 }
            		 if (rowData.flowState == 2 && rowData.operation == true) {
            			 tr_row += '<a href="javascript:; click=approve(' + rowData.instanceId + ',' + 1 + ',' + rowData.flowState + ')">通过(审批中)</a> ';
            			 tr_row += '<a href="javascript:; click=approve(' + rowData.instanceId + ',' + -1 + ',' + rowData.flowState + ')">驳回(审批中)</a>';
            		 }
            		 if (rowData.flowState == 3 && rowData.operation == true) {
            			 tr_row += '<a href="javascript:; click=approve(' + rowData.instanceId + ',' + 1 + ',' + rowData.flowState + ')">通过(审批中)</a> ';
            			 tr_row += '<a href="javascript:; click=approve(' + rowData.instanceId + ',' + -1 + ',' + rowData.flowState + ')">驳回(审批中)</a>';
            		 }
            		 if (rowData.flowState == 4 && rowData.operation == true) {
            			 tr_row += '<a href="javascript:; click=approve(' + rowData.instanceId + ',' + 1 + ',' + rowData.flowState + ')">通过(审批中)</a> ';
            			 tr_row += '<a href="javascript:; click=approve(' + rowData.instanceId + ',' + -1 + ',' + rowData.flowState + ')">直接结束(审批中)</a>';
            		 }
            		 if (rowData.flowState == 5 && rowData.operation == true) {
            			 tr_row += '<a href="javascript:; click=approve(' + rowData.instanceId + ',' + 1 + ',' + rowData.flowState + ')">通过(审批中)</a> ';
            			 tr_row += '<a href="javascript:; click=approve(' + rowData.instanceId + ',' + -1 + ',' + rowData.flowState + ')">驳回(审批中)</a>';
            		 }
            		 if (rowData.flowState != -1) {
            			 tr_row += '<a href="workflow/deleteTask.do?instanceId=' + rowData.instanceId + '" target="_top">撤销</a>';
            		 }
            		 
            		 tr_row += "</td></tr>";
                	 $("#table").append(tr_row);
            	 }
            	 
             },"json");
             
             function approve(instanceId,approveState,flowState) {
            	 $.post("workflow/approve.do",{
            		 "instanceId" : instanceId,
            		 "approveState" : approveState,
            		 "flowState" : flowState
            	 },function(rs){
            		 alert(rs.message)
            	 },"json")
             }
             
             function startFlow() {
	             $.post("workflow/start.do", {}, function(rs) {
	            	 debugger;
	             }, "json");
             }
             
             function lookUp(instanceId) {
            	 debugger;
            	 $.post("workflow/queryApprovalDetails.do", {"instanceId" : instanceId}, function(rs) {
	            	 debugger;
	             }, "json");
             }
             
             function powerStart() {
            	 $.post("towerWorkflow/start.do", {}, function(rs) {
	            	 debugger;
	             }, "json");
             }
             
             function dataChangeStart() {
            	 $.post("basicDataChange/start.do", {}, function(rs) {
            		 
	             }, "json");
             }
             
            /*  $.post("workflow/querySendInfo.do",{
            	 "pageNo":1,
            	 "pageSize":10
             },function(rs){
            	 debugger;
             },"json") */
             
             /* $.post("workflow/sendOut.do",{
            	 "id":1
             },function(rs){
            	 debugger;
             },"json") */
        </script>
      </div>
  </body>
</html>
