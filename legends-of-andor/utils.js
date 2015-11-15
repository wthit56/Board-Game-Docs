function on(dom, event, listener) {
	return dom.addEventListener(event, listener);
}
on.remove = function(dom, event, listener) {
	dom.removeEventListener(event, listener);
};

if (typeof setImmediate === "undefined") {
	setImmediate = function(callback) {
		return setTimeout(callback, 0);
	};
}

function scrollTo(dom) {
	if (dom.scrollIntoViewIfNeeded) { dom.scrollIntoViewIfNeeded(); }
	else if (dom.scrollIntoView) { dom.scrollIntoView(); }
	else { window.scrollTo(window.scrollLeft, dom.offsetTop); }
}
