"""Add save post and star instructor

Revision ID: 5bec5ca5c133
Revises: d9ca36453a48
Create Date: 2022-07-19 11:15:33.900071

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5bec5ca5c133'
down_revision = 'd9ca36453a48'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('saved_posts',
    sa.Column('id', sa.CHAR(length=36), nullable=False),
    sa.Column('user_id', sa.CHAR(length=36), nullable=True),
    sa.Column('post_id', sa.CHAR(length=36), nullable=True),
    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_saved_posts_id'), 'saved_posts', ['id'], unique=True)
    op.create_table('starred_instructors',
    sa.Column('id', sa.CHAR(length=36), nullable=False),
    sa.Column('user_id', sa.CHAR(length=36), nullable=True),
    sa.Column('instructor_id', sa.CHAR(length=36), nullable=True),
    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['instructor_id'], ['users.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_starred_instructors_id'), 'starred_instructors', ['id'], unique=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_starred_instructors_id'), table_name='starred_instructors')
    op.drop_table('starred_instructors')
    op.drop_index(op.f('ix_saved_posts_id'), table_name='saved_posts')
    op.drop_table('saved_posts')
    # ### end Alembic commands ###
