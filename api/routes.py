from flask_restful import Resource
#
from app import api


class Index(Resource):
    def get(self):
        return {'hello': 'world'}


api.add_resource(Index, '/')