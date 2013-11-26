package com.srinergi.CMM.services;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;

import org.oasisopen.sca.annotation.Remotable;

import com.srinergi.CMM.entity.MenuEntity;

@Remotable
public interface MenuService {
  @GET
  public List<MenuEntity> getMenus(@Context HttpServletRequest request,@QueryParam("userId") Integer userId);
  
}
