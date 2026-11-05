
from flask import Flask, render_template, request, jsonify
import qrcode
import io
import base64

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/generate_qr", methods=["POST"])
def generate_qr():

    data = request.get_json(silent=True) or {}
    content = data.get("content", "").strip()

    if not content:
        return jsonify({"error": "Please enter some text or URL"}), 400

    try:
        # Generate QR code
        qr = qrcode.make(content)

        # Convert QR image into PNG bytes
        buffer = io.BytesIO()
        qr.save(buffer)

        # Convert image into Base64
        qr_base64 = base64.b64encode(
            buffer.getvalue()
        ).decode("utf-8")

        return jsonify({
            "qr_image": f"data:image/png;base64,{qr_base64}"
        })

    except Exception:
        return jsonify({"error": "QR generation failed"}), 500


if __name__ == "__main__":
    app.run(debug=True)
