package com.srinergi.LoginModule.rest.services;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

import org.oasisopen.sca.annotation.Remotable;

import com.srinergi.LoginModule.vo.ResetUserPassword;

@Remotable
public interface JaxRsProfileSettings {
		
	@POST
	@Path("/resetpw")
	public String resetUserPassword(ResetUserPassword reset,@Context HttpServletRequest req);
	
	@POST
	@Path("/signout")
	public String signout(@Context HttpServletRequest req);
}
