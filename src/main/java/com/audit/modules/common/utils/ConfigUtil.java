package com.audit.modules.common.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class ConfigUtil {
	private static final Log logger = LogFactory.getLog(ConfigUtil.class);

	private static String defaultConfig = "/conf/config.properties";

	private static Map<String, Config> instanceMap = new HashMap<String, Config>();

	public static Config getInstance(String confingFile) {
		Config instance = (Config) instanceMap.get(confingFile);
		if (null == instance) {
			instance = new Config(confingFile, true);
			instanceMap.put(confingFile, instance);
		}
		return instance;
	}

	public static Config getInstance() {
		Config instance = (Config) instanceMap.get(defaultConfig);
		if (null == instance) {
			instance = new Config(defaultConfig, true);
			instanceMap.put(defaultConfig, instance);
		}
		return instance;
	}

	public static class Config {
		private Properties p = new Properties();

		private boolean isRead = false;
		private String confingFile;

		public Config(String confingFile, boolean isRead) {
			this.confingFile = confingFile;
			this.isRead = isRead;
			init();
		}

		private void init() {
			InputStream is = super.getClass().getResourceAsStream(
					this.confingFile);
			try {
				this.p.load(is);
			} catch (IOException e) {
				ConfigUtil.logger.error("配置文件" + this.confingFile + "找不到。");
			}
		}

		public String get(String key) {
			if (!(this.isRead)) {
				init();
			}
			return this.p.getProperty(key);
		}

		public String get(String key, String defaultValue) {
			if (!(this.isRead)) {
				init();
			}
			return this.p.getProperty(key, defaultValue);
		}
	}
}