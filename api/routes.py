from flask import request, jsonify
from flask_restful import Resource, abort
from json import loads
#
from models import User
from app import api, db


class Register(Resource):

    def post(self):
        data = loads(request.data)
        if data['username'] is None or data['password'] is None:
            abort(400)  # missing arguments
        if User.query.filter_by(username=data['username']).first() is not None:
            abort(400)  # existing user
        user = User(username=data['username'], email=data['email'])
        user.create_hash(data['password'])
        db.session.add(user)
        db.session.commit()
        return jsonify({'username': user.username}), 201


api.add_resource(Register, '/auth/register')