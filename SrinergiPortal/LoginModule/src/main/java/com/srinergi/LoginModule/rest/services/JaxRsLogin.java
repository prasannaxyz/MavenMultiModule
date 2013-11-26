package com.srinergi.LoginModule.rest.services;


import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

import org.oasisopen.sca.annotation.Remotable;

import com.srinergi.LoginModule.vo.UserLogin;



@Remotable
@Path("/rest/login")
public interface JaxRsLogin {

	@POST
	public String login(UserLogin user,@Context HttpServletRequest request);
	
	
}

