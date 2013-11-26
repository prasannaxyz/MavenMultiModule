package com.srinergi.common.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name="user_agent_details")
public class UserAgentDetailsEntity {
	
	@Id
	@GenericGenerator(name="inc",strategy="increment")
	@GeneratedValue(generator="inc")
	@Column(name="ID")
	Integer id;
	
	@Column(name="User_ID")
	Integer userId;
	
	@Column(name="Browser_Type")
	String browserType;
	
	@Column(name="Browser_Version")
	String browserVersion;
	
	@Column(name="OS_Type")
	String osType;
	
	@Column(name="OS_Version")
	String osVersion;
	
	@Column(name="IP_Addres")
	String ipAddress;
	
	@Column(name="Date_Created")
	Date dateCreated;

	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getBrowserType() {
		return browserType;
	}

	public void setBrowserType(String browserType) {
		this.browserType = browserType;
	}

	public String getBrowserVersion() {
		return browserVersion;
	}

	public void setBrowserVersion(String browserVersion) {
		this.browserVersion = browserVersion;
	}

	public String getOsType() {
		return osType;
	}

	public void setOsType(String osType) {
		this.osType = osType;
	}

	public String getOsVersion() {
		return osVersion;
	}

	public void setOsVersion(String osVersion) {
		this.osVersion = osVersion;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public Date getDateCreated() {
		return dateCreated;
	}

	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}

}
