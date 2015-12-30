document.body.classList.add("js");

var forEach = Array.prototype.forEach, filter = Array.prototype.filter, slice = Array.prototype.slice, map = Array.prototype.map;
on(window, "load", function() {
	var log = document.getElementById("log"), buttons = document.getElementById("buttons"), branches = document.getElementById("branches");
	
	branches.byIndex = { length: branches.children };
	forEach.call(branches.children, function(branch, index) {
		branches.byIndex[branch.index = index] = branch;
	});
	
	var cookiePath = window.location.pathname.match(/[\W\w]*\//)[0];
	
	function cookieExpires() {
		var expires = new Date();
		expires.setFullYear(expires.getFullYear());
		return expires;
	}
	
	(function loadCookie() {
		if (state && state.name) {
			var cookie = document.cookie;
			var relevant = cookie.match(new RegExp(state.name + "=([^;]+)"));
			if (relevant && relevant[1]) {
				var loadedState = decodeComponentURI(JSON.parse(relevant[1]));
				if (
					((loadedState.version | 0) === (state.version | 0)) ||
					/* different version && */ confirm("This Legend has singificantly changed since you were last here.\nDo you want to continue loading? (This may cause errors.)")
				) {
					document.cookie = state.name + "=" + relevant[1] + ";path=" + cookiePath + ";expires=" + cookieExpires();
					
					state = loadedState;
					if (state.render.end) { buttons.classList.add("hidden"); }
					else {
						forEach.call(buttons.children, function(button) {
							setupButton(button);
						});

						Array.prototype.forEach.call(state.render.branches, function(index) {
							addBranch(branches.byIndex[index]);
						});
						
						state.branches.length = state.render.buttons.length = 0;
					}
				}
				else {
					alert("Progress has been reset.");
				}
			}
		}
	})();
	
	(function setupState() {
		if (!state.render) {
			state.render = { end: false, branches: [], buttons: [] };
		}
		
		var toSave = false;
		state.run = function(src) {
			var f = Function("with (state) { " + src + "}");
			//console.log(f);
			return f(state);
		};
		state.update = function(src) {
			state.run(src);
			if (!toSave) { setImmediate(state.save); toSave = true; }
		};
		state.test = function(src) {
			return state.run("return (" + src + ")");
		};
		
		state.save = function() {
			if (state && state.name && toSave) {
				document.cookie = state.name + "=" + encodeComponentURI(JSON.stringify(state)) + ";path=" + cookiePath + ";expires=" + cookieExpires();
			}
			toSave = false;
		};
		state.clear = function() {
			if (state && state.name) {
				document.cookie = state.name + "=;path=" + cookiePath + ";expires=" + new Date(0);
			}
		};
	})();

	function addBranch(branch) {
		if (log.children.length <= state.render.branches) {
			state.render.branches.push(branch.index);
		}
			
		var branchButtons = branch.getElementsByTagName("BUTTON");
		forEach.call(branchButtons, addButton);
		
		log.appendChild(branch);
	}
	function branchIsRequired(branch) {
		return (branch.dataset.requirements && state.test(branch.dataset.requirements));
	}
	
	function addButton(button) {
		if (!state.render.end) {
			setupButton(button, buttons.children.length);
			buttons.appendChild(button);
		}
	}
	function setupButton(button, index) {
		if (!state.render.end) {
			if (state.buttons.length > index) {
				button.used = (state.buttons[index] === "1");
			}
			applyRequirementsButton(button);
		}
	}
	function applyRequirementsButton(button) {
		var isDisabled = (
			!button.used &&
			(
				button.dataset.requirements
					? !state.test(button.dataset.requirements)
					: true
			)
		);
		
		if (button.disabled !== isDisabled) {
			button.disabled = isDisabled;
			(isDisabled ? on.remove : on)(button, "click", buttonClick);
		}
	}
	function buttonClick() {
		state.update(this.dataset.action);
		filter.call(branches.children, branchIsRequired).forEach(branchAddIfRequired);
		this.used = true;
		this.disabled = true;
	}
});




