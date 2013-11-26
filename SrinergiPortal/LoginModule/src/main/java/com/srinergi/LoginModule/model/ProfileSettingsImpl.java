package com.srinergi.LoginModule.model;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.srinergi.common.entity.UserSessionTrackingEntity;

@Service("profSettings")
@Scope("prototype")
public class ProfileSettingsImpl implements IProfileSettingModel{
	
	@Autowired
	SessionFactory sessionFactory;

	@Transactional
	public void signout(String userName) {
		
		Session session=sessionFactory.getCurrentSession();
		UserSessionTrackingEntity ust=new UserSessionTrackingEntity();
		ust.setUserName(userName);
		session.delete(ust);
	}

}
