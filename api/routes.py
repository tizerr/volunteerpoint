from flask import request, jsonify
from flask_restful import Resource, abort
from json import loads
from flask_cors import cross_origin
#
from models import User
from app import api, db


class Register(Resource):

    @cross_origin()
    def post(self):
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
        return jsonify({'username': user.username}), 201


class Login(Resource):

    @cross_origin()
    def post(self):
        data = loads(request.data)
        if data['username'] is None or data['password'] is None:
            abort(400)  # missing arguments
        user = User.query.filter_by(username=data['username']).first()
        if user.check_password(data['password']):
            token = user.encode_token()
            print(token)
            return jsonify({'accessToken': token, 'user': {'id': user.id, 'username': user.username}}), 200
        return jsonify({}), 403  # incorrect password


class CurrentUser(Resource):

    @cross_origin()
    def post(self):
        data = loads(request.data)
        print(data)
        if data['accessToken'] is None:
            abort(400)  # missing arguments
        id_ = User.decode_auth_token(data['accessToken'])
        if not (type(id_) == int):
            print(id_)
            return jsonify({'message': id_}), 403  # error
        user = User.query.filter_by(id=id_).first()
        return jsonify({'user': {'id': user.id, 'username': user.username}}), 200


api.add_resource(Register, '/auth/register')
api.add_resource(Login, '/auth/login')
api.add_resource(CurrentUser, '/auth/currentuser')