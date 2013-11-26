package com.srinergi.LoginModule.dao;

import java.util.List;
import java.util.Map;

import com.srinergi.LoginModule.vo.QuesAnsws;


public interface SecurityQuestionsDAO {
	
	public List<Map<String, String>> getSecurityQuestions();
	public Map<String, Object> getSecurityQuestions(String username);
	public Map<String, String> validateSecurityAnswers(QuesAnsws qa,String token);

}
