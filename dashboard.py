# all the imports
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
from contextlib import closing
import requests
import json

# configuration
DATABASE = '/tmp/OBMSdashboard.db'
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'
HOME_CONTROLLER_URL = 'http://192.168.99.100:5050'

app = Flask(__name__)
app.config.from_object(__name__)

def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

@app.route('/')
def show_entries():
    cur = g.db.execute('select title, text from entries order by id desc')
    entries = [dict(title=row[0], text=row[1]) for row in cur.fetchall()]
    return render_template('show_entries.html', entries=entries)

@app.route('/dashboard')
def dashboard():
    r = requests.get(HOME_CONTROLLER_URL)
    systemData = r.json()
    print systemData
    # systemData = r.text
    return render_template('dashboard.html', systemData=systemData)

@app.route('/energy_profiles')
def energy_profiles():
    return render_template('energy_profiles.html')

@app.route('/analytics')
def analytics():
    return render_template('analytics.html')

@app.route('/dash')
def dash():
    return render_template('dash.html')

@app.route('/set_profile', methods=['POST'])
def set_profile():
    data = {}
    if request.form['value']:
        data['value'] = str(request.form['value']).lower()
        data['type'] = 'profile'
        # data['property'] = 'property'
        headers = {'Content-Type': 'application/json'}
        r = requests.post(HOME_CONTROLLER_URL, data = json.dumps(data))
        return "Success"
    else:
        abort(400)

@app.route('/set_price', methods=['POST'])
def set_price():
    data = {}
    if request.form['value']:
        data['value'] = str(request.form['value']).lower()
        data['type'] = 'price'
        headers = {'Content-Type': 'application/json'}
        r = requests.post(HOME_CONTROLLER_URL, data = json.dumps(data))
        return "Success"
    else:
        abort(400)

@app.route('/device_command', methods=['POST'])
def device_command():
    data = {}
    if request.form['device_id'] and request.form['value'] and request.form['property']:
        data['device_id'] = request.form['device_id']
        data['value'] = str(request.form['value']).lower()
        data['type'] = 'device'
        data['property'] = request.form['property']
        # data['property'] = 'property'
        headers = {'Content-Type': 'application/json'}
        r = requests.post(HOME_CONTROLLER_URL, data = json.dumps(data))
        return "Success"
    else:
        abort(400)

@app.route('/test')
def test():
    return 'WOOT'

@app.route('/add', methods=['POST'])
def add_entry():
    if not session.get('logged_in'):
        abort(401)
    g.db.execute('insert into entries (title, text) values (?, ?)',
                 [request.form['title'], request.form['text']])
    g.db.commit()
    flash('New entry was successfully posted')
    return redirect(url_for('show_entries'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['username'] != app.config['USERNAME']:
            error = 'Invalid username'
        elif request.form['password'] != app.config['PASSWORD']:
            error = 'Invalid password'
        else:
            session['logged_in'] = True
            flash('You were logged in')
            return redirect(url_for('show_entries'))
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('show_entries'))

if __name__ == '__main__':
    app.run(host='0.0.0.0')
