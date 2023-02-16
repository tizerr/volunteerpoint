def event_construct(event):
    author_id = event.author_id
    participants_id = [i.id for i in event.participants] or []
    return {'id': event.id, 'name': event.name, 'description': event.description,
            'address': event.address,
            'date_start': event.date_start.strftime("%d.%m.%Y, %H:%M:%S"),
            'date_end': event.date_end.strftime("%d.%m.%Y, %H:%M:%S"),
            'coord_x': event.coord_x, 'coord_y': event.coord_y, 'img_path': event.img_path,
            'author_id': author_id, 'participants_id': participants_id,
            'was_moderated': event.was_moderated, 'is_published': event.is_published}


def user_construct(user):
    participated_ids = [i.id for i in user.participated_events] or []
    return {'id': user.id, 'username': user.username, 'email': user.email, 'age': user.age,
            'address': user.address, 'description': user.description, 'img_path': user.img_path,
            'participated_ids': participated_ids,
            'date_created': user.date_created.strftime("%d.%m.%Y"),
            'is_moderator': user.is_moderator}
