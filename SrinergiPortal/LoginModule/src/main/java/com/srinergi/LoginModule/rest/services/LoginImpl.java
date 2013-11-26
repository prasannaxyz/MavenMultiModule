package com.srinergi.LoginModule.rest.services;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;

import org.springframework.context.ApplicationContext;
import com.google.gson.Gson;
import com.srinergi.LoginModule.model.ILoginCheckModel;
import com.srinergi.common.util.SpringUtil;
import com.srinergi.LoginModule.vo.UserLogin;

public class LoginImpl implements JaxRsLogin {
	private ApplicationContext appContext;
	
	public String login(UserLogin user,@Context HttpServletRequest request) {

		String username = user.getUsername();
		String password = user.getPassword();
		appContext = SpringUtil.getApplicationContext();
		ILoginCheckModel login = (ILoginCheckModel) appContext
				.getBean("loginModel");
		Map<String, String> loginResponse = login.authentication(username,
				password,request);
		Gson gson = new Gson();
		String loginResponseJSON = gson.toJson(loginResponse);
		System.out.println(loginResponseJSON);
		return loginResponseJSON;
	}
}
