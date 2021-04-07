let inj_editeur_has_listener = false;
let inj_shift_set = false;
chrome.extension.sendMessage({}, function (response) {

	// Create area for editing elements
	let root = document.createElement('div');
	let mytext = document.createElement('textarea');
	let goButton = document.createElement('input');
	let cancelButton = document.createElement('input');
	root.id = "my_root";
	root.textContent = 'Edit Element';
	document.body.appendChild(root);
	mytext.cols = '50'
	mytext.rows = '8'
	root.appendChild(mytext);
	cancelButton.type = 'button';
	cancelButton.value = 'Cancel';
	cancelButton.onclick = function (event) {
		root.style.display = 'none';
		if (!inj_editeur_has_listener) {
			document.body.addEventListener('mousemove', mmove);
			inj_editeur_has_listener = true;
		}
		inj_shift_set = false;
	};
	root.appendChild(cancelButton);
	goButton.type = 'button';
	goButton.value = 'Go!'
	goButton.onclick = function (event) {
		console.log(old);
		if (old) {
			if (inj_shift_set) {
				old.innerHTML = mytext.value;
			} else {
				old.textContent = mytext.value;
			}
			inj_shift_set = false;
		}
		root.style.display = 'none';
		if (!inj_editeur_has_listener) {
			document.body.addEventListener('mousemove', mmove);
			inj_editeur_has_listener = true;
		}
		inj_shift_set = false;
	}
	root.appendChild(goButton);

	// show editing dialog when invoked
	function openEditDialog() {
		document.body.removeEventListener('mousemove', mmove);
		inj_editeur_has_listener = false;
		if (inj_shift_set) {
			mytext.value = old.innerHTML;
		} else {
			mytext.value = old.textContent;
		}
		root.style.display = 'flex';
	}

	// keep track of state of editing
	let old;
	let listening = false;

	// handlers for interacting with the page
	document.addEventListener('keydown', (event) => {
		// handle removing styling and adding listeners
		if ((event.key == 'X' && event.shiftKey) || (event.key == "Escape" && listening)) {
			listening = !listening;
			if (old) {
				old.style.border = '';
				old = null;
			}
			if (!inj_editeur_has_listener) {
				document.body.addEventListener('mousemove', mmove);
			}
			root.style.display = 'none';
		}

		// open editing dialog
		if (listening && old && event.key == "Enter") {
			if (event.shiftKey) {
				inj_shift_set = true;
			}
			openEditDialog();
			event.preventDefault();
			event.stopImmediatePropagation();
		}
	});

	// handler for clicking on elements
	document.body.addEventListener('mousedown', (event) => {
		if (listening && old && inj_editeur_has_listener) {
			if (event.shiftKey) {
				inj_shift_set = true;
			}
			openEditDialog();
			event.preventDefault();
			event.stopImmediatePropagation();
			return false;
		}
	});

	// handler to highlight elements on mouse move
	let mmove = function (event) {
		if (old) {
			old.style.border = '';
			old = null;
		}
		if (listening) {
			event.target.style.border = '1px solid red';
			old = event.target;
		}
	};

	// managing state of handlers
	inj_editeur_has_listener = true;
	document.body.addEventListener('mousemove', mmove);

});
