/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // 用于cookie签名密钥，应更改为您自己的密钥并保持安全
  config.keys = appInfo.name + "_1734768835079_4812";

  // 中间件配置
  config.middleware = [];

  // 数据库配置
  config.mongoose = {
    url: "mongodb://127.0.0.1:27017/lucky-cli-data",
  };

  // 先将csrf关闭 后续再开启
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // 添加用户配置  但是会覆盖框架配置
  const userConfig = {
    myAppName: "egg",
  };

  return {
    ...config,
    ...userConfig,
  };
};
