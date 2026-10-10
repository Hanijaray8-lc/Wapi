const imageUrl =
    document.getElementById("imageUrl");

const title =
    document.getElementById("title");

const description =
    document.getElementById("description");

const mainUrl =
    document.getElementById("mainUrl");

const buttonsContainer =
    document.getElementById("buttonsContainer");

const previewTitle =
    document.getElementById("previewTitle");

const previewDescription =
    document.getElementById("previewDescription");

const previewMainUrl =
    document.getElementById("previewMainUrl");

const previewImageContainer =
    document.getElementById(
        "previewImageContainer"
    );

const previewButtons =
    document.getElementById("previewButtons");

const addButton =
    document.getElementById("addButton");

const shareButton =
    document.getElementById("shareButton");

const copyButton =
    document.getElementById("copyButton");

const status =
    document.getElementById("status");


let buttons = [];

let nextButtonId = 1;



/* -----------------------------------------
   Add Button
----------------------------------------- */

function addNewButton() {

    const button = {

        id: nextButtonId++,

        text: "New Button",

        url: "https://yourdomain.com/"

    };


    buttons.push(button);

    renderButtons();

    updatePreview();

}


addButton.addEventListener(
    "click",
    addNewButton
);



/* -----------------------------------------
   Render Editor Buttons
----------------------------------------- */

function renderButtons() {

    buttonsContainer.innerHTML = "";


    if (buttons.length === 0) {

        buttonsContainer.innerHTML = `

            <div class="empty-buttons">

                No buttons added yet.

                <br>

                Click
                <strong>+ Add Button</strong>
                to create one.

            </div>

        `;

        return;

    }


    buttons.forEach((button, index) => {

        const item =
            document.createElement("div");


        item.className =
            "button-item";


        item.innerHTML = `

            <div class="button-top">

                <span class="button-number">

                    BUTTON ${index + 1}

                </span>

                <button
                    type="button"
                    class="remove-button"
                    data-id="${button.id}"
                >
                    ×
                </button>

            </div>


            <div class="button-grid">

                <input
                    type="text"
                    class="button-text"
                    data-id="${button.id}"
                    value="${escapeHtml(button.text)}"
                    placeholder="Button name"
                >

                <input
                    type="url"
                    class="button-url"
                    data-id="${button.id}"
                    value="${escapeHtml(button.url)}"
                    placeholder="https://example.com"
                >

            </div>

        `;


        buttonsContainer.appendChild(item);

    });


    /*
       Remove button
    */

    document
        .querySelectorAll(".remove-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(
                            this.dataset.id
                        );


                    buttons =
                        buttons.filter(
                            item =>
                                item.id !== id
                        );


                    renderButtons();

                    updatePreview();

                }
            );

        });


    /*
       Button text
    */

    document
        .querySelectorAll(".button-text")
        .forEach(input => {

            input.addEventListener(
                "input",
                function () {

                    const id =
                        Number(
                            this.dataset.id
                        );


                    const item =
                        buttons.find(
                            b =>
                                b.id === id
                        );


                    if (item) {

                        item.text =
                            this.value;

                    }


                    updatePreview();

                }
            );

        });


    /*
       Button URL
    */

    document
        .querySelectorAll(".button-url")
        .forEach(input => {

            input.addEventListener(
                "input",
                function () {

                    const id =
                        Number(
                            this.dataset.id
                        );


                    const item =
                        buttons.find(
                            b =>
                                b.id === id
                        );


                    if (item) {

                        item.url =
                            this.value;

                    }


                    updatePreview();

                }
            );

        });

}



/* -----------------------------------------
   Preview
----------------------------------------- */

