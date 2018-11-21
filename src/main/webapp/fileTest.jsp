<%@page language="java" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<body>
	<a
		href="<%=basePath%>/fileOperator/fileDownLoad.do?fileID=aedf6d2526984a879ffe9bd0b0e90afb">文件下载</a>
	<img
		src="<%=basePath%>/fileOperator/fileDownLoad.do?fileID=aedf6d2526984a879ffe9bd0b0e90afb"
		alt="wenjian">
	<form action="<%=basePath%>/fileOperator/fileUpload.do" method="post"
		enctype="multipart/form-data">
		<input type="file" name="files" /> <input type="submit" value="Submit" />
	</form>
	</form>
</body>
</html>
