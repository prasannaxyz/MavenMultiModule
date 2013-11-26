package com.srinergi.CMM.model;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.transaction.annotation.Transactional;

import com.srinergi.CMM.dao.MenuDao;
import com.srinergi.CMM.entity.MenuEntity;

@Service("menuBean")
@Scope("prototype")
public class MenuBeanImpl implements MenuBean {
   @Autowired
   private MenuDao menuDao;
   @Transactional
	public List<MenuEntity> getMenus(String token,int userId) {
		List<MenuEntity> menuEntity=null;
		if(menuDao!=null)
			menuEntity= menuDao.getMenus(token,userId);
		return menuEntity;
	}

}
