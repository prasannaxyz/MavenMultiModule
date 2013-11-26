package com.srinergi.LoginModule.dao;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;


public interface LoginDAO {
	
  public Map<String, String> checkUserStatus(String Username,String Password,HttpServletRequest request);
 
}
