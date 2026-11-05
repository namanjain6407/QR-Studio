
const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");
const resetBtn = document.getElementById("reset-btn");

const qrInput = document.getElementById("qr-input");
const qrPreview = document.getElementById("qr-preview");
const qrType = document.getElementById("qr-type");


// Generate QR Code
generateBtn.addEventListener("click", async function () {

    const content = qrInput.value.trim();

    if (!content) {
        alert("Please enter a URL or text!");
        return;
    }

    generateBtn.disabled = true;
    generateBtn.textContent = "Generating...";

    try {

        const response = await fetch("/generate_qr", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                content: content
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Something went wrong");
        }

        // Display QR image
        qrPreview.innerHTML = `
            <img src="${result.qr_image}" alt="Generated QR Code">
        `;

        // Enable download button
        downloadBtn.disabled = false;

    } catch (error) {

        alert(error.message);

    } finally {

        generateBtn.disabled = false;
        generateBtn.textContent = "Generate QR Code";

    }

});


// Download QR Code
downloadBtn.addEventListener("click", function () {

    const qrImage = qrPreview.querySelector("img");

    if (!qrImage) return;

    const link = document.createElement("a");

    link.href = qrImage.src;
    link.download = "QR-Studio-Code.png";

    link.click();

});


// Reset everything
resetBtn.addEventListener("click", function () {

    qrInput.value = "";

    qrPreview.innerHTML = `
        <p>Your QR code will appear here.</p>
    `;

    downloadBtn.disabled = true;

});


// Change placeholder based on QR type
qrType.addEventListener("change", function () {

    if (qrType.value === "url") {

        qrInput.placeholder = "Enter your website URL...";

    } else {

        qrInput.placeholder = "Enter your text here...";

    }

});
