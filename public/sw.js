var cacheName = "PlayerCache"; // 缓存的名称
// install 事件，它发生在浏览器安装并注册 Service Worker 时
self.addEventListener("install", event => {
  /* event.waitUtil 用于在安装成功之前执行一些预装逻辑
 但是建议只做一些轻量级和非常重要资源的缓存，减少安装失败的概率
 安装成功后 ServiceWorker 状态会从 installing 变为 installed */
  event.waitUntil(
    caches.open(cacheName).then(cache =>
      cache.addAll([
        // 如果所有的文件都成功缓存了，便会安装完成。如果任何文件下载失败了，那么安装过程也会随之失败。
        "license.txt"
      ])
    )
  );
});

/**
为 fetch 事件添加一个事件监听器。接下来，使用 caches.match() 函数来检查传入的请求 URL 是否匹配当前缓存中存在的任何内容。如果存在的话，返回缓存的资源。
如果资源并不存在于缓存当中，通过网络来获取资源，并将获取到的资源添加到缓存中。
*/
self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      var requestToCache = event.request.clone(); //
      return fetch(requestToCache).then(function(response) {
        if (!response || response.status !== 200) {
          return response;
        }
        var responseToCache = response.clone();
        caches.open(cacheName).then(function(cache) {
          cache.put(requestToCache, responseToCache);
        });
        return response;
      });
    })
  );
});
