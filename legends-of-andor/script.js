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

var state;
on(window, "load", function() {
	var i, l;
	
	state = (function() {
		var state = {
			win: null, time_B: false, time_E: false,
			mid_farm: false, letter: null,
			farm: false, queen: false, skrall: false, witch: false
		};
		state.save = function() {
			saving = false;
		};
		
		var saving = false;
		state.run = function(src, _return) {
			var result = Function("state", "with(state){"+(_return?"return ":"") + src + ";}")(state);
			if (!saving) {
				saving = true;
				setImmediate(state.save);
			}
			return result;
		};
		
		return state;
	})();
	
	var branches = document.querySelectorAll("[data-requirements]");
	branches.update = function() {
		var needsUpdate = false;
		for (i = 0, l = branches.length; i < l; i++) {
			if (!branches[i].dataset.used) {
				var passed = state.run(branches[i].dataset.requirements, true);
				if (branches[i].tagName === "BUTTON") {
					branches[i].disabled = !passed;
				}
				else if (passed) {
					branches[i].dataset.used = true;
					branches[i].classList.add("shown");
					if (branches[i].dataset.action) {
						state.run(branches[i].dataset.action);
						needsUpdate = true;
					}
					scrollTo(branches[i]);
				}
			}
		}
		
		if (needsUpdate) { return branches.update(); }
	};
	branches.update();
	
	Array.prototype.forEach.call(document.querySelectorAll("button"), function(button) {
		on(button, "click", function button_click() {
			state.run(button.dataset.action);
			button.disabled = true;
			button.dataset.used = true;
			on.remove(button, "click", button_click);
			console.log("click", button);
			branches.update();
		});
	});
});