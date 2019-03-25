if ('serviceWorker' in navigator) {
// register service worker
 navigator.serviceWorker.register('sw.js') // 参数1：注册提供的脚本URL 参数2：导航匹配
.then(function(registration) {
// 注册成功
// registration对象存有对sw所在生命周期的状态及状态变更事件及一些父接口的方法
// 状态分别有 installing 、 installed 、 waiting 、 activating 、 activated
if(registration.installing) {
       console.log('Service worker installing');
} else if(registration.waiting) {
       console.log('Service worker installed');
} else if(registration.active) {
       console.log('Service worker active');
}
}).catch(function(error) {
	console.warn('PWA install failed.');
});
}