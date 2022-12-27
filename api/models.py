from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
#
from app import db, app

event_participants = db.Table(
    'event_participants',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('event_id', db.Integer, db.ForeignKey('event.id'))
)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True, nullable=False)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    is_moderator = db.Column(db.Boolean, default=False)
    is_confirmed = db.Column(db.Boolean, default=False)

    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    date_confirmation_expire = db.Column(db.DateTime, nullable=False, default=datetime.utcnow() + timedelta(days=1))

    created_events = db.relationship('Event', backref='author')
    participated_events = db.relationship('Event', secondary=event_participants, backref='participants')

    def create_hash(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def encode_token(self):
        try:
            payload = {
                'exp': datetime.utcnow() + timedelta(days=1),
                'iat': datetime.utcnow(),
                'sub': self.id
            }
            return jwt.encode(
                payload,
                app.config.get('SECRET_KEY'),
                algorithm='HS256',
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        try:
            payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'), algorithms=["HS256"])
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'

    def __repr__(self):
        return f'<User {self.username}>'


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, nullable=False)
    description = db.Column(db.String(200), index=True)
    address = db.Column(db.String(100), nullable=False)
    coord_x = db.Column(db.Integer, nullable=False)
    coord_y = db.Column(db.Integer, nullable=False)
    is_published = db.Column(db.Boolean, default=False)

    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    date_start = db.Column(db.DateTime, nullable=False)
    date_end = db.Column(db.DateTime, nullable=False)

    author_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # author
    # participants

    def __repr__(self):
        return f'<Event {self.name}>'
