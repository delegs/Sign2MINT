package de.wps.sign2MintServer.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import de.wps.sign2MintServer.materials.HTMLPage;

@Service
public class PageService {

	public HTMLPage getHtml(String pageName) throws IOException {
		ResourceLoader resouceLoader = new DefaultResourceLoader();
		InputStream htmlStream = resouceLoader.getResource(File.separator + "html-files" + File.separator + pageName + ".html").getInputStream();
        return new HTMLPage(readFromInputStream(htmlStream));
	}

	private String readFromInputStream(InputStream inputStream) throws IOException {
			StringBuilder resultStringBuilder = new StringBuilder();
			try(BufferedReader br = new BufferedReader(new InputStreamReader(inputStream))){
				String line;
				while ((line = br.readLine()) != null) {
					resultStringBuilder.append(line);
				}
			}return resultStringBuilder.toString();
	}


}
