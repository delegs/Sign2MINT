package de.wps.sign2MintServer.controller;

import de.wps.sign2MintServer.materials.ErrorDetail;
import de.wps.sign2MintServer.materials.HTMLPage;
import de.wps.sign2MintServer.services.PageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestController
@RequestMapping("/page")
public class PageController {

	private final PageService pageService;

	public PageController(PageService pageService) {
		this.pageService = pageService;
	}

	@GetMapping(path = "/{pageName}", produces = MediaType.APPLICATION_JSON_VALUE)
	public HTMLPage getPage(@PathVariable String pageName) throws IOException {
		return pageService.getHtml(pageName);
	}

	@ExceptionHandler(IOException.class)
	public ResponseEntity<ErrorDetail> myError(HttpServletRequest request, Exception exception) {
	    ErrorDetail error = new ErrorDetail(HttpStatus.BAD_REQUEST.value(), "page not found");
	    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
	}
}
