package com.srinergi.AmazonService.model;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import com.amazonaws.auth.PropertiesCredentials;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.srinergi.common.model.BCrypt;

@Service("amazonService")
@Scope("prototype")
public class AmazonS3ModelImpl implements IAmazonS3Model {

	public Map<String, Object> upload(HttpServletRequest request, String bucket) {

		File f1 = null;
		Map<String, Object> FileUploadRes = new LinkedHashMap<String, Object>();
		Map<String, String> responseMsg = new LinkedHashMap<String, String>();
		Integer errorStatus = 0;
		String Message = null;
		String keyName = null;
		DiskFileItemFactory factory = new DiskFileItemFactory();

		// Create a new file upload handler
		ServletFileUpload upload = new ServletFileUpload(factory);

		try {
			// Parse the request to get file items.
			List<?> fileItems = upload.parseRequest(request);

			// Process the uploaded file items
			Iterator<?> i = fileItems.iterator();

			while (i.hasNext()) {
				FileItem fi = (FileItem) i.next();
				if (!fi.isFormField()) {

					// Get the uploaded file parameters
					String fileName = fi.getName();

					long sizeInBytes = fi.getSize();

					// System.out.println("Uploaded Filename: " + fileName);

					Double x = ((double) sizeInBytes / (1024 * 1024));

					// System.out.println("FileSize in MB:"+x);

					String extension = null;
					String prefix = "";
					int j = fileName.lastIndexOf('.');
					if (j > 0) {
						extension = '.' + fileName.substring(j + 1);
						prefix = fileName.substring(0, j);
					}
					// System.out.println("file:"+file);
					// System.out.println("prefix:"+prefix);
					// System.out.println("extension:"+extension);

					if (x > 5.0) {

						System.out.println("Uploaded file cannot exceed 5 MB");
						Message = "Uploaded file cannot exceed 5 MB";
						errorStatus = 1;
					} else {
						f1 = File.createTempFile(prefix, extension);
						fi.write(f1);
						// Amazon S3
						String existingBucketName = bucket;
						keyName = BCrypt.hashpw(prefix, BCrypt.gensalt());
						AmazonS3Client client = new AmazonS3Client(
								new PropertiesCredentials(
										AmazonS3ModelImpl.class
												.getClassLoader()
												.getResourceAsStream(
														"properties/AwsCredentials.properties")));
						client.putObject(new PutObjectRequest(
								existingBucketName, keyName, f1));

						// System.out.println("Key:"+keyName);
						Message = "Success";

					}

				}
			}

		} catch (Exception ex) {
			System.out.println(ex);
			Message = "Exception";
			errorStatus = 1;
		} finally {
			if (f1 != null) {
				f1.delete();
				System.out.println("f1 closed");
			}

		}

		responseMsg.put("errorStatus", errorStatus.toString());
		responseMsg.put("message", Message);
		FileUploadRes.put("key", keyName);
		FileUploadRes.put("responseMessage", responseMsg);

		return FileUploadRes;
	}

	// ==========================================================================================================
	public Map<String, Object> download(String key, String bucket) {
		AmazonS3Client client = null;
		Map<String, String> responseMsg = new LinkedHashMap<String, String>();
		Map<String, Object> FileDownloadRes = new LinkedHashMap<String, Object>();
		Integer errorStatus = 0;
		String message = null;
		InputStream istream = null;
		try {
			client = new AmazonS3Client(new PropertiesCredentials(
					AmazonS3ModelImpl.class.getClassLoader()
							.getResourceAsStream(
									"properties/AwsCredentials.properties")));

			S3Object s3Object = client.getObject(new GetObjectRequest(bucket,
					key));
			istream = s3Object.getObjectContent();
			
			errorStatus = 0;
			message = "Success";

		} catch (IOException e) {
			e.printStackTrace();
			errorStatus = 1;
			message = "Exception";
		}
		catch (Exception e) {
			e.printStackTrace();
			errorStatus = 1;
			message = "Exception";
		}

		responseMsg.put("errorStatus", errorStatus.toString());
		responseMsg.put("message", message);
		FileDownloadRes.put("responseMessage", responseMsg);
		FileDownloadRes.put("istreamObject", istream);

		System.out.println(FileDownloadRes);
		return FileDownloadRes;
	}

	// ===========================================================================================================
	public Map<String, Object> delete(String key, String bucket) {
		AmazonS3Client client = null;
		Map<String, String> responseMsg = new LinkedHashMap<String, String>();
		Map<String, Object> FileDeleteRes = new LinkedHashMap<String, Object>();
		Integer errorStatus = 0;
		String message = null;
		try {
			client = new AmazonS3Client(new PropertiesCredentials(
					AmazonS3ModelImpl.class.getClassLoader()
							.getResourceAsStream(
									"properties/AwsCredentials.properties")));

			client.deleteObject(new DeleteObjectRequest(bucket, key));
			// System.out.println("obj is successfully deleted from the Amazon====");
			errorStatus = 0;
			message = "Success";
		} catch (Exception e) {
			e.printStackTrace();
			errorStatus = 1;
			message = "Exception";
		}
		responseMsg.put("errorStatus", errorStatus.toString());
		responseMsg.put("message", message);
		FileDeleteRes.put("responseMessage", responseMsg);

		System.out.println(FileDeleteRes);
		return FileDeleteRes;
	}
//============================================================================================================
	public Map<String, Object> uploadFile(File f, String key, String bucket) {
		AmazonS3Client client = null;
		Map<String, String> responseMsg = new LinkedHashMap<String, String>();
		Map<String, Object> FileUploadRes = new LinkedHashMap<String, Object>();
		Integer errorStatus = 0;
		String message = null;
		try {
			client = new AmazonS3Client(new PropertiesCredentials(
					AmazonS3ModelImpl.class.getClassLoader()
							.getResourceAsStream(
									"properties/AwsCredentials.properties")));

			client.putObject(new PutObjectRequest(bucket, key, f));
			// System.out.println("obj is successfully uploaded to Amazon====");
			errorStatus = 0;
			message = "Success";
		} catch (Exception e) {
			e.printStackTrace();
			errorStatus = 1;
			message = "Exception";
		}
		responseMsg.put("errorStatus", errorStatus.toString());
		responseMsg.put("message", message);
		FileUploadRes.put("responseMessage", responseMsg);

		System.out.println(FileUploadRes);
		return FileUploadRes;
	}


}
