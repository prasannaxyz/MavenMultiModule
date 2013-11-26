package com.srinergi.LoginModule.rest.services;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import org.springframework.context.ApplicationContext;
import com.google.gson.Gson;
import com.srinergi.LoginModule.model.IPasswordMgmtModel;
import com.srinergi.LoginModule.model.IProfileSettingModel;
import com.srinergi.LoginModule.vo.ResetUserPassword;
import com.srinergi.common.model.TokenCheck;
import com.srinergi.common.util.SpringUtil;


public class ProfileSettingsPWDImpl implements JaxRsProfileSettings {

	private ApplicationContext appContext;

	public String resetUserPassword(ResetUserPassword reset,
			@Context HttpServletRequest request) {

		appContext = SpringUtil.getApplicationContext();
		Gson gson = new Gson();
		Map<String, Object> resetPwdResponse;
		String resetPwdResponseJSON;

		TokenCheck checkToken = (TokenCheck) appContext.getBean("tokenChecker");
		Map<String, String> sessionTrackInfo = checkToken.tokenInfo(request);

		if (Integer.parseInt(sessionTrackInfo.get("errorStatus")) == 1) {
			resetPwdResponse = new LinkedHashMap<String, Object>();
			Map<String, String> messageInitMap = new LinkedHashMap<String, String>();
			String messageInit = sessionTrackInfo.get("message");
			messageInitMap.put("errorStatus", "2");
			messageInitMap.put("message", messageInit);
			resetPwdResponse.put("responseMessage", messageInitMap);
			resetPwdResponseJSON = gson.toJson(resetPwdResponse);
		} else {
			IPasswordMgmtModel reg = (IPasswordMgmtModel) appContext
					.getBean("passwordMgmtModel");
			Integer enteredBy = Integer.parseInt(sessionTrackInfo.get("id"));
			resetPwdResponse = reg.resetUserPassword(
					request.getHeader("token"), reset.getOldPassword(),
					reset.getNewPassword(), enteredBy);

			resetPwdResponseJSON = gson.toJson(resetPwdResponse);
			System.out.println(resetPwdResponseJSON);
		}
		return resetPwdResponseJSON;
	}

	public String signout(@Context HttpServletRequest request) {
		Gson gson = new Gson();
		Map<String, Object> signoutResponse = new LinkedHashMap<String, Object>();
		;
		String signoutResponseJSON;
		appContext = SpringUtil.getApplicationContext();
		TokenCheck checkToken = (TokenCheck) appContext.getBean("tokenChecker");
		Map<String, String> sessionTrackInfo = checkToken.tokenInfo(request);

		if (Integer.parseInt(sessionTrackInfo.get("errorStatus")) == 1) {

			Map<String, String> messageInitMap = new LinkedHashMap<String, String>();
			String messageInit = sessionTrackInfo.get("message");
			messageInitMap.put("errorStatus", "2");
			messageInitMap.put("message", messageInit);
			signoutResponse.put("responseMessage", messageInitMap);
			signoutResponseJSON = gson.toJson(signoutResponse);
		} else {
			String userName = sessionTrackInfo.get("userName");
			IProfileSettingModel profSet = (IProfileSettingModel) appContext
					.getBean("profSettings");
			try {
				profSet.signout(userName);
			} catch (Exception e) {
				e.printStackTrace();
			}
			Map<String, String> messageInitMap = new LinkedHashMap<String, String>();
			String messageInit = sessionTrackInfo.get("message");
			messageInitMap.put("errorStatus", "0");
			messageInitMap.put("message", messageInit);
			signoutResponse.put("responseMessage", "Success");
			signoutResponseJSON = gson.toJson(signoutResponse);
		}

		return signoutResponseJSON;
	}

}
