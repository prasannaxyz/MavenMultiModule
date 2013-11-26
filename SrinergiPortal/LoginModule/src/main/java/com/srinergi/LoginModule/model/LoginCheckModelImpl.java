package com.srinergi.LoginModule.model;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.srinergi.LoginModule.dao.LoginDAO;
@Service("loginModel")
@Scope("prototype")
public class LoginCheckModelImpl implements ILoginCheckModel{

	@Autowired
	LoginDAO login;
	public Map<String, String> authentication(String getUsername,String getPassword,HttpServletRequest request) {
		
		Map<String, String> loginResponse = new LinkedHashMap<String, String>();
		try
		{
			loginResponse=login.checkUserStatus(getUsername, getPassword,request);
		}
		catch(Exception e)
		{
			loginResponse.put("errorStatus", "1");
			loginResponse.put("message", "operation failed!");
			e.printStackTrace();
		}
		
		return loginResponse;
				
	}

}
