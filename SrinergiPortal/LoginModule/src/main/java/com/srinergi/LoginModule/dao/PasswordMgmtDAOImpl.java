package com.srinergi.LoginModule.dao;

import java.util.HashMap;
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

import com.srinergi.common.entity.ErrorCodesEntity;
import com.srinergi.common.entity.UserEntity;
import com.srinergi.common.entity.UserSessionTrackingEntity;
import com.srinergi.common.model.BCrypt;

@Repository("pwdMgmtDAO")
@Scope("prototype")
public class PasswordMgmtDAOImpl implements PasswordMgmtDAO {

	@Autowired
	SessionFactory sessionFacory;

	@Autowired
	LoginDAO login;

	@Transactional(rollbackFor = { Throwable.class })
	public Map<String, String> resetPassword(String token, String oldPassword,
			String newpassword,Integer enteredBy) {

		Map<String, String> resetPwdResponse = new LinkedHashMap<String, String>();

		Session session = sessionFacory.getCurrentSession();
		Query Query1 = session
				.createQuery("from UserEntity where userId = :id ");
		Query1.setParameter("id", enteredBy);
		List<UserEntity> userList = Query1.list();
		Iterator<UserEntity> userIt = userList.iterator();

		UserEntity user = null;
		String DBPassword = null;

		if (userIt.hasNext()) {
			user = userIt.next();
			DBPassword = user.getPassword();
		}

		if (BCrypt.checkpw(oldPassword, DBPassword)) {
			if (oldPassword.equals(newpassword)) {
				Object errorCode = session.load(ErrorCodesEntity.class, 17);
				ErrorCodesEntity errBean = (ErrorCodesEntity) errorCode;
				
				resetPwdResponse.put("errorStatus", "1");
				resetPwdResponse.put("message",errBean.getErrorDescription());

			} else {
				user.setPassword(BCrypt.hashpw(newpassword, BCrypt.gensalt()));
				user.setTempPassword((byte) 0);
				user.setTempPwd(null);
				user.setUpdatedBy(enteredBy);

				Object errorCode = session.load(ErrorCodesEntity.class, 6);
				ErrorCodesEntity errBean = (ErrorCodesEntity) errorCode;
				
				System.out.println("Password is saved successfully");
				resetPwdResponse.put("errorStatus", "0");
				resetPwdResponse.put("message", errBean.getErrorDescription());
			}
		} else {
			Object errorCode = session.load(ErrorCodesEntity.class, 4);
			ErrorCodesEntity errBean = (ErrorCodesEntity) errorCode;
			
			resetPwdResponse.put("errorStatus", "1");
			resetPwdResponse.put("message", errBean.getErrorDescription());
		}
		return resetPwdResponse;
	}

	//===========================================================================================================
	@Transactional()
	public Map<String, String> resetPwd(String token,String newPassword) {
		Map<String, String> resetPwdResponse = new HashMap<String, String>();
		Session session = sessionFacory.getCurrentSession();
		String username;
		String beforeSessionStart;

		Query userSessionTrackingQuery = session
				.createQuery("from UserSessionTrackingEntity where securityKey = :key ");
		userSessionTrackingQuery.setParameter("key", token);
		List<UserSessionTrackingEntity> userSesTrackList = userSessionTrackingQuery
				.list();
		Iterator<UserSessionTrackingEntity> userSesTrackIt = userSesTrackList
				.iterator();
		UserSessionTrackingEntity userSesionTrackObj = null;
		if (userSesTrackIt.hasNext()) {
			userSesionTrackObj = (UserSessionTrackingEntity) userSesTrackIt
					.next();
		}
		if (userSesionTrackObj == null) {
			Object errorCode=session.load(ErrorCodesEntity.class, 4);
			ErrorCodesEntity errBean=(ErrorCodesEntity)errorCode;
			System.out.println("Token not Matched");
			resetPwdResponse.put("errorStatus", "1");
			resetPwdResponse.put("message", errBean.getErrorDescription());
			return resetPwdResponse;
		}else {
			username = userSesionTrackObj.getUserName();
		}
		

		Query Query1 = session
				.createQuery("from UserEntity where userName = :name ");
		Query1.setParameter("name", username);
		List<UserEntity> userList = Query1.list();
		Iterator<UserEntity> userIt = userList.iterator();
		UserEntity userObj = null;
		if (userIt.hasNext()) {
			userObj = (UserEntity) userIt.next();
		}

		userObj.setPassword(BCrypt.hashpw(newPassword, BCrypt.gensalt()));
		userObj.setTempPassword((byte) 0);
		userObj.setTempPwd(null);

		System.out.println("Successfully saved");

		Object errorCode = session.load(ErrorCodesEntity.class, 6);
		ErrorCodesEntity errBean = (ErrorCodesEntity) errorCode;
		
		resetPwdResponse.put("errorStatus", "0");
		resetPwdResponse.put("message", errBean.getErrorDescription());

		return resetPwdResponse;
	}

}
