package com.srinergi.LoginModule.model;


import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.srinergi.LoginModule.dao.PasswordMgmtDAO;

@Service("passwordMgmtModel")
@Scope("prototype")
public class PasswordMgmtModelImpl implements IPasswordMgmtModel {

	@Autowired
	PasswordMgmtDAO pwdMgmt;
	
	public Map<String, Object> resetUserPassword(String token, String oldPassword,String newpassword,Integer enteredBy) {
	       
		Map<String,Object> resetPwdResponse = new LinkedHashMap<String, Object>();
		Map<String,String> responseMsg1=new LinkedHashMap<String, String>();
		try
		{
			responseMsg1=pwdMgmt.resetPassword(token, oldPassword, newpassword,enteredBy);
			Map<String,String> responseMsg2=new LinkedHashMap<String, String>();
			responseMsg2.put("errorStatus", responseMsg1.get("errorStatus"));
			responseMsg2.put("message", responseMsg1.get("message"));
			resetPwdResponse.put("responseMessage", responseMsg2);
		}
		catch(Exception e)
		{
			responseMsg1.put("errorStatus", "1");
			responseMsg1.put("message", "operation failed!");
			resetPwdResponse.put("responseMessage", responseMsg1);
			e.printStackTrace();
		}
		
		return resetPwdResponse;
		
	}

	public Map<String, String> resetPassword(String token,String newpassword) {
		
        Map<String,String> resetPwdResponse= new LinkedHashMap<String, String>();
        try
        {
        	resetPwdResponse=pwdMgmt.resetPwd(token, newpassword); 
        }
        catch(Exception e)
		{
        	resetPwdResponse.put("errorStatus", "1");
        	resetPwdResponse.put("message", "Fail!");
			e.printStackTrace();
		}
		
		return resetPwdResponse;
	}

	
}
