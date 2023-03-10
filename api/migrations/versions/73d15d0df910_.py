"""empty message

Revision ID: 73d15d0df910
Revises: efa56a52646e
Create Date: 2023-02-15 23:01:47.285648

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '73d15d0df910'
down_revision = 'efa56a52646e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('event', schema=None) as batch_op:
        batch_op.add_column(sa.Column('was_moderated', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('event', schema=None) as batch_op:
        batch_op.drop_column('was_moderated')

    # ### end Alembic commands ###
