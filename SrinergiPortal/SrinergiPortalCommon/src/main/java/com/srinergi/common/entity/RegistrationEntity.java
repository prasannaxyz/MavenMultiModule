package com.srinergi.common.entity;

import java.util.Date;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name="registration")
public class RegistrationEntity {
	@Id
	@GenericGenerator(name="inc",strategy="increment")
	@GeneratedValue(generator="inc")
	@Column(name="ID")
	private Integer id;
	
	@Column(name="User_name")
	private String userName;
	
	@Column(name="Password")
	private String password;
	
	@Column(name="Role_Code")
	private String roleCode;
	
	@Column(name="Status_Code")
	private String statusCode;
	
	@Column(name="User_ID")
	private Integer userId;
	
	@Column(name="Question1")
	private Integer question1;
	
	@Column(name="answer1")
	private String answer1;
	
	@Column(name="Question2")
	private Integer question2;
	
	@Column(name="answer2")
	private String answer2;
	
	@Column(name="Group_Number")
	private String groupNumber;
	
	@Column(name="Tax_ID")
	private String taxId;
	
	@Column(name="SSN")
	private String ssn;
	
	@Column(name="First_Name")
	private String firstName;
	
	@Column(name="Last_Name")
	private String lastName;
	
	@Column(name="Middle_Name")
	private String middleName;
	
	@Column(name="Address1")
	private String address1;
	
	@Column(name="Address2")
	private String address2;
	
	@Column(name="City")
	private String city;
	
	@Column(name="State_Code")
	private String stateCode;
	
	@Column(name="Zip_Code")
	private String zipCode;
	
	@Column(name="County")
	private String county;
	
	@Column(name="email_ID")
	private String emailId;
	
	@Column(name="Phone")
	private String phone;
	
	@Column(name="Date_Created")
	private Date dateCreated;
	
	@Column(name="Date_Updated")
	private Date dateUpdated;
	
	@Column(name="Updated_By")
	private Integer updatedBy;
	
	@Column(name="TNC")
	private Byte tnc;
	
	@Column(name="ActionDate")
	private Date actionDate;
	
	@Column(name="comments")
	private String comments;
	
	@Column(name="IND_Broker")
	private Byte indBroker;
	
	@Column(name="Agency_Name")
	private String agencyName;
	
	@Column(name="fax")
	private String fax;
	
	@Column(name="title")
	private String title;
	
	@Column(name="URL")
	private String url;
	
	@Column(name="PhExt")
	private String phExt;
	
	@OneToMany(targetEntity=RegistrationBrokerLicenseEntity.class,fetch=FetchType.EAGER,cascade=CascadeType.ALL,orphanRemoval=true)
	@JoinColumn(name="registration_id",referencedColumnName="ID",nullable=false)
	private Set<RegistrationBrokerLicenseEntity> regBrokerLicenseChild;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
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

	public String getRoleCode() {
		return roleCode;
	}

	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}

	public String getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public Integer getQuestion1() {
		return question1;
	}

	public void setQuestion1(Integer question1) {
		this.question1 = question1;
	}

	public String getAnswer1() {
		return answer1;
	}

	public void setAnswer1(String answer1) {
		this.answer1 = answer1;
	}

	public Integer getQuestion2() {
		return question2;
	}

	public void setQuestion2(Integer question2) {
		this.question2 = question2;
	}

	public String getAnswer2() {
		return answer2;
	}

	public void setAnswer2(String answer2) {
		this.answer2 = answer2;
	}

	public String getGroupNumber() {
		return groupNumber;
	}

	public void setGroupNumber(String groupNumber) {
		this.groupNumber = groupNumber;
	}

	public String getTaxId() {
		return taxId;
	}

	public void setTaxId(String taxId) {
		this.taxId = taxId;
	}

	public String getSsn() {
		return ssn;
	}

	public void setSsn(String ssn) {
		this.ssn = ssn;
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

	public String getAddress1() {
		return address1;
	}

	public void setAddress1(String address1) {
		this.address1 = address1;
	}

	public String getAddress2() {
		return address2;
	}

	public void setAddress2(String address2) {
		this.address2 = address2;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getStateCode() {
		return stateCode;
	}

	public void setStateCode(String stateCode) {
		this.stateCode = stateCode;
	}

	public String getZipCode() {
		return zipCode;
	}

	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}

	public String getCounty() {
		return county;
	}

	public void setCounty(String county) {
		this.county = county;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Date getDateCreated() {
		return dateCreated;
	}

	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
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

	public Byte getTnc() {
		return tnc;
	}

	public void setTnc(Byte tnc) {
		this.tnc = tnc;
	}

	public Date getActionDate() {
		return actionDate;
	}

	public void setActionDate(Date actionDate) {
		this.actionDate = actionDate;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public Byte getIndBroker() {
		return indBroker;
	}

	public void setIndBroker(Byte indBroker) {
		this.indBroker = indBroker;
	}

	public String getAgencyName() {
		return agencyName;
	}

	public void setAgencyName(String agencyName) {
		this.agencyName = agencyName;
	}

	public String getFax() {
		return fax;
	}

	public void setFax(String fax) {
		this.fax = fax;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getPhExt() {
		return phExt;
	}

	public void setPhExt(String phExt) {
		this.phExt = phExt;
	}

	public Set<RegistrationBrokerLicenseEntity> getRegBrokerLicenseChild() {
		return regBrokerLicenseChild;
	}

	public void setRegBrokerLicenseChild(
			Set<RegistrationBrokerLicenseEntity> regBrokerLicenseChild) {
		this.regBrokerLicenseChild = regBrokerLicenseChild;
	}

	
	
}
