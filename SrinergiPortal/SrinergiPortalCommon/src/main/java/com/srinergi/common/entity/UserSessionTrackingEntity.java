package com.srinergi.common.entity;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="User_Session_Tracking")
public class UserSessionTrackingEntity {
	@Id
	@Column(name="User_Name")
	private String userName;
	
	@Column(name="SECURITYKEY")
	private String securityKey;
	
	@Column(name="FIRSTNAME")
	private String firstName;
	
	@Column(name="LASTNAME")
	private String lastName;
	
	@Column(name="role")
	private String role;
	
	@Column(name="EMAIL")
	private String email;
	
	@Column(name="SESSIONSTART")
	private Date sessionStart;
	
	@Column(name="ForgotPWSeqCount")
	private Integer ForgotPWSeqCount;
	
	@Column(name="User_Id")
	private Integer userId;
	
	@Column(name="IP_Address")
	private String ipAddress;
	
	
	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public String getSecurityKey() {
		return securityKey;
	}

	public void setSecurityKey(String securityKey) {
		this.securityKey = securityKey;
	}
	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Date getSessionStart() {
		return sessionStart;
	}

	public void setSessionStart(Date sessionStart) {
		this.sessionStart = sessionStart;
	}
	public Integer getForgotPWSeqCount() {
		return ForgotPWSeqCount;
	}

	public void setForgotPWSeqCount(Integer forgotPWSeqCount) {
		ForgotPWSeqCount = forgotPWSeqCount;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

		

}
