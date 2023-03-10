from flask import Flask
#
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
#
from config import Config


app = Flask(__name__)
app.config.from_object(Config)

cors = CORS(app, resources={r"/*": {"origins": "*"}})

db = SQLAlchemy(app)
with app.test_request_context():
    db.init_app(app)
    db.create_all()

migrate = Migrate(app, db)

from routes import *
from models import *

if __name__ == '__main__':
    app.run(debug=True)