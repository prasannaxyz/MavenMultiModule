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
@Table(name = "documents_master")
@Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
public class DocumentsMasterEntity {

	@Id
	@Column(name = "Code")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private String code;

	@Column(name = "Doc_Type")
	private String docType;

	@Column(name = "Description")
	private String description;

	@Column(name = "Status")
	private String status;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getDocType() {
		return docType;
	}

	public void setDocType(String docType) {
		this.docType = docType;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
