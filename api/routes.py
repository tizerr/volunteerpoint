import datetime

from flask import request, jsonify, abort, send_from_directory
from sqlalchemy import func
from json import loads
#
from functools import wraps
#
from werkzeug.utils import secure_filename

from utils import event_construct, user_construct
from models import User, Event
from app import app, db


def login_required(func):
    @wraps(func)
    def inner(*args, **kwargs):
        try:
            data: dict = loads(request.data)
        except:
            data: dict = request.form
        if 'accessToken' not in data.keys():
            return {}, 403
        id_ = User.decode_auth_token(data['accessToken'])
        user = User.query.filter_by(id=id_).first()
        return func(user=user, *args, **kwargs)

    return inner


@app.route('/auth/register', methods=["POST"])
def register():
    data = loads(request.data)
    print(data)
    if data['username'] is None or data['password'] is None:
        abort(400)  # missing arguments
    if User.query.filter_by(username=data['username']).first() is not None:
        abort(400)  # existing user
    user = User(username=data['username'], email=data['email'])
    user.create_hash(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'id': user.id, 'username': user.username}), 201


@app.route('/auth/login', methods=["POST"])
def login():
    data = loads(request.data)
    if data['email'] is None or data['password'] is None:
        abort(400)  # missing arguments
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        token = user.encode_token()
        print(token)
        return jsonify(
            {'accessToken': token, 'user': {'id': user.id, 'username': user.username}}), 200
    return jsonify({}), 403  # incorrect password


@app.route('/auth/currentuser', methods=["POST"])
def current_user():
    data = loads(request.data)
    print(data)
    if data['accessToken'] is None:
        abort(400)  # missing arguments
    id_ = User.decode_auth_token(data['accessToken'])
    if not (type(id_) == int):
        print(id_)
        return jsonify({'message': id_}), 403  # error
    user = User.query.filter_by(id=id_).first()
    return jsonify({'user': user_construct(user)}), 200


@app.route('/user/<id_>')
def user(id_):
    user = User.query.filter_by(id=id_).first()
    print(user)
    if user:
        return jsonify(user_construct(user)), 200
    return {}


@app.route('/events/create', methods=["POST"])
@login_required
def create_event(user):
    data = request.form
    print(request.files.items())
    file = request.files.get('file')
    if file == -1 or file and file.filename == '':
        file = None
    print(data, user)
    date_start = datetime.datetime.strptime(data['date_start'], '%Y-%m-%dt%H:%M')
    date_end = datetime.datetime.strptime(data['date_end'], '%Y-%m-%dt%H:%M')
    event = Event(name=data['name'], description=data['description'],
                  address=data['address'], date_start=date_start,
                  date_end=date_end, coord_x=data['coord_x'], coord_y=data['coord_y'])
    event.author_id = user.id
    # file
    if file:
        filename = secure_filename(file.filename)
        filepath = app.config['UPLOAD_FOLDER'] + '/' + filename
        file.save(filepath)
        event.img_path = filepath
    #
    db.session.add(event)
    db.session.commit()
    return jsonify(
        {'event': event_construct(event)}), 200


@app.route('/events', methods=["POST"])
def events_in_rect():
    data = loads(request.data)
    print(data)
    position, scale = data['position'], data['scale']
    mnx, mxx = position[0] - 0.1 * 1 / scale * 13, position[0] + 0.1 * 1 / scale * 13
    mny, mxy = position[1] - 0.05 * 1 / scale * 13, position[1] + 0.05 * 1 / scale * 13
    events = Event.query.filter(Event.coord_x > mnx, Event.coord_x < mxx, Event.coord_y > mny,
                                Event.coord_y < mxy, Event.is_published is True).all()
    print(events)
    if events:
        return jsonify([event_construct(event) for event in events]), 200
    return []


@app.route('/events/organized', methods=["POST"])
@login_required
def organized_events(user):
    events = Event.query.filter_by(author_id=user.id).all()
    print(events)
    if events:
        return jsonify([event_construct(event) for event in events]), 200
    return []


