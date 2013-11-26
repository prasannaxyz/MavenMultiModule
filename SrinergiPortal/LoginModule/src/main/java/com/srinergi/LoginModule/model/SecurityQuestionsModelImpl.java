package com.srinergi.LoginModule.model;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.srinergi.LoginModule.dao.SecurityQuestionsDAO;
import com.srinergi.LoginModule.vo.QuesAnsws;

@Service("secQuestionsModel")
@Scope("prototype")
public class SecurityQuestionsModelImpl implements ISecurityQuestionsModel {

	@Autowired
	SecurityQuestionsDAO questions;
	
	public List<Map<String, String>> getSecurityQuestions() {
		
		List<Map<String, String>> obj = questions.getSecurityQuestions();

		return obj;
	}

//******************************************************************************************
	public Map<String, Object> getSecurityQuestions(String username) {

		Map<String, Object> questionsObj=questions.getSecurityQuestions(username);
		
		
		return questionsObj;
	}

	//***************************************************************************************
	
	public Map<String, String> validateSecurityAnswers(QuesAnsws qa,String token) {
		
		Map<String,String> validateMsg=questions.validateSecurityAnswers(qa, token);
		
        return validateMsg;		
	}
}
