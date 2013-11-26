package com.srinergi.common.entity;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name="role")
@Cache(usage=CacheConcurrencyStrategy.READ_ONLY)
public class RoleMasterEntity  {
	
	@Id
	@Column(name="Role_Code")
	private String  roleCode;
	
	@Column(name="Role_Desc")
	private String  roleDesc;
	
	@Column(name="Date_Created")
	private Date dateCreated;
	
	@Column(name="Created_By")
	private int createdBy;
	
	@Column(name="Status_Code")
	private String statusCode;
	
	@Column(name="Role_Type")
	private char roleType;

	
	
	public String getRoleCode() {
		return roleCode;
	}

	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}

	public String getRoleDesc() {
		return roleDesc;
	}

	public void setRoleDesc(String roleDesc) {
		this.roleDesc = roleDesc;
	}

	public Date getDateCreated() {
		return dateCreated;
	}

	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}

	public int getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(int createdBy) {
		this.createdBy = createdBy;
	}

	public String getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}

	public char getRoleType() {
		return roleType;
	}

	public void setRoleType(char roleType) {
		this.roleType = roleType;
	}
	
}
