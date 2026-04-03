from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

def create_table():
    conn = get_db()
    conn.execute("CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, total INTEGER, correct INTEGER, accuracy INTEGER)")
    conn.commit()
    conn.close()

@app.route("/")
def home(): return render_template("index.html")

@app.route("/practice")
def practice(): return render_template("practice.html")

@app.route("/history")
def history():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name, total, correct, accuracy FROM scores ORDER BY id DESC LIMIT 5")
    
    rows = cursor.fetchall()
    conn.close()

    scores = []
    for row in rows:
        scores.append({
            "name": row[0],
            "total": row[1],
            "correct": row[2],
            "accuracy": row[3]
        })

    return render_template("history.html", scores=scores)

@app.route("/save_score", methods=["POST"])
def save_score():
    data = request.get_json()
    conn = get_db()
    conn.execute("INSERT INTO scores (name, total, correct, accuracy) VALUES (?,?,?,?)",
                 (data['name'], data['total'], data['correct'], data['accuracy']))
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})

if __name__ == "__main__":
    create_table()
    app.run(host="0.0.0.0",port=10000)