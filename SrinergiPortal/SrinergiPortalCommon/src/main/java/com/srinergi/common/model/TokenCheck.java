package com.srinergi.common.model;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Projections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.srinergi.common.entity.ErrorCodesEntity;
import com.srinergi.common.entity.UserSessionTrackingEntity;


@Service("tokenChecker")
@Scope("prototype")
public class TokenCheck {

	private Properties prop = new Properties();

	@Autowired
	private SessionFactory sessionFactory;

	@Transactional()
	public Map<String, String> tokenInfo(HttpServletRequest req) {
		Session session = sessionFactory.getCurrentSession();
		Map<String, String> tokenChekObj = new LinkedHashMap<String, String>();
		if (req.getHeader("token") == null) {
			Object errorCode = session.load(ErrorCodesEntity.class, 7);
			ErrorCodesEntity errBean = (ErrorCodesEntity) errorCode;

			System.out.println("Token cannnot be null");
			tokenChekObj.put("errorStatus", "1");
			tokenChekObj.put("message", errBean.getErrorDescription());
			return tokenChekObj;

		}
		String token = req.getHeader("token");

		// Get Username based on token
		Query userSessionTrackingQuery = session
				.createQuery("from UserSessionTrackingEntity where securityKey = :key ");
		userSessionTrackingQuery.setParameter("key", token);
		List<UserSessionTrackingEntity> userSesTrackList = userSessionTrackingQuery
				.list();
		Iterator<UserSessionTrackingEntity> userSesTrackIt = userSesTrackList
				.iterator();
		UserSessionTrackingEntity userSessionTrackObj = null;
		if (userSesTrackIt.hasNext()) {
			userSessionTrackObj = (UserSessionTrackingEntity) userSesTrackIt
					.next();
		}
		if (userSessionTrackObj == null) {
			Object errorCode = session.load(ErrorCodesEntity.class, 4);
			ErrorCodesEntity errBean = (ErrorCodesEntity) errorCode;

			System.out.println("Token not Matched");
			tokenChekObj.put("errorStatus", "1");
			tokenChekObj.put("message", errBean.getErrorDescription());
			return tokenChekObj;
		} else {
			Timestamp t1 = null, t2 = null;
			t1 = (Timestamp) userSessionTrackObj.getSessionStart();
			t2 = new Timestamp(new Date().getTime());

			long ms1 = t1.getTime();
			long ms2 = t2.getTime();
			long diff = ms2 - ms1;

			int min = (int) (diff / (1000 * 60));
			System.out.println("Time diff in min:" + min);
			// Read session-timeout value
			Integer timeout = 0;
			Integer tableCount = 0;
			try {
				prop.load(TokenCheck.class.getClassLoader()
						.getResourceAsStream("properties/global.properties"));
				timeout = Integer.parseInt(prop.getProperty("session-timeout"));
				tableCount = Integer.parseInt(prop.getProperty("table-count"));

			} catch (IOException ex) {
				ex.printStackTrace();
			}

			if (min >= timeout) {
				Object errorCode = session.load(ErrorCodesEntity.class, 5);
				ErrorCodesEntity errBean = (ErrorCodesEntity) errorCode;

				System.out.println("Timeout");
				tokenChekObj.put("errorStatus", "1");
				tokenChekObj.put("message", errBean.getErrorDescription());
				return tokenChekObj;
			} else {
				// update UserSessionTracking table
				userSessionTrackObj.setSessionStart(new Date());

				Criteria criteria = session
						.createCriteria(UserSessionTrackingEntity.class);
				criteria.setProjection(Projections.rowCount());
				Long rowCount = null;
				List<?> userSessionTrackList = criteria.list();
				if (userSessionTrackList != null) {
					rowCount = (Long) (userSessionTrackList.get(0));
					// System.out.println("Row count:"+rowCount);
					if (rowCount > tableCount) {
						Calendar now = Calendar.getInstance();
						now.add(Calendar.MINUTE, -timeout);
						Date d = new java.sql.Date(now.getTimeInMillis());
						Query qry = session
								.createQuery("delete from UserSessionTrackingEntity u where u.sessionStart<=:time");
						qry.setParameter("time", d);
						qry.executeUpdate();
					}
				}
				Object errorCode = session.load(ErrorCodesEntity.class, 6);
				ErrorCodesEntity errBean = (ErrorCodesEntity) errorCode;

				tokenChekObj.put("errorStatus", "0");
				tokenChekObj.put("message", errBean.getErrorDescription());
				tokenChekObj.put("id", userSessionTrackObj.getUserId()
						.toString());
				tokenChekObj.put("userName", userSessionTrackObj.getUserName());
				tokenChekObj.put("role", userSessionTrackObj.getRole());
				return tokenChekObj;

			}
		}

	}

}
