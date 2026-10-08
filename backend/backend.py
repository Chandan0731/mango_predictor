import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from io import BytesIO

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes (for frontend access)

# Load the trained model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'mango_classifier_model_2.h5')
model = load_model(MODEL_PATH)

# Define class label mapping
CLASS_LABELS = {
    0: 'mango_1_raspuri',
    1: 'mango_2_langra',
    2: 'mango_3_totapuri'
}

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'status': 'healthy',
        'service': 'Mango Variety Classifier API',
        'supported_classes': list(CLASS_LABELS.values())
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        # Load and preprocess image using BytesIO
        img = image.load_img(BytesIO(file.read()), target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Make prediction
        predictions = model.predict(img_array)
        class_index = int(np.argmax(predictions))
        confidence = float(np.max(predictions))

        # Return result as JSON
        return jsonify({
            'class_id': class_index + 1,  # So frontend receives 1, 2, 3
            'class_name': CLASS_LABELS[class_index],
            'confidence': round(confidence * 100, 2)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

