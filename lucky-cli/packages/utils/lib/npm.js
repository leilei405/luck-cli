import urlJoin from "url-join";
import service from "axios";
import log from "./log.js";

function getNpmInfo(npmName) {
  // cnpm源：https://registry.npm.taobao.org/
  const registry = "https://registry.npmjs.org/";
  const url = urlJoin(registry, npmName);
  return service.get(url).then((res) => {
    try {
      return res.data;
    } catch (error) {
      return Promise.reject(error);
    }
  });
}

export function getLatestVersion(npmName) {
  return getNpmInfo(npmName).then((data) => {
    if (!data["dist-tags"] || !data["dist-tags"].latest) {
      log.error("没有找到 latest version");
      return Promise.reject(new Error("没有找到 latest version"));
    }
    return data["dist-tags"].latest;
  });
}
