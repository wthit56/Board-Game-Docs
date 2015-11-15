var state, forEach = Array.prototype.forEach, slice = Array.prototype.slice, map = Array.prototype.map;
on(window, "load", function() {
	var name = "bgd-loa-asw";
	on(document.getElementById("reset"), "click", function() {
		document.cookie = name+"-state=;expires=0";
		document.cookie = name+"-buttons=;expires=0";
		window.location.reload();
	});
	
	state = (function() {
		var c = document.cookie.match(new RegExp(name+"-state=([^;]+)"));
		if (c) {
			state = JSON.parse(c[1]);
		}
		else {
			state = {
				end: false, buttons: [],
				win: null, time_B: false, time_E: false,
				mid_farm: false, letter: null,
				farm: false, queen: false, skrall: false, witch: false
			};
		}
		
		state.save = function() {
			var d = new Date();
			d.setFullYear(d.getFullYear() + 1);
			
			state.buttons = map.call(buttons.children, function(button) {
				return { disabled: button.disabled, used: button.used };
			});
			document.cookie = name + "-state=" + JSON.stringify(state) + ";expires=" + d;
			
			saving = false;
		};
		
		var saving = false;
		state.run = function(src, _return) {
			var result = Function("state", "with (state) {" + (_return ? "return " : "") + src + ";}")(state);
			if (!_return && !saving) {
				saving = true;
				setImmediate(state.save);
			}
			
			return result;
		};
		
		return state;
	})();
	
	var log = document.getElementById("log"), buttons = document.getElementById("buttons");
	
	var branches = document.getElementById("branches");
	function update() {
		forEach.call(branches.children, function(branch) {
			if (state.run(branch.dataset.requirements, true)) {
				log.appendChild(branch);
				var _buttons = branch.getElementsByTagName("BUTTON");
				console.log(branch, _buttons.length, _buttons);
				forEach.call(slice.call(_buttons), function(button) {
					console.log("move button", button);
					//buttons.appendChild(document.createTextNode(" "));
					buttons.insertBefore(button, buttons.lastElementChild);
				});
			}
		});
		forEach.call(buttons.children, function(button) {
			//console.log(button, !button.dataset.requirements, state.run(button.dataset.requirements, true), !button.classList.contains("shown"));
			if (button.used) { return; }
			
			if (!button.dataset.requirements || state.run(button.dataset.requirements, true)) { buttonShow(button); }
			else { buttonHide(button); }
		});
		
		if (state.end) {
			buttons.classList.add("end");
		}
	}
	console.log(state);
	update();
	
	state.buttons.forEach(function(state, i) {
		var button = buttons.children[i];
		if (state.disabled) { buttonHide(button); }
		else { buttonShow(button); }
		
		button.used = state.used;
	});
	
	function buttonShow(button) {
		if (!button.initialised || button.disabled) {
			on(button, "click", buttonClick);
			button.disabled = false;
			button.initialised = true;
		}
	}
	function buttonHide(button) {
		if (!button.disabled) {
			on.remove(button, "click", buttonClick);
			button.disabled = true;
		}
	}
	
	function buttonClick() {
		console.log("clicked", this);
		state.run(this.dataset.action);
		this.disabled = true; this.used = true;
		update();
	}
});







