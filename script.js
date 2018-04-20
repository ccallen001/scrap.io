async function getEmailsFromDb() {
	const response = await fetch('https://scrapio-335b.restdb.io/rest/emails', {
		'headers': {
			'content-type': 'application/json',
			'x-apikey': '3cbd592182bfba0d6b3cc0c575b8c03b26993',
			'cache-control': 'no-cache'
		}
	});

	return response.json();
}

function showToasty(capturedEmail) {
	if (!showToasty.isShowing) {
		showToasty.isShowing = true;

		getEmailsFromDb()
			.then(emailRecords => {
				const toastyContainer = document.createElement('DIV');
				toastyContainer.classList.add('toasty-container');

				const msgDisplay = document.createElement('H1');
				msgDisplay.style.textAlign = 'left';

				const toastyImg = document.createElement('IMG');
				toastyImg.src = 'https://i.imgur.com/83RbbSB.png';
				toastyImg.style.marginBottom = '-2px';

				const transitionTime = 333;
				const styleConfig = {
					position: 'absolute',
					bottom: 0,
					right: 0,
					display: 'block',
					transform: 'translate(100%)',
					transition: `transform ${transitionTime}ms linear`
				};

				for (let element of [msgDisplay, toastyImg]) {
					toastyContainer.appendChild(element);
				}

				for (let property in styleConfig) {
					toastyContainer.style[property] = styleConfig[property];
				}

				document.body.appendChild(toastyContainer);
				setTimeout(() => {
					toastyContainer.style.transform = 'translate(0)';

					setTimeout(() => {
						const emails = emailRecords.map(record => record.email);
						const emailIsKnown = emails.includes(capturedEmail);

						msgDisplay.textContent = emailIsKnown ? 'I know you!' : 'email captured';
					}, transitionTime + 200);

					setTimeout(() => {
						msgDisplay.textContent = null;
						toastyContainer.style.transform = 'translate(100%)';
						showToasty.isShowing = false;
					}, 2000);
				}, 1);
			});
	}
}

function handleInputChange() {
	if (/.+@.+\.+.+/.test(this.value)) {
		showToasty(this.value);
	}
}

for (let input of document.getElementsByTagName('INPUT')) {
	input.addEventListener('change', handleInputChange);
}