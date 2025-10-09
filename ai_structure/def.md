# 1. AI goals
we can think about ai features for the bus tracking management, for exemple;
1. Predictive bus arrival times at stops using historical and live GPS data.
2. route optimization suggestions based on traffic patterns and delays.
3. anomaly detection to flag buses off-route or delayed unusually.
4. passenger load prediction

# 2. Data requirement
we will need:
- Bus telemetry: busId, timestamp, location (lat/long), speed, direction
- stops: stopId, location.
- Historical trips for training: past GPS traces, trip times between stops.
MongoDB already stores buses and tracks, so we can pull that data for trainingn the model.

# 3. Ai model options
- Lightweight approach: use scikit-learn for regression on trip time between stops.
- Advanced approach: use LSTM/RNN for sequence prediction if we have a lot of telemetry data.
- API first approach: use OpenAI or Hugging face modesl if we want a chatbot like interface for queries ("what will bus 12 arrive at stop Hmama").

For first working prototype i think we can start by python + scikit learn fo regression, and if we can an API from OpenAI/Deepseek or any cheap one.

# 4. Inegratin architecture
1. Node.js backend -> calls python ai service via HTTP API or child process.
2. python ai service -> reads bus telemetry from MongoDB -> returns predictions.
3. Frontend/websocket -> receives predicted arrival tiem in real times.