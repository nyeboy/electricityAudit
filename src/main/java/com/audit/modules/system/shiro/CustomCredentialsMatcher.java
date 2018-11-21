package com.audit.modules.system.shiro;

import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.SimpleCredentialsMatcher;

import com.audit.modules.common.utils.EncryptUtil;

public class CustomCredentialsMatcher extends SimpleCredentialsMatcher {

	public boolean doCredentialsMatch(AuthenticationToken authcToken, AuthenticationInfo info) {
		UsernamePasswordToken token = (UsernamePasswordToken) authcToken;

		Object tokenCredentials = encrypt(String.valueOf(token.getPassword()));
		Object accountCredentials = getCredentials(info);
		// 将密码加密与系统加密后的密码校验，内容一致就返回true,不一致就返回false
		// equals(tokenCredentials, accountCredentials) 目前不验证 return true
		return true;
	}

	// 将传进来密码加密方法
	private String encrypt(String data) {
		// 这里可以选择自己的密码验证方式 比如 md5或者sha256等
		String shparam = EncryptUtil.encryptSha256(data);
		return shparam;
	}
}
