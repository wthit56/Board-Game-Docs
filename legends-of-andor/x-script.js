var slice = Array.prototype.slice;
var state = {
	time_B: false, time_E: false, legend_paused: false,
	farm: false, witch: false, skrall: false, queen: false
};
var hidden;

window.addEventListener("load", function() {
	hidden = slice.call(document.querySelectorAll(".hidden"));
	slice.call(document.querySelectorAll("button[data-action]")).forEach(function(complete) {
		complete.addEventListener("click", function complete_click() {
			var found;
			Function("state", "with(state){"+ complete.dataset.action + "}")(state);
			checkRequirements(); saveState();
			complete.disabled = true;
			complete.removeEventListener("click", complete_click);
		});
	});
});

function checkRequirements() {
	hidden.forEach(function(next) {
		if (next.classList.contains("hidden") && Function("state", "with(state) { return " + next.dataset.requirements + "}")(state)) {
			next.classList.remove("hidden");
			window.scrollTo(window.scrollX, next.offsetTop);
		}
	});
}

function saveState() {
}