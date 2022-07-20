"""Init database

Revision ID: 667b9fb9bead
Revises: 
Create Date: 2022-07-10 20:05:23.928849

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = '667b9fb9bead'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('blacklist_tokens',
                    sa.Column('id', sa.CHAR(length=36), nullable=False),
                    sa.Column('token', sa.String(), nullable=False),
                    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_blacklist_tokens_id'), 'blacklist_tokens', ['id'], unique=True)
    op.create_index(op.f('ix_blacklist_tokens_token'), 'blacklist_tokens', ['token'], unique=True)
    op.create_table('meetings',
                    sa.Column('id', sa.CHAR(length=36), nullable=False),
                    sa.Column('name', sa.String(), nullable=True),
                    sa.Column('meeting_link', sa.String(), nullable=False),
                    sa.Column('record_link', sa.String(), nullable=True),
                    sa.Column('start_time', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.Column('end_time', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_meetings_id'), 'meetings', ['id'], unique=True)
    op.create_table('password_reset_tokens',
                    sa.Column('id', sa.CHAR(length=36), nullable=False),
                    sa.Column('token', sa.String(length=255), nullable=False),
                    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_password_reset_tokens_id'), 'password_reset_tokens', ['id'], unique=True)
    op.create_index(op.f('ix_password_reset_tokens_token'), 'password_reset_tokens', ['token'], unique=False)
    op.create_table('users',
                    sa.Column('id', sa.CHAR(length=36), nullable=False),
                    sa.Column('first_name', sa.String(), nullable=True),
                    sa.Column('last_name', sa.String(), nullable=True),
                    sa.Column('avatar', sa.String(), nullable=True),
                    sa.Column('email', sa.String(), nullable=False),
                    sa.Column('phone', sa.String(), nullable=True),
                    sa.Column('password', sa.String(), nullable=False),
                    sa.Column('activated_at', sa.TIMESTAMP(), nullable=True),
                    sa.Column('deactivated_at', sa.TIMESTAMP(), nullable=True),
                    sa.Column('payment_status', sa.Boolean(), nullable=True),
                    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.Column('registry_type', sa.String(), nullable=False),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=False)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=True)
    op.create_table('votes',
                    sa.Column('id', sa.CHAR(length=36), nullable=False),
                    sa.Column('type', sa.String(), nullable=False),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_votes_id'), 'votes', ['id'], unique=True)
    op.create_index(op.f('ix_votes_type'), 'votes', ['type'], unique=True)
    op.create_table('instructors',
                    sa.Column('id', sa.CHAR(length=36), nullable=False),
                    sa.Column('rate', sa.Float(), nullable=True),
                    sa.Column('specialty', sa.String(), nullable=True),
                    sa.Column('organization', sa.String(), nullable=True),
                    sa.Column('experience', sa.String(), nullable=True),
                    sa.ForeignKeyConstraint(['id'], ['users.id'], ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_table('learners',
                    sa.Column('id', sa.CHAR(length=36), nullable=False),
                    sa.Column('rate', sa.Float(), nullable=True),
                    sa.ForeignKeyConstraint(['id'], ['users.id'], ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_table('posts',
                    sa.Column('id', sa.CHAR(length=36), nullable=False),
                    sa.Column('user_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('title', sa.String(), nullable=False),
                    sa.Column('content', sa.String(), nullable=False),
                    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_posts_id'), 'posts', ['id'], unique=True)
    op.create_table('appointments',
                    sa.Column('id', sa.CHAR(length=36), nullable=False),
                    sa.Column('learner_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('instructor_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('meeting_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('name', sa.String(), nullable=False),
                    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.ForeignKeyConstraint(['instructor_id'], ['instructors.id'], ondelete='CASCADE'),
                    sa.ForeignKeyConstraint(['learner_id'], ['learners.id'], ondelete='CASCADE'),
                    sa.ForeignKeyConstraint(['meeting_id'], ['meetings.id'], ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_appointments_id'), 'appointments', ['id'], unique=True)
    op.create_table('comments',
                    sa.Column('id', sa.CHAR(length=36), nullable=False),
                    sa.Column('user_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('post_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('content', sa.String(), nullable=False),
                    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ondelete='CASCADE'),
                    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_comments_id'), 'comments', ['id'], unique=True)
    op.create_table('conversations',
                    sa.Column('id', sa.CHAR(length=36), nullable=False),
                    sa.Column('learner_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('instructor_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('status', sa.Boolean(), nullable=False),
                    sa.ForeignKeyConstraint(['instructor_id'], ['instructors.id'], ondelete='CASCADE'),
                    sa.ForeignKeyConstraint(['learner_id'], ['learners.id'], ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_conversations_id'), 'conversations', ['id'], unique=True)
    op.create_table('post_votes',
                    sa.Column('id', sa.CHAR(length=36), nullable=False),
                    sa.Column('user_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('vote_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('post_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('status', sa.BOOLEAN(), nullable=False),
                    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ondelete='CASCADE'),
                    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
                    sa.ForeignKeyConstraint(['vote_id'], ['votes.id'], ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_post_votes_id'), 'post_votes', ['id'], unique=True)
    op.create_table('comment_votes',
                    sa.Column('id', sa.CHAR(length=36), nullable=False),
                    sa.Column('user_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('vote_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('comment_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('status', sa.BOOLEAN(), nullable=False),
                    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.ForeignKeyConstraint(['comment_id'], ['comments.id'], ondelete='CASCADE'),
                    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
                    sa.ForeignKeyConstraint(['vote_id'], ['votes.id'], ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_comment_votes_id'), 'comment_votes', ['id'], unique=True)
    op.create_table('feedbacks',
                    sa.Column('id', sa.CHAR(length=36), nullable=False),
                    sa.Column('user_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('appointment_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('rating', sa.Integer(), nullable=True),
                    sa.Column('review', sa.String(), nullable=True),
                    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.ForeignKeyConstraint(['appointment_id'], ['appointments.id'], ondelete='CASCADE'),
                    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_feedbacks_id'), 'feedbacks', ['id'], unique=True)
    op.create_table('messages',
                    sa.Column('id', sa.CHAR(length=36), nullable=False),
                    sa.Column('user_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('conversation_id', sa.CHAR(length=36), nullable=True),
                    sa.Column('status', sa.Boolean(), nullable=False),
                    sa.Column('content', sa.String(), nullable=False),
                    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
                    sa.ForeignKeyConstraint(['conversation_id'], ['conversations.id'], ondelete='CASCADE'),
                    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_index(op.f('ix_messages_id'), 'messages', ['id'], unique=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_messages_id'), table_name='messages')
    op.drop_table('messages')
    op.drop_index(op.f('ix_feedbacks_id'), table_name='feedbacks')
    op.drop_table('feedbacks')
    op.drop_index(op.f('ix_comment_votes_id'), table_name='comment_votes')
    op.drop_table('comment_votes')
    op.drop_index(op.f('ix_post_votes_id'), table_name='post_votes')
    op.drop_table('post_votes')
    op.drop_index(op.f('ix_conversations_id'), table_name='conversations')
    op.drop_table('conversations')
    op.drop_index(op.f('ix_comments_id'), table_name='comments')
    op.drop_table('comments')
    op.drop_index(op.f('ix_appointments_id'), table_name='appointments')
    op.drop_table('appointments')
    op.drop_index(op.f('ix_posts_id'), table_name='posts')
    op.drop_table('posts')
    op.drop_table('learners')
    op.drop_table('instructors')
    op.drop_index(op.f('ix_votes_type'), table_name='votes')
    op.drop_index(op.f('ix_votes_id'), table_name='votes')
    op.drop_table('votes')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    op.drop_index(op.f('ix_password_reset_tokens_token'), table_name='password_reset_tokens')
    op.drop_index(op.f('ix_password_reset_tokens_id'), table_name='password_reset_tokens')
    op.drop_table('password_reset_tokens')
    op.drop_index(op.f('ix_meetings_id'), table_name='meetings')
    op.drop_table('meetings')
    op.drop_index(op.f('ix_blacklist_tokens_token'), table_name='blacklist_tokens')
    op.drop_index(op.f('ix_blacklist_tokens_id'), table_name='blacklist_tokens')
    op.drop_table('blacklist_tokens')
    # ### end Alembic commands ###
