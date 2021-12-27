package de.wps.sign2MintServer.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.File;
import java.lang.invoke.MethodHandles;

@RestControllerAdvice
public class RestExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    @ExceptionHandler(Exception.class)
    private void handleEntityNotFound(Exception e) {
        logger.error(e.getMessage());
        e.printStackTrace();
        logDebugData();
    }

    @Scheduled(fixedDelay = 60 * 15 * 1000)
    private void logDebugData() {

        var runtime = Runtime.getRuntime();

        var totalMemory = runtime.totalMemory() / (1024 * 1024);
        var freeMemory = runtime.freeMemory() / (1024 * 1024);
        var usedMemory = totalMemory - freeMemory;
        var memoryInfo = String.format("Free memory: %s MB / %s MB. %s MB used.", freeMemory, totalMemory, usedMemory);
        logger.info(memoryInfo);

        var osInfo = System.getProperty("os.name");
        var rootPath = osInfo.startsWith("windows") ? "c:" : "/";
        var hdd = new File(rootPath);
        var freeSpace = hdd.getFreeSpace() / (1024 * 1024);
        var totalSpace = hdd.getTotalSpace() / (1024 * 1024);
        var usedSpace = totalSpace - freeSpace;
        var diskSpaceInfo = String.format("Free disk space: %s MB / %s MB. %s MB used.", freeSpace, totalSpace, usedSpace);
        logger.info(diskSpaceInfo);
    }
}
