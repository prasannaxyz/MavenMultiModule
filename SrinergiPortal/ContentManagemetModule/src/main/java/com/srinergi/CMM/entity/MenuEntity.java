package com.srinergi.CMM.entity;


import java.util.Date;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name="menu_master")
@Cacheable
@Cache(usage=CacheConcurrencyStrategy.READ_ONLY)
public class MenuEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="ID")
	private int menuId;
	
	@Column(name="Level_ID")
	private int levelId;
	
	@Column(name="Category_Code")	
	private String categoryCode;
	
	@Column(name="Category_desc")
	private String categoryDesc;
	
	@Column(name="Parent_Category")
	private String Parent_Category;
	
	@Column(name="Menu_Position")
	private int menuPostion;
	
	@Column(name="Status_Code")
	private String Status_Code;
	
	@Temporal(TemporalType.DATE)
	@Column(name="Date_created")
	private Date dateCreated;
	
	@Column(name="Created_By")
	private int createdBy;
	
	@Column(name="url")
	private String url;
	
	@Column(name="menu_type_code")
	
	public int getMenuId() {
		return menuId;
	}
	public void setMenuId(int menuId) {
		this.menuId = menuId;
	}
	public int getLevelId() {
		return levelId;
	}
	public void setLevelId(int levelId) {
		this.levelId = levelId;
	}
	public String getCategoryCode() {
		return categoryCode;
	}
	public void setCategoryCode(String categoryCode) {
		this.categoryCode = categoryCode;
	}
	public String getCategoryDesc() {
		return categoryDesc;
	}
	public void setCategoryDesc(String categoryDesc) {
		this.categoryDesc = categoryDesc;
	}
	public String getParent_Category() {
		return Parent_Category;
	}
	public void setParent_Category(String parent_Category) {
		Parent_Category = parent_Category;
	}
	public int getMenuPostion() {
		return menuPostion;
	}
	public void setMenuPostion(int menuPostion) {
		this.menuPostion = menuPostion;
	}
	public String getStatus_Code() {
		return Status_Code;
	}
	public void setStatus_Code(String status_Code) {
		Status_Code = status_Code;
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
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
 
	public String toSring(){
		return menuId+"  "+categoryCode+" "+categoryDesc+" "+createdBy;
	}
}