@app.route('/events/participated', methods=["POST"])
@login_required
def participated_events(user):
    events = user.participated_events
    print(events)
    if events:
        return jsonify([event_construct(event) for event in events]), 200
    return []


@app.route('/edit_profile', methods=["POST"])
@login_required
def edit_profile(user):
    data = request.form
    file = request.files.get('file')
    if file == -1 or file and file.filename == '':
        file = None
    print(data)
    if data['username']:
        user.username = data['username']
    if data['age']:
        user.age = data['age']
    if data['address']:
        user.address = data['address']
    if data['description']:
        user.description = data['description']
    # file
    if file:
        filename = secure_filename(file.filename)
        filepath = app.config['UPLOAD_FOLDER'] + '/' + filename
        file.save(filepath)
        user.img_path = filepath
    #
    db.session.add(user)
    db.session.commit()
    return jsonify({'user': user_construct(user)}), 200


@app.route('/uploads/<name>')
def uploads(name):
    if name:
        return send_from_directory(app.config['UPLOAD_FOLDER'], name)
    return None


@app.route('/events/<id_>', methods=["POST"])
def event(id_):
    event = Event.query.filter_by(id=id_).first()
    print(event)
    if event:
        return jsonify(event_construct(event)), 200
    return {}


@app.route('/participate_event', methods=["POST"])
@login_required
def participate_event(user):
    data = loads(request.data)
    print(data)
    event = Event.query.filter_by(id=data['id']).first()
    if not event:
        return '', 400
    user.participated_events.append(event)
    print(user.participated_events, event)
    db.session.add(user)
    db.session.commit()
    return '', 200


@app.route('/leave_event', methods=["POST"])
@login_required
def leave_event(user):
    data = loads(request.data)
    print(data)
    event = Event.query.filter_by(id=data['id']).first()
    if not event:
        return '', 400
    user.participated_events.remove(event)
    print(user.participated_events, event)
    db.session.add(user)
    db.session.commit()
    return '', 200


@app.route('/events/<id_>/participants')
def event_participants(id_):
    event = Event.query.filter_by(id=id_).first()
    print(event)
    if event:
        return jsonify([user_construct(user) for user in event.participants]), 200
    return [], 400


@app.route('/events/moderation', methods=['POST'])
@login_required
def moderation_events(user):
    if not user.is_moderator:
        return '', 403
    events = Event.query.filter_by(was_moderated=False).all()
    print(events)
    if events:
        return jsonify([event_construct(event) for event in events]), 200
    return jsonify([]), 200


@app.route('/moderation/resolve', methods=['POST'])
@login_required
def moderation_resolve(user):
    if not user.is_moderator:
        return '', 403
    data = loads(request.data)
    event = Event.query.filter_by(id=data['event_id']).first()
    print(event)
    if event and 'choice' in data.keys():
        print('in')
        event.was_moderated = True
        event.is_published = bool(data['choice'])
        db.session.add(event)
        db.session.commit()
        return jsonify({}), 200
    return jsonify({}), 400


@app.route('/events/top', methods=["POST"])
def top_events():
    # events = Event.query.order_by(Event.participants).all()
    events_id = db.engine.execute(
        'SELECT ep.event_id, count(ep.user_id) FROM event_participants AS ep'
        ' GROUP BY ep.event_id ORDER BY count(ep.user_id) DESC LIMIT 10').all()
    events = []
    for id_, c in events_id:
        events.append(Event.query.filter_by(id=id_).first())
    print(events)
    if events:
        return jsonify([event_construct(event) for event in events]), 200
    return []


@app.route('/search', methods=["POST"])
def search():
    data = loads(request.data)
    req = f'%{data["query"]}%'
    events = Event.query.filter(
        (Event.name.ilike(req) | Event.description.ilike(req))
        & (Event.is_published is True)).all()
    print(events)
    if events:
        return jsonify([event_construct(event) for event in events]), 200
    return []
