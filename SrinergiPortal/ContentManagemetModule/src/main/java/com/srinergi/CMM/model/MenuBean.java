package com.srinergi.CMM.model;

import java.util.List;
import com.srinergi.CMM.entity.MenuEntity;


public interface MenuBean {
  public List<MenuEntity> getMenus(String token,int userId);
}
