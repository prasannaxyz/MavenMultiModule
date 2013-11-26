package com.srinergi.LoginModule.dao;

import java.util.Map;

public interface PasswordMgmtDAO {
	
	 public Map<String, String> resetPassword(String token, String oldPassword,String newpassword,Integer enteredBy);
	 public Map<String,String> resetPwd(String token,String newpassword);

}
