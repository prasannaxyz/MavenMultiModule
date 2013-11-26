package com.srinergi.common.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name="map_users_to_roles")
public class MapUsersToRolesEntity {
	
	@Id
	@Column(name="ID")
	@GenericGenerator(name="inc",strategy="increment")
	@GeneratedValue(generator="inc")
	private Integer id;
	
	@Column(name="User_ID")
	private Integer userId;
	
	@Column(name="Role_Code")
	private String  roleCode;
	
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
	public String getRoleCode() {
		return roleCode;
	}
	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}
}
