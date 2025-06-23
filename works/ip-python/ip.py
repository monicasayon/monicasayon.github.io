from flask import Flask, jsonify, request
from flask_cors import CORS  # Import flask-cors
import urllib.request as urllib2
import json

def get_ip_info():
    ip = request.args.get('ip')  # Get IP from request URL
    if not ip:
        return jsonify({"error": "No IP address provided"}), 400

    url = f"http://ip-api.com/json/{ip}"
    try:
        response = urllib2.urlopen(url)
        data = response.read()
        values = json.loads(data)
        
        return jsonify({
            "IP": values.get("query", "N/A"),
            "City": values.get("city", "N/A"),
            "ISP": values.get("isp", "N/A"),
            "Country": values.get("country", "N/A"),
            "Region": values.get("region", "N/A"),
            "Timezone": values.get("timezone", "N/A"),
            "Currency": values.get("currency", "N/A")
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Return error message
