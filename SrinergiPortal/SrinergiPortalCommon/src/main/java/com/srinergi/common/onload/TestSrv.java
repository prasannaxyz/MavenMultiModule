package com.srinergi.common.onload;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import com.srinergi.common.dao.CodeToDescriptionDAO;
import com.srinergi.common.util.SpringUtil;

public class TestSrv extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private ApplicationContext appContext;

	@Autowired
	private SessionFactory sessionFactory;

	@Override
	public void init() throws ServletException {

		System.out.println("init() calling");

		appContext = SpringUtil.getApplicationContext();
		CodeToDescriptionDAO CodeDescription = (CodeToDescriptionDAO) appContext
				.getBean("codeToDescDAO");

		CodeDescription.getRolesList();

		CodeDescription.getStatesList();

		CodeDescription.getSecretQuestionsList();

		CodeDescription.getStatusList();

		CodeDescription.getDocumentsMasterList();
		
		CodeDescription.getErrorCodesList();

	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	public void destroy() {

		System.out.println("calling destroy");

	}

}
