from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# laad the model
model = joblib.load("models/model.pkl")

@app.route("/")
def home():
    return "Flask + scikit-learn AI servie is running"

@app.route("/predict", methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array(data["features"]).reshape(1, -1)
    prediction = model.predict(features)
    return jsonify({"prediction" : prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
