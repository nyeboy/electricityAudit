<%@page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<body>
<form action="<%=basePath%>/myUserController/addUser.do" method="post">
    姓名：<input type="text" name="name" id="name">
    年龄：<input type="text" name="age" id="age">
    <input type="submit">
</form>
</body>
</html>
