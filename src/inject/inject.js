let inj_editeur_has_listener = false;
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
	};
	root.appendChild(cancelButton);
	goButton.type = 'button';
	goButton.value = 'Go!'
	goButton.onclick = function (event) {
		console.log(old);
		if (old) {
			old.textContent = mytext.value;
		}
		root.style.display = 'none';
		if (!inj_editeur_has_listener) {
			document.body.addEventListener('mousemove', mmove);
			inj_editeur_has_listener = true;
		}
	}
	root.appendChild(goButton);

	// show editing dialog when invoked
	function openEditDialog() {
		document.body.removeEventListener('mousemove', mmove);
		inj_editeur_has_listener = false;
		mytext.value = old.textContent;
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
			openEditDialog();
		}
	});

	// handler for clicking on elements
	document.body.addEventListener('mousedown', (event) => {
		if (listening && old && inj_editeur_has_listener) {
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
