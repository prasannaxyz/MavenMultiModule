package com.srinergi.common.entity;

import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name="users")
public class UserEntity {

	@Id
	@GenericGenerator(name="inc",strategy="increment")
	@GeneratedValue(generator="inc")
	@Column(name="User_ID")
	private Integer userId;
	
	@Column(name="User_Name")
	private String  userName;
	
	@Column(name="Password")
	private String  password;
	
	@Column(name="Email_ID")
	private String  emailId;
	
	@Column(name="First_Name")
	private String  firstName;
	
	@Column(name="Last_Name")
	private String  lastName;
	
	@Column(name="Middle_Name")
	private String  middleName;
	
	@Column(name="Status_Code")
	private String  statusCode;
	
	@Column(name="Last_Login")
	private Date lastLogin;
	
	@Column(name="TNC")
	private Byte tnc;
	
	@Column(name="Password_Reset_Date")
	private Date passwordResetDate;
	
	@Column(name="Date_Created")
	private Date dateCreated;
	
	@Column(name="Created_By")
	private Integer createdBy;
	
	@Column(name="Date_Updated")
	private Date dateUpdated;
	
	@Column(name="Updated_By")
	private Integer updatedBy;
	
	@Column(name="Temp_Password")
	private Byte tempPassword;
	
	@Column(name="Temp_Pwd")
	private String tempPwd;
	
	@Column(name="locked")
	private Byte locked;
	
	@OneToMany(targetEntity=MapUsersToQuestionsEntity.class,cascade=CascadeType.ALL)
	@JoinColumn(name="user_id",referencedColumnName="User_ID",nullable=false)
	private Set<MapUsersToQuestionsEntity> children;
	
	
	
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmailId() {
		return emailId;
	}
	public void setEmailId(String emailId) {
		this.emailId = emailId;
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
	public String getMiddleName() {
		return middleName;
	}
	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}
	public String getStatusCode() {
		return statusCode;
	}
	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}
	public Date getLastLogin() {
		return lastLogin;
	}
	public void setLastLogin(Date lastLogin) {
		this.lastLogin = lastLogin;
	}
	
	public Date getPasswordResetDate() {
		return passwordResetDate;
	}
	public void setPasswordResetDate(Date passwordResetDate) {
		this.passwordResetDate = passwordResetDate;
	}
	public Date getDateCreated() {
		return dateCreated;
	}
	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}
	public Integer getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(Integer createdBy) {
		this.createdBy = createdBy;
	}
	public Date getDateUpdated() {
		return dateUpdated;
	}
	public void setDateUpdated(Date dateUpdated) {
		this.dateUpdated = dateUpdated;
	}
	public Integer getUpdatedBy() {
		return updatedBy;
	}
	public void setUpdatedBy(Integer updatedBy) {
		this.updatedBy = updatedBy;
	}
	public Set<MapUsersToQuestionsEntity> getChildren() {
		return children;
	}
	public void setChildren(Set<MapUsersToQuestionsEntity> children) {
		this.children = children;
	}
	public Byte getLocked() {
		return locked;
	}
	public void setLocked(Byte locked) {
		this.locked = locked;
	}
	
	public String getTempPwd() {
		return tempPwd;
	}
	public void setTempPwd(String tempPwd) {
		this.tempPwd = tempPwd;
	}
	public Byte getTempPassword() {
		return tempPassword;
	}
	public void setTempPassword(Byte tempPassword) {
		this.tempPassword = tempPassword;
	}
	public Byte getTnc() {
		return tnc;
	}
	public void setTnc(Byte tnc) {
		this.tnc = tnc;
	}
	
}
