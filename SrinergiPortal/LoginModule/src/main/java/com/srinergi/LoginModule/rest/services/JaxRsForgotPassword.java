package com.srinergi.LoginModule.rest.services;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

import org.oasisopen.sca.annotation.Remotable;

import com.srinergi.LoginModule.vo.QuesAnsws;


@Remotable
@Path("rest/forgotpw")
public interface JaxRsForgotPassword {
	
	@GET
	public String getQuestions(@Context HttpServletRequest req);
	
	@POST
	public String checkQuesAnswers(QuesAnsws qa,@Context HttpServletRequest req);
	
	@POST
	@Path("store")
	public String storePassword(@Context HttpServletRequest req);
		
}
