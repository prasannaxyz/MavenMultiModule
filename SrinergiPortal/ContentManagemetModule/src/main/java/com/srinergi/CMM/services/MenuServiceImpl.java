package com.srinergi.CMM.services;


import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.srinergi.CMM.entity.MenuEntity;
import com.srinergi.CMM.model.MenuBean;
import com.srinergi.common.util.SpringUtil;


public class MenuServiceImpl implements MenuService {
	
	private MenuBean menuBean;
	public MenuServiceImpl(){
		/*System.out.println("MenuBean:0-param");*/
	}

	public List<MenuEntity> getMenus(HttpServletRequest request,Integer userId) {
		List<MenuEntity> menuList=null;
		String authToken=request.getHeader("token");
		//System.out.println("authToken"+authToken);
		menuBean=(MenuBean)SpringUtil.getApplicationContext().getBean("menuBean");
		try{
		if(menuBean!=null)
			menuList=menuBean.getMenus(authToken,userId);
		}catch(NullPointerException ne){
			ne.printStackTrace();
		}catch(Exception e){
			e.printStackTrace();
		}
		return menuList;
	}
	
	

}
