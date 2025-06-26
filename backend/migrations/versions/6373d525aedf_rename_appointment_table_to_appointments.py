"""Rename appointment table to appointments

Revision ID: 6373d525aedf
Revises: 0601442ad45a
Create Date: 2025-06-26 18:05:03.515102

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '6373d525aedf'
down_revision = '0601442ad45a'
branch_labels = None
depends_on = None


def upgrade():
     op.rename_table('appointment', 'appointments')
    # If indexes exist and were auto-renamed in SQLA models, rename them too
    # op.execute("ALTER INDEX appointment_pkey RENAME TO appointments_pkey")


def downgrade():
    op.rename_table('appointments', 'appointment')
    # op.execute("ALTER INDEX appointments_pkey RENAME TO appointment_pkey")