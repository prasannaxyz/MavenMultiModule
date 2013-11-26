package com.srinergi.LoginModule.dao;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.srinergi.LoginModule.vo.QuesAnsws;
import com.srinergi.common.dao.CodeToDescriptionDAO;
import com.srinergi.common.entity.ErrorCodesEntity;
import com.srinergi.common.entity.MapUsersToQuestionsEntity;
import com.srinergi.common.entity.MapUsersToRolesEntity;
import com.srinergi.common.entity.RegistrationEntity;
import com.srinergi.common.entity.SecretQuestionsEntity;
import com.srinergi.common.entity.UserEntity;
import com.srinergi.common.entity.UserSessionTrackingEntity;
import com.srinergi.common.model.BCrypt;

@Repository("secQuesDAO")
@Scope("prototype")
public class SecurityQuestionsDAOImpl implements SecurityQuestionsDAO {

	@Autowired
	SessionFactory sessionFactory;

	@Autowired
	CodeToDescriptionDAO codeToDescription;

	@Autowired
	LoginDAO login;

	@Transactional(readOnly = true)
	public List<Map<String, String>> getSecurityQuestions() {
		List<Map<String, String>> quesListObj = new LinkedList<Map<String, String>>();

		List<SecretQuestionsEntity> quesList = codeToDescription
				.getSecretQuestionsList();
		Iterator<SecretQuestionsEntity> quesIt = quesList.iterator();

		while (quesIt.hasNext()) {
			Map<String, String> quesObj = new LinkedHashMap<String, String>();
			SecretQuestionsEntity question = quesIt.next();
			quesObj.put("id", question.getQuestionId().toString());
			quesObj.put("description", question.getQuestionDescription());

			quesListObj.add(quesObj);
		}

		return quesListObj;
	}

	// *******************************************************************************
	@Transactional()
	public Map<String, Object> getSecurityQuestions(String username) {

		Map<String, Object> quesTokenObj = new LinkedHashMap<String, Object>();
		List<Map<String, String>> quesList = new LinkedList<Map<String, String>>();
		Session session = sessionFactory.getCurrentSession();

		Query Query1 = session
				.createQuery("from UserEntity where userName = :name ");
		Query1.setParameter("name", username);
		List<UserEntity> userList = Query1.list();
		Iterator<UserEntity> userIt = userList.iterator();
		UserEntity userObj = null;
		if (userIt.hasNext()) {
			userObj = userIt.next();

		} else {
			Map<String, Object> responseObj = new LinkedHashMap<String, Object>();
			Map<String, String> mapObj = new HashMap<String, String>();
			Query Query2 = session
					.createQuery("from RegistrationEntity where userName = :name ");
			Query2.setParameter("name", username);
			List<RegistrationEntity> regList = Query2.list();
			Iterator<RegistrationEntity> regIt = regList.iterator();
			if (regIt.hasNext()) {
				System.out.println("Your registration is in pending status");

				Object errorCode = session.load(ErrorCodesEntity.class, 1);
				ErrorCodesEntity errBean = (ErrorCodesEntity) errorCode;

				mapObj.put("errorStatus", "1");
				mapObj.put("message", errBean.getErrorDescription());
				responseObj.put("responseCode", mapObj);

			} else {
				System.out.println("User doesn't exist");

				Object errorCode = session.load(ErrorCodesEntity.class, 18);
				ErrorCodesEntity errBean = (ErrorCodesEntity) errorCode;

				mapObj.put("errorStatus", "1");
				mapObj.put("message", errBean.getErrorDescription());
				responseObj.put("responseCode", mapObj);
			}
			return responseObj;
		}
		UserEntity user = (UserEntity) session.get(UserEntity.class,
				userObj.getUserId());
		Set<MapUsersToQuestionsEntity> userQues = user.getChildren();
		Iterator<MapUsersToQuestionsEntity> userQuesIt = userQues.iterator();
		if (!userQuesIt.hasNext()) {
			Map<String, String> statusObj = new LinkedHashMap<String, String>();
			Object errorCode = session.load(ErrorCodesEntity.class, 19);
			ErrorCodesEntity errBean = (ErrorCodesEntity) errorCode;

			statusObj.put("errorStatus", "1");
			statusObj.put("message", errBean.getErrorDescription());
			quesTokenObj.put("responseCode", statusObj);

			return quesTokenObj;
		}
		while (userQuesIt.hasNext()) {
			Map<String, String> quesObj = new LinkedHashMap<String, String>();
			MapUsersToQuestionsEntity object = (MapUsersToQuestionsEntity) userQuesIt
					.next();
			Object secretQuestionsObj = session.get(
					SecretQuestionsEntity.class, object.getQuestionId());
			SecretQuestionsEntity secQues = (SecretQuestionsEntity) secretQuestionsObj;
			quesObj.put("id", secQues.getQuestionId().toString());
			quesObj.put("description", secQues.getQuestionDescription());

			quesList.add(quesObj);
		}

		UserSessionTrackingEntity ust = (UserSessionTrackingEntity) session
				.get(UserSessionTrackingEntity.class, username);
		String token;
		// Update time in usersessiontracking table
		if (ust != null) {
			token = ust.getSecurityKey();
			// ust.setSessionStart(new Date());
		} else {
			token = BCrypt.hashpw(username, BCrypt.gensalt());
			// Get role
			Integer userId = userObj.getUserId();
			Query role_query = session
					.createQuery("from MapUsersToRolesEntity where userId = :id ");
			role_query.setParameter("id", userId);
			List<MapUsersToRolesEntity> roleList = role_query.list();
			Iterator<MapUsersToRolesEntity> roleIt = roleList.iterator();
			MapUsersToRolesEntity roleObj = null;
			if (roleIt.hasNext()) {
				roleObj = (MapUsersToRolesEntity) roleIt.next();
			}

			ust = new UserSessionTrackingEntity();
			ust.setSecurityKey(token);
			ust.setUserName(username);
			ust.setFirstName(userObj.getFirstName());
			ust.setLastName(userObj.getLastName());
			ust.setEmail(userObj.getEmailId());
			ust.setSessionStart(null);
			ust.setRole(roleObj.getRoleCode());
			ust.setUserId(userObj.getUserId());
			ust.setForgotPWSeqCount(0);// Defualt value is 0
			// save it in usersessiontracking
			session.save(ust);

		}

		quesTokenObj.put("questions", quesList);
		Map<String, String> tokenObj = new LinkedHashMap<String, String>();
		tokenObj.put("Id", token);
		quesTokenObj.put("token", tokenObj);

		Map<String, String> statusObj = new LinkedHashMap<String, String>();

		Object errorCode = session.load(ErrorCodesEntity.class, 6);
		ErrorCodesEntity errBean = (ErrorCodesEntity) errorCode;

		statusObj.put("errorStatus", "0");
		statusObj.put("message", errBean.getErrorDescription());
		quesTokenObj.put("responseCode", statusObj);

		// System.out.println(QuesToken);
		return quesTokenObj;
	}

