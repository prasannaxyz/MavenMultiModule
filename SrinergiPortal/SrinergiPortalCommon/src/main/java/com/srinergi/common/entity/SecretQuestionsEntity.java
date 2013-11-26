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
@Table(name="secret_questions")
@Cache(usage=CacheConcurrencyStrategy.READ_ONLY)
public class SecretQuestionsEntity {
	
	@Id
	@Column(name="QuestionID")
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer questionId;
	
	@Column(name="QuestionDescription")
	private String  questionDescription;
	
	
	public Integer getQuestionId() {
		return questionId;
	}
	public void setQuestionId(Integer questionId) {
		this.questionId = questionId;
	}
	public String getQuestionDescription() {
		return questionDescription;
	}
	public void setQuestionDescription(String questionDescription) {
		this.questionDescription = questionDescription;
	}
	

}
