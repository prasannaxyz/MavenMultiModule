package com.srinergi.common.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name="states_master")
@Cache(usage=CacheConcurrencyStrategy.READ_ONLY)
public class StatesMasterEntity {
	@Id
	@Column(name="State_Code")
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private String stateCode;
	
	@Column(name="State_Description")
	private String stateDescription;
	
	@Column(name="status_code")
	private String statusCode;

	public String getStateCode() {
		return stateCode;
	}

	public void setStateCode(String stateCode) {
		this.stateCode = stateCode;
	}

	public String getStateDescription() {
		return stateDescription;
	}

	public void setStateDescription(String stateDescription) {
		this.stateDescription = stateDescription;
	}

	public String getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}
	
	
}
