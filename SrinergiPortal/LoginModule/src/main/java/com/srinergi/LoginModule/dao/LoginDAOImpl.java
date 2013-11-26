package com.srinergi.LoginModule.dao;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import nl.bitwalker.useragentutils.UserAgent;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.srinergi.common.entity.ErrorCodesEntity;
import com.srinergi.common.entity.MapUsersToRolesEntity;
import com.srinergi.common.entity.RegistrationEntity;
import com.srinergi.common.entity.UserAgentDetailsEntity;
import com.srinergi.common.entity.UserEntity;
import com.srinergi.common.entity.UserSessionTrackingEntity;
import com.srinergi.common.model.BCrypt;
@Repository("loginDAO")
@Scope("prototype")
public class LoginDAOImpl implements LoginDAO {

	@Autowired
	private SessionFactory sessionFactory;
	private Properties prop = new Properties();
	private DateFormat df = new SimpleDateFormat("MM-dd-yyyy");

	@Transactional()
	public Map<String, String> checkUserStatus(String username, String password,HttpServletRequest request) {

		Map<String, String> loginResponse = new LinkedHashMap<String, String>();
		Date date = null;
		Integer userId;
		String uname = null, pwd = null, email = null, fname = null, lname = null, role = null;
		String lastLogin = null;
		Byte locked = null;
		UserEntity user = null;
		Session session = sessionFactory.getCurrentSession();
		Query Query1 = session
				.createQuery("from UserEntity where userName = :name ");
		Query1.setParameter("name", username);
		List<UserEntity> userList = Query1.list();
		Iterator<UserEntity> userIt = userList.iterator();

		if (userIt.hasNext()) {
			user = userIt.next();

			uname = user.getUserName();
			pwd = user.getPassword();
			email = user.getEmailId();
			fname = user.getFirstName();
			lname = user.getLastName();
			if (user.getLastLogin() != null) {
				lastLogin = df.format(user.getLastLogin());
			} else {
				lastLogin = "";
			}
			userId = user.getUserId();
			locked = user.getLocked();
			// Get Role based on user
			Query Query2 = session
					.createQuery("from MapUsersToRolesEntity where userId = :id ");
			Query2.setParameter("id", userId);
			List<MapUsersToRolesEntity> roleList = Query2.list();
			Iterator<MapUsersToRolesEntity> roleIt = roleList.iterator();
			MapUsersToRolesEntity roleObj = null;
			if (roleIt.hasNext()) {
				roleObj = (MapUsersToRolesEntity) roleIt.next();
			}
			role = roleObj.getRoleCode();

		} else {

			Query Query3 = session
					.createQuery("from RegistrationEntity where userName = :name ");
			Query3.setParameter("name", username);
			List<RegistrationEntity> regList = Query3.list();
			Iterator<RegistrationEntity> regIt = regList.iterator();
			if (regIt.hasNext()) {
				Object errorCode=session.load(ErrorCodesEntity.class, 1);
				ErrorCodesEntity errBean=(ErrorCodesEntity)errorCode;
				System.out.println("Your registration is in pending status");
				loginResponse.put("errorStatus", "1");
				loginResponse.put("message",errBean.getErrorDescription());
				loginResponse.put("token", "null");
				loginResponse.put("user", "null");
				loginResponse.put("role", "null");

			} else {
				Object errorCode=session.load(ErrorCodesEntity.class, 2);
				ErrorCodesEntity errBean=(ErrorCodesEntity)errorCode;
				
				System.out.println("Wrong username* or password");
				loginResponse.put("errorStatus", "1");
				loginResponse.put("message", errBean.getErrorDescription());
				loginResponse.put("token", "null");
				loginResponse.put("user", "null");
				loginResponse.put("role", "null");
			}
			return loginResponse;
		}

		// System.out.println("****Lock value=" + locked);

		if (locked == 1)// True
		{
			Object errorCode=session.load(ErrorCodesEntity.class, 3);
			ErrorCodesEntity errBean=(ErrorCodesEntity)errorCode;
			
			System.out.println("Account has been locked");
			loginResponse.put("errorStatus", "1");
			loginResponse.put("message", errBean.getErrorDescription());
			loginResponse.put("token", "null");
			loginResponse.put("user", "null");
			loginResponse.put("role", "null");

			return loginResponse;
		} else if (username.toLowerCase().equals(uname.toLowerCase()) && BCrypt.checkpw(password, pwd)) {
			// Success authentication
			// Apply BCrypt to username
			String token = BCrypt.hashpw(username, BCrypt.gensalt());
			date = new java.util.Date();
			// set login time in users table
			user.setLastLogin(date);
			Object errorCode=session.load(ErrorCodesEntity.class, 6);
			ErrorCodesEntity errBean=(ErrorCodesEntity)errorCode;

			loginResponse.put("errorStatus", "0");
			loginResponse.put("message", errBean.getErrorDescription());
			loginResponse.put("token", token);
			loginResponse.put("user", username);
			loginResponse.put("role", role);
			loginResponse.put("firstName", fname);
			loginResponse.put("lastName", lname);
			loginResponse.put("lastLogin", lastLogin);

			//UserAgentDetails
			String userAgent=request.getHeader("user-agent");
			UserAgent ua = UserAgent.parseUserAgentString(userAgent);
			Properties prop = System.getProperties();
	        Set<Object> keySet = prop.keySet();
	        String osVersion = null;
	        for(Object obj : keySet){
	        	if(obj.toString().equals("os.version"))
	        	{
	            osVersion=System.getProperty(obj.toString());
	        	}
	        }
	        
			UserAgentDetailsEntity uad=new UserAgentDetailsEntity();
			uad.setUserId(userId);
			uad.setBrowserType(ua.getBrowser().toString());
			uad.setBrowserVersion(ua.getBrowserVersion().getMajorVersion());
			uad.setOsType(ua.getOperatingSystem().toString());
			uad.setOsVersion(osVersion);
			uad.setIpAddress(request.getRemoteAddr());
			uad.setDateCreated(new Date());
			//save UserAgent details
			session.persist(uad);
			
			UserSessionTrackingEntity ust = (UserSessionTrackingEntity) session
					.get(UserSessionTrackingEntity.class, username);
			if (ust != null) {
				// Update token and time
				ust.setSecurityKey(token);
				ust.setSessionStart(date);
				ust.setIpAddress(request.getRemoteAddr());
				// Count set to zero if Login is success
				ust.setForgotPWSeqCount(0);
			} else {
				//UserSessionTracking
				ust = new UserSessionTrackingEntity();
				ust.setUserId(userId);
				ust.setSecurityKey(token);
				ust.setUserName(username);
				ust.setFirstName(fname);
				ust.setLastName(lname);
				ust.setRole(role);
				ust.setEmail(email);
				ust.setSessionStart(date);
				ust.setIpAddress(request.getRemoteAddr());
				// count Value is zero by default
				ust.setForgotPWSeqCount(0);
				// Save usersessiontracking
				session.save(ust);
				
				
			}

		} else {
			// Wrong password
			UserSessionTrackingEntity ust = (UserSessionTrackingEntity) session
					.get(UserSessionTrackingEntity.class,
							username);
			String token = BCrypt.hashpw(username, BCrypt.gensalt());
			if (ust != null) {
				// Update count and ip
				date = new java.util.Date();
				ust.setIpAddress(request.getRemoteAddr());
				// count is incremented by 1
				ust.setForgotPWSeqCount(ust.getForgotPWSeqCount() + 1);
				Integer patm = null;
				try {
					prop.load(LoginDAOImpl.class.getClassLoader().getResourceAsStream(
							"properties/global.properties"));
					patm = Integer.parseInt(prop.getProperty("password-attempts"));

				} catch (IOException ex) {
					ex.printStackTrace();
				}

				if (ust.getForgotPWSeqCount() >= patm) {
					Byte i = 1;
					user.setLocked(i);
				}
			} else {
				//date = new java.util.Date();
				ust = new UserSessionTrackingEntity();
				ust.setUserId(userId);
				ust.setSecurityKey(token);
				ust.setUserName(username);
				ust.setFirstName(fname);
				ust.setLastName(lname);
				ust.setRole(role);
				ust.setEmail(email);
				ust.setSessionStart(null);
				// count Value is 1 at first time
				ust.setForgotPWSeqCount(1);
				ust.setIpAddress(request.getRemoteAddr());
				//Save userSessionTracking
				session.persist(ust);
				
			}

			Object errorCode=session.load(ErrorCodesEntity.class, 2);
			ErrorCodesEntity errBean=(ErrorCodesEntity)errorCode;
			
			System.out.println("Wrong Username or Password*");
			loginResponse.put("errorStatus", "1");
			loginResponse.put("message", errBean.getErrorDescription());
			loginResponse.put("token", "null");
			loginResponse.put("user", "null");
			loginResponse.put("role", "null");
		}

		return loginResponse;
	}

}
