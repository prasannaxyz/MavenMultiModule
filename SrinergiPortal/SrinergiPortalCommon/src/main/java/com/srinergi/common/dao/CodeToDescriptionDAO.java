package com.srinergi.common.dao;

import java.util.List;
import java.util.Map;

import com.srinergi.common.entity.DocumentsMasterEntity;
import com.srinergi.common.entity.ErrorCodesEntity;
import com.srinergi.common.entity.RoleMasterEntity;
import com.srinergi.common.entity.SecretQuestionsEntity;
import com.srinergi.common.entity.StatesMasterEntity;
import com.srinergi.common.entity.StatusCodeMasterEntity;

public interface CodeToDescriptionDAO {
      
	public Map<String, String> getRoles();
	public  List<RoleMasterEntity> getRolesList();
	
	public Map<String, String> getStatus();
	public  List<StatusCodeMasterEntity> getStatusList();
	
	public List<StatesMasterEntity> getStatesList();
	
	public  List<SecretQuestionsEntity> getSecretQuestionsList();
	
	public List<DocumentsMasterEntity> getDocumentsMasterList();
	
	public List<ErrorCodesEntity> getErrorCodesList();
}
