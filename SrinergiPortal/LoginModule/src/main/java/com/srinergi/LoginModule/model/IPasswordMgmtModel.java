package com.srinergi.LoginModule.model;

import java.util.Map;

public interface IPasswordMgmtModel {
	public Map<String, Object> resetUserPassword(String token, String oldPassword,String newpassword,Integer enteredBy);
	public Map<String, String> resetPassword(String token,String newpassword);

}
