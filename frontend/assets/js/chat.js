(function () {
	const messagesEl = document.getElementById('messages');
	const formEl = document.getElementById('chat-form');
	const inputEl = document.getElementById('chat-input');
	const statusEl = document.getElementById('status-text');

	const userAvatar = 'https://i.pravatar.cc/150?u=user';
	const botAvatar = 'https://api.dicebear.com/8.x/bottts/svg?seed=CoupleGPT';

	function createMessageBubble({ text, sender, isLoading }) {
		const wrapper = document.createElement('div');
		wrapper.className = `chat ${sender === 'user' ? 'chat-end' : 'chat-start'}`;

		const avatarWrap = document.createElement('div');
		avatarWrap.className = 'chat-image avatar';
		const avatar = document.createElement('div');
		avatar.className = 'w-10 rounded-full';
		const img = document.createElement('img');
		img.alt = 'avatar';
		img.src = sender === 'user' ? userAvatar : botAvatar;
		avatar.appendChild(img);
		avatarWrap.appendChild(avatar);

		const bubble = document.createElement('div');
		bubble.className = `chat-bubble ${sender === 'user' ? 'chat-bubble-primary' : ''}`;
		if (isLoading) {
			const dots = document.createElement('span');
			dots.className = 'loading loading-dots loading-md';
			bubble.appendChild(dots);
		} else {
			bubble.textContent = text;
		}

		wrapper.appendChild(avatarWrap);
		wrapper.appendChild(bubble);
		return wrapper;
	}

	function scrollToBottom() {
		messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
	}

	function setTyping(isTyping) {
		statusEl.classList.toggle('hidden', !isTyping);
	}

	function simulateAssistantResponse(promptText) {
		return new Promise((resolve) => {
			setTimeout(() => {
				const canned = `You said: "${promptText}"\n\nThis is a demo assistant reply in a pinkish dark theme. 💖`;
				resolve(canned);
			}, 900 + Math.random() * 800);
		});
	}

	let loadingEl = null;

	formEl.addEventListener('submit', async (e) => {
		e.preventDefault();
		const text = inputEl.value.trim();
		if (!text) return;

		// User bubble
		messagesEl.appendChild(createMessageBubble({ text, sender: 'user' }));
		inputEl.value = '';
		inputEl.style.height = 'auto';
		scrollToBottom();

		// Loading bubble
		loadingEl = createMessageBubble({ text: '', sender: 'bot', isLoading: true });
		messagesEl.appendChild(loadingEl);
		setTyping(true);
		scrollToBottom();

		try {
			const reply = await simulateAssistantResponse(text);
			if (loadingEl && loadingEl.parentNode) loadingEl.parentNode.removeChild(loadingEl);
			loadingEl = null;
			messagesEl.appendChild(createMessageBubble({ text: reply, sender: 'bot' }));
		} catch (err) {
			if (loadingEl && loadingEl.parentNode) loadingEl.parentNode.removeChild(loadingEl);
			loadingEl = null;
			messagesEl.appendChild(createMessageBubble({ text: 'Sorry, something went wrong.', sender: 'bot' }));
		} finally {
			setTyping(false);
			scrollToBottom();
		}
	});

	// Enter to send, Shift+Enter for newline
	inputEl.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			formEl.requestSubmit();
		}
	});

	// Auto-grow textarea
	function autoGrow() {
		inputEl.style.height = 'auto';
		inputEl.style.height = Math.min(inputEl.scrollHeight, 200) + 'px';
	}
	inputEl.addEventListener('input', autoGrow);
	autoGrow();

	// Initial greeting
	messagesEl.appendChild(createMessageBubble({ text: 'Hi! I\'m CoupleGPT. Ask me anything about your story ✨', sender: 'bot' }));
	scrollToBottom();
})();