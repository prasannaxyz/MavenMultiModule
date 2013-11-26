package com.srinergi.CMM.dao;

import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

import com.srinergi.CMM.entity.MenuEntity;
@Repository("menuDao")
@Scope("prototype")
public class MenuDaoImpl  implements MenuDao {
	@Autowired
    private SessionFactory sessionFactory;
	@SuppressWarnings("unchecked")
	public List<MenuEntity> getMenus(String token,int userId) {
		
		List<MenuEntity> menuEntity=null;
		try{
			if((Integer)userId!=null){
			Query query=sessionFactory.getCurrentSession().createQuery("FROM MenuEntity as menu where menu.createdBy= :id").setCacheable(true);
			 query.setInteger("id", userId);
			 menuEntity=query.list();
			
			}
			
		}catch(HibernateException he){
			he.printStackTrace();
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			
		}
		
		
		return menuEntity;
	}

}
