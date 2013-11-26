package com.srinergi.common.entity;

import java.util.Date;
import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name="status_code_master")
@Cacheable
@Cache(usage=CacheConcurrencyStrategy.READ_ONLY)
public class StatusCodeMasterEntity {
	
		
	@Id
	@Column(name="Status_Code")
	private String statusCode;
	
	@Column(name="Status_Desc")
	private String statusDescription;
	
	@Column(name="Date_Created")
	private Date dateCreated;
	
	@Column(name="Created_By")
	private Integer createdBy;
	
	
	public String getStatusCode() {
		return statusCode;
	}
	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}
	public String getStatusDescription() {
		return statusDescription;
	}
	public void setStatusDescription(String statusDescription) {
		this.statusDescription = statusDescription;
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
}
