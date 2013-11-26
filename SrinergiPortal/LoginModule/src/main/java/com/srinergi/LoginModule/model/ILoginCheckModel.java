package com.srinergi.LoginModule.model;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface ILoginCheckModel {
	public Map<String, String> authentication(String getUsername,String getPassword,HttpServletRequest request);
	
}