	// *********************************************************************
	@Transactional()
	public Map<String, String> validateSecurityAnswers(QuesAnsws qa,
			String token) {
		Integer ques1 = qa.getQuestionid1();
		String ans1 = qa.getAnswer1().trim();
		Integer ques2 = qa.getQuestionid2();
		String ans2 = qa.getAnswer2().trim();

		Map<String, String> checkQuesAnsObj = new LinkedHashMap<String, String>();
		Session session = sessionFactory.getCurrentSession();

		// Get Username based on token
		String user;
		String sessionStart;

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
			Object errorCode = session.load(ErrorCodesEntity.class, 4);
			ErrorCodesEntity errBean = (ErrorCodesEntity) errorCode;
			System.out.println("Token not Matched");
			checkQuesAnsObj.put("errorStatus", "1");
			checkQuesAnsObj.put("message", errBean.getErrorDescription());
			return checkQuesAnsObj;
		}

		// Get userId based on username
		Query Query1 = session
				.createQuery("from UserEntity where userName = :name ");
		Query1.setParameter("name", userSesionTrackObj.getUserName());
		List<UserEntity> userList = Query1.list();
		Iterator<UserEntity> userIt = userList.iterator();
		UserEntity userObj = null;
		if (userIt.hasNext()) {
			userObj = (UserEntity) userIt.next();
		}

		Integer userId = userObj.getUserId();
		System.out.println("userId:" + userId);

		// Get Questions and Answers based on userId
		Set<MapUsersToQuestionsEntity> quesAns = userObj.getChildren();
		Iterator<MapUsersToQuestionsEntity> quesAnsIt = quesAns.iterator();
		Map<Integer, String> quesAnsMap = new LinkedHashMap<Integer, String>();
		while (quesAnsIt.hasNext()) {
			MapUsersToQuestionsEntity usersToQues = (MapUsersToQuestionsEntity) quesAnsIt
					.next();
			quesAnsMap
					.put(usersToQues.getQuestionId(), usersToQues.getAnswer());
		}
		// System.out.println(quesAnsMap);

		if (!quesAnsMap.containsKey(ques1) || !quesAnsMap.containsKey(ques2)) {
			Object errorCode = session.load(ErrorCodesEntity.class, 21);
			ErrorCodesEntity errBean = (ErrorCodesEntity) errorCode;

			System.out.println("Questions not match");
			checkQuesAnsObj.put("errorStatus", "1");
			checkQuesAnsObj.put("message", errBean.getErrorDescription());
			return checkQuesAnsObj;
		}

		if (BCrypt
				.checkpw(ans1.toLowerCase(), quesAnsMap.get(ques1).toString())
				&& BCrypt.checkpw(ans2.toLowerCase(), quesAnsMap.get(ques2)
						.toString())) {
			Object errorCode = session.load(ErrorCodesEntity.class, 6);
			ErrorCodesEntity errBean = (ErrorCodesEntity) errorCode;

			System.out.println("Success");
			checkQuesAnsObj.put("errorStatus", "0");
			checkQuesAnsObj.put("message", errBean.getErrorDescription());
			checkQuesAnsObj.put("token", userSesionTrackObj.getSecurityKey());

		} else {
			Object errorCode = session.load(ErrorCodesEntity.class, 20);
			ErrorCodesEntity errBean = (ErrorCodesEntity) errorCode;

			System.out.println("Wrong Answers");
			checkQuesAnsObj.put("errorStatus", "1");
			checkQuesAnsObj.put("message", errBean.getErrorDescription());
			checkQuesAnsObj.put("token", userSesionTrackObj.getSecurityKey());

		}

		return checkQuesAnsObj;

	}

}