function updatePreview() {


    const currentImage =
        imageUrl.value.trim();


    const currentTitle =
        title.value.trim();


    const currentDescription =
        description.value.trim();


    const currentMainUrl =
        mainUrl.value.trim();


    /*
       Image
    */

    if (currentImage) {

        previewImageContainer.innerHTML = `

            <img
                src="${escapeHtml(currentImage)}"
                alt="Banner"
                onerror="imageError(this)"
            >

        `;

    }
    else {

        previewImageContainer.innerHTML = `

            <div class="image-placeholder">
                Your Banner
            </div>

        `;

    }


    /*
       Title
    */

    previewTitle.textContent =
        currentTitle ||
        "Your Business Name";


    /*
       Description
    */

    previewDescription.textContent =
        currentDescription ||
        "Welcome to our website. Discover our products and services.";


    /*
       Main URL
    */

    if (currentMainUrl) {

        previewMainUrl.href =
            currentMainUrl;

        try {

            previewMainUrl.textContent =
                new URL(
                    currentMainUrl
                ).hostname;

        }
        catch {

            previewMainUrl.textContent =
                currentMainUrl;

        }

    }
    else {

        previewMainUrl.href = "#";

        previewMainUrl.textContent =
            "yourdomain.com";

    }


    /*
       Buttons
    */

    previewButtons.innerHTML = "";


    buttons.forEach(button => {

        if (!button.text.trim()) {
            return;
        }


        const element =
            document.createElement("a");


        element.className =
            "preview-button";

        element.href = button.url;

        element.target = "_blank";

        element.rel = "noopener noreferrer";


        element.textContent =
            button.text;


        previewButtons.appendChild(
            element
        );

    });

}



/* -----------------------------------------
   Input listeners
----------------------------------------- */

[
    imageUrl,
    title,
    description,
    mainUrl

].forEach(input => {

    input.addEventListener(
        "input",
        updatePreview
    );

});



/* -----------------------------------------
   Create WhatsApp message
----------------------------------------- */

function generateWhatsAppMessage() {

    const currentTitle =
        title.value.trim();


    const currentDescription =
        description.value.trim();


    const currentMainUrl =
        mainUrl.value.trim();


    const messageParts = [];

    if (currentMainUrl) {
        messageParts.push(currentMainUrl);
    }

    if (currentTitle) {
        messageParts.push(`*${currentTitle}*`);
    }

    if (currentDescription) {
        messageParts.push(currentDescription);
    }

    const buttonLinks = buttons
        .filter(button => button.text.trim() && button.url.trim())
        .map(button => `*${button.text.trim()}*\n${button.url.trim()}`);

    if (buttonLinks.length > 0) {
        messageParts.push(buttonLinks.join("\n\n"));
    }

    return messageParts.join("\n\n");

}



/* -----------------------------------------
   WhatsApp Share
----------------------------------------- */

shareButton.addEventListener(
    "click",
    function () {

        const message =
            generateWhatsAppMessage();


        if (!message) {

            showStatus(
                "Please add some content first.",
                true
            );

            return;

        }


        const whatsappUrl =
            "https://wa.me/?text=" +
            encodeURIComponent(
                message
            );


        window.open(
            whatsappUrl,
            "_blank"
        );


        showStatus(
            "WhatsApp opened."
        );

    }
);



/* -----------------------------------------
   Copy Message
----------------------------------------- */

copyButton.addEventListener(
    "click",
    async function () {

        const message =
            generateWhatsAppMessage();


        if (!message) {

            showStatus(
                "Nothing to copy.",
                true
            );

            return;

        }


        try {

            await navigator.clipboard.writeText(
                message
            );


            showStatus(
                "Message copied."
            );

        }
        catch {

            showStatus(
                "Copy failed.",
                true
            );

        }

    }
);



/* -----------------------------------------
   Status
----------------------------------------- */

function showStatus(
    message,
    error = false
) {

    status.textContent =
        message;

    status.style.color =
        error
            ? "#c73434"
            : "#128c7e";


    setTimeout(
        () => {

            status.textContent =
                "";

        },
        3000
    );

}



/* -----------------------------------------
   HTML escaping
----------------------------------------- */

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



/* -----------------------------------------
   Image error
----------------------------------------- */

function imageError(img) {

    img.parentElement.innerHTML = `

        <div class="image-placeholder">

            Image could not be loaded

        </div>

    `;

}



/* -----------------------------------------
   Initial preview
----------------------------------------- */

addNewButton();

addNewButton();

updatePreview();