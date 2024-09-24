from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/run_script', methods=['POST'])
def run_script():
    # Path to your Python script
    script_path = r'C:\\Users\\Lenovo\\Downloads'
    
    try:
        # Run the script
        result = subprocess.run(['python', script_path], capture_output=True, text=True)
        output = result.stdout
        
        # Return the output as a JSON response
        return jsonify({'response': output})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)
