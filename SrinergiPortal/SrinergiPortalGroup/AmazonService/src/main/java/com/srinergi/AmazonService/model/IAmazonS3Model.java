package com.srinergi.AmazonService.model;

import java.io.File;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface IAmazonS3Model {
	public Map<String, Object> upload(HttpServletRequest request, String bucket);
	public Map<String, Object> uploadFile(File f,String key,String bucket);
	public Map<String, Object> download(String key,String bucket);
	public Map<String, Object> delete(String key,String bucket);
}
