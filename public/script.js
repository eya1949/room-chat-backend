(() => {
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    // Correct the selector for username input and button click event
    app.querySelector(".join-screen #join-user").addEventListener("click", () => {
        // The correct selector to match the input's ID, considering your HTML structure
        let username = app.querySelector(".join-screen #username").value; // Assuming the input's ID is 'Username' with an uppercase 'U'
        if (username.length === 0) {
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    // Event listener for sending messages
    app.querySelector(".chat-screen #send-message").addEventListener("click", () => {
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length == 0) {
            return;
        }
        renderMessage("my", {
            username: uname,
            text: message
        });
        socket.emit("chat", {
            username: uname,
            text: message
        });
        app.querySelector(".chat-screen #message-input").value = "";
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", () => {
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    })

    // Socket event listeners
    socket.on("update", update => {
        renderMessage("update", update);
    });

    socket.on("chat", data => {
        if (data.username !== uname) {
            renderMessage("other", data);
        }
    });

    // Function to render messages
    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");        // Ensure this selects the container that holds all messages
        let el = document.createElement("div");
        if (type === "my") {
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            //messageContainer.appendChild(el)
        } else if (type === "other") {
            //let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            //messageContainer.appendChild(el)
        } else if (type === "update") {
            //let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.textContent = message; // If message is plain text, use textContent for security
        }

        messageContainer.appendChild(el);
        // Scroll chat to the end
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();
