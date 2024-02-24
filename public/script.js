(() => {
    const app = document.querySelector(".app");
    const socket = io('http://127.0.0.1:3000');

    let uname;

    // Correct the selector for username input and button click event
    app.querySelector(".join #join").addEventListener("click", () => {
        // The correct selector to match the input's ID, considering your HTML structure
        let username = app.querySelector(".join #Username").value; // Assuming the input's ID is 'Username' with an uppercase 'U'
        if (username.length === 0) {
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join").classList.remove("active");
        app.querySelector(".chat").classList.add("active");
    });

    // Event listener for sending msg
    app.querySelector(".chat #send-message").addEventListener("click", () => {
        let message = app.querySelector(".chat #message-input").value;
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
        app.querySelector(".chat #message-input").value = "";
    });

    app.querySelector(".chat #exit-chat").addEventListener("click", () => {
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

    // Function to render msg
    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat .msg");        // Ensure this selects the container that holds all msg
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