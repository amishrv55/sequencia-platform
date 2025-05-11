"""article update

Revision ID: 02b364c394e8
Revises: a2d8fbabebf2
Create Date: 2025-04-27 01:58:30.184505

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '02b364c394e8'
down_revision: Union[str, None] = 'a2d8fbabebf2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # For PostgreSQL
    op.alter_column(
        'articles', 
        'content',
        type_=sa.JSON(),
        postgresql_using='content::json'  # This is the critical line
    )

def downgrade():
    op.alter_column(
        'articles', 
        'content',
        type_=sa.Text()
    )