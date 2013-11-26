package com.srinergi.common.util;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class SpringUtil implements ApplicationContextAware {

	public SpringUtil()
	{
		System.out.println("ApplicationContext");
	}
	
	private static ApplicationContext context;

	public void setApplicationContext(ApplicationContext context)
			throws BeansException {
		this.context = context;
	}

	public static ApplicationContext getApplicationContext() {
		return context;
	}

}
