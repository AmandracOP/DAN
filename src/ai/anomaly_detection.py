import numpy as np
import pandas as pd
import json
import sys
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense
from sklearn.preprocessing import MinMaxScaler

# Define functions to create and train the autoencoder model
def create_model(input_dim):
    model = Sequential([
        Dense(32, activation='relu', input_shape=(input_dim,)),
        Dense(16, activation='relu'),
        Dense(8, activation='relu'),
        Dense(16, activation='relu'),
        Dense(32, activation='relu'),
        Dense(input_dim, activation='sigmoid')
    ])
    model.compile(optimizer='adam', loss='mse')
    return model

def detect_anomalies(model, scaler, new_data):
    new_data_scaled = scaler.transform(new_data)
    reconstructed_data = model.predict(new_data_scaled)
    mse = np.mean(np.power(new_data_scaled - reconstructed_data, 2), axis=1)
    return mse > 0.01  # Anomalies if MSE > 0.01

# Load activity data from the argument passed by the backend
activity_data = json.loads(sys.argv[1])

# Assuming activity data comes in a list of lists
new_data = np.array(activity_data)

# Load the trained model and scaler (you should have saved these after training)
model = load_model('autoencoder_model.h5')
scaler = MinMaxScaler()
scaler.fit(new_data)  # Ensure you scale it similarly to how you trained it

# Detect anomalies in the new data
anomalies = detect_anomalies(model, scaler, new_data)

# Output the results in JSON format
output = []
for i, is_anomalous in enumerate(anomalies):
    output.append({
        "nodeIndex": i,
        "anomalous": bool(is_anomalous)
    })

print(json.dumps(output))
