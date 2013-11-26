package com.srinergi.common.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name="registration_broker_license")
public class RegistrationBrokerLicenseEntity  {
	
	@Id
	@GeneratedValue(generator="inc")
	@GenericGenerator(name="inc",strategy="increment")
	@Column(name="ID")
	private Integer id;
	
	@Column(name="registration_id",insertable=false,updatable=false)
	private Integer registrationId;
	
		
	@Column(name="State_Code",nullable=false)
	private String stateCode;
	
	@Column(name="License_ID",nullable=false)
	private String licenseId;
	
	@Column(name="Date_of_expiry")
	private Date dateOfExpiry;

	

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}
	

	public Integer getRegistrationId() {
		return registrationId;
	}

	public void setRegistrationId(Integer registrationId) {
		this.registrationId = registrationId;
	}

	public String getStateCode() {
		return stateCode;
	}

	public void setStateCode(String stateCode) {
		this.stateCode = stateCode;
	}

	public String getLicenseId() {
		return licenseId;
	}

	public void setLicenseId(String licenseId) {
		this.licenseId = licenseId;
	}

	public Date getDateOfExpiry() {
		return dateOfExpiry;
	}

	public void setDateOfExpiry(Date dateOfExpiry) {
		this.dateOfExpiry = dateOfExpiry;
	}
		

}
