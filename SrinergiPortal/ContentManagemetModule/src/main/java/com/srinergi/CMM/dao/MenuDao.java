package com.srinergi.CMM.dao;

import java.util.List;
import com.srinergi.CMM.entity.MenuEntity;


public interface MenuDao {
	public List<MenuEntity> getMenus(String token,int userId);
}
