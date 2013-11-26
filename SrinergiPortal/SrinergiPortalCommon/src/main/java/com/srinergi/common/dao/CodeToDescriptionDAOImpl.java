package com.srinergi.common.dao;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.srinergi.common.entity.DocumentsMasterEntity;
import com.srinergi.common.entity.ErrorCodesEntity;
import com.srinergi.common.entity.RoleMasterEntity;
import com.srinergi.common.entity.SecretQuestionsEntity;
import com.srinergi.common.entity.StatesMasterEntity;
import com.srinergi.common.entity.StatusCodeMasterEntity;

@Transactional(readOnly=true)
@Repository("codeToDescDAO")
@Scope("prototype")
public class CodeToDescriptionDAOImpl implements CodeToDescriptionDAO {
	@Autowired
    private SessionFactory sessionFactory;
	
	public  List<RoleMasterEntity> getRolesList() {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("FROM RoleMasterEntity").setCacheable(true);
		List<RoleMasterEntity> RoleList = query.list();
		return RoleList;
	}

	public Map<String, String> getRoles() {

		Map<String, String> roles = new LinkedHashMap<String, String>();
		Iterator<RoleMasterEntity> RolesCodeit = getRolesList().iterator();
		while (RolesCodeit.hasNext()) {
			RoleMasterEntity bean = (RoleMasterEntity) RolesCodeit.next();
			roles.put(bean.getRoleCode(), bean.getRoleDesc());
		}

		return roles;
	}
//==============================================================================================================
	public  List<StatusCodeMasterEntity> getStatusList() {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("FROM StatusCodeMasterEntity").setCacheable(true);
		List<StatusCodeMasterEntity> StatusMasterList = query.list();
		return StatusMasterList;
	}

	public Map<String, String> getStatus() {
		Map<String, String> status = new LinkedHashMap<String, String>();
		Iterator<StatusCodeMasterEntity> Statusit = getStatusList().iterator();
		while (Statusit.hasNext()) {

			StatusCodeMasterEntity bean = (StatusCodeMasterEntity) Statusit.next();
			status.put(bean.getStatusCode(), bean.getStatusDescription());
			//System.out.println(bean.getStatusCode()+" "+ bean.getStatusDescription());
		}
		return status;
	}
//=====================================================================================
	public List<StatesMasterEntity> getStatesList() {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("FROM StatesMasterEntity")
				.setCacheable(true);
		List<StatesMasterEntity> StatesList = query.list();
		return StatesList;
	}

	
//====================================================================================
	public  List<SecretQuestionsEntity> getSecretQuestionsList() {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("FROM SecretQuestionsEntity")
				.setCacheable(true);
		List<SecretQuestionsEntity> SecretQuestionsList = query.list();
		return SecretQuestionsList;
	}
//=====================================================================================
	public List<DocumentsMasterEntity> getDocumentsMasterList() {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("FROM DocumentsMasterEntity")
				.setCacheable(true);
		List<DocumentsMasterEntity> DocumentsMasterList = query.list();
		return DocumentsMasterList;
	}
	
	
//======================================================================================	
	public List<ErrorCodesEntity> getErrorCodesList() {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("FROM ErrorCodesEntity")
				.setCacheable(true);
		List<ErrorCodesEntity> ErrorCodesList = query.list();
		return ErrorCodesList;
	}
	
	
}
