package com.srinergi.LoginModule.rest.services;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import org.oasisopen.sca.annotation.Scope;
import org.springframework.context.ApplicationContext;
import com.google.gson.Gson;
import com.srinergi.LoginModule.model.IPasswordMgmtModel;
import com.srinergi.LoginModule.model.ISecurityQuestionsModel;
import com.srinergi.LoginModule.vo.QuesAnsws;
import com.srinergi.common.util.SpringUtil;


@Scope("COMPOSITE")
public class ForgotPasswordImpl implements JaxRsForgotPassword {

	private ApplicationContext appContext;

	public String getQuestions(@Context HttpServletRequest req) {
		
		String feeds;
		String username = req.getParameter("username");
		appContext=SpringUtil.getApplicationContext();
		ISecurityQuestionsModel ISQ =(ISecurityQuestionsModel) appContext.getBean("secQuestionsModel");
		Map<String, Object> obj = ISQ.getSecurityQuestions(username.trim());
		Gson gson = new Gson();
		feeds = gson.toJson(obj);
		System.out.println(feeds);
		return feeds;
	}

	public String checkQuesAnswers(QuesAnsws qa,@Context HttpServletRequest req) {
		
		String token=req.getHeader("stoken");
		appContext=SpringUtil.getApplicationContext();
		ISecurityQuestionsModel ISQ =(ISecurityQuestionsModel) appContext.getBean("secQuestionsModel");
		Map<String, String> obj = ISQ.validateSecurityAnswers(qa,token);

		Gson gson = new Gson();
		String feeds = gson.toJson(obj);
		System.out.println(feeds);
		return feeds;
		
	}

	
	public String storePassword(@Context HttpServletRequest req) {

		String token = req.getHeader("stoken");
		String newPassword = req.getParameter("confirmpass");
		System.out.println("new Password:"+newPassword);
		appContext=SpringUtil.getApplicationContext();
		IPasswordMgmtModel regmodel =(IPasswordMgmtModel) appContext.getBean("passwordMgmtModel");
		Map<String,String> resetPwdResponse=regmodel.resetPassword(token, newPassword);
		Gson gson = new Gson();
		String resetPwdResponseJSON = gson.toJson(resetPwdResponse);
		System.out.println(resetPwdResponseJSON);
		return resetPwdResponseJSON;
	}
	
}
