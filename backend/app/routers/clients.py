from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.client import Client
from app.models.user import User
from app.schemas.client import ClientCreate, ClientOut, ClientUpdate

router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("", response_model=list[ClientOut])
def list_clients(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[ClientOut]:
    clients = db.scalars(
        select(Client)
        .where(Client.business_id == current_user.business_id, Client.deleted_at.is_(None))
        .order_by(Client.name)
    ).all()
    return [ClientOut.model_validate(c) for c in clients]


@router.post("", response_model=ClientOut, status_code=status.HTTP_201_CREATED)
def create_client(
    payload: ClientCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ClientOut:
    client = Client(
        business_id=current_user.business_id,
        **payload.model_dump(),
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return ClientOut.model_validate(client)


@router.get("/{client_id}", response_model=ClientOut)
def get_client(
    client_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ClientOut:
    client = db.scalar(
        select(Client).where(
            Client.id == client_id,
            Client.business_id == current_user.business_id,
            Client.deleted_at.is_(None),
        )
    )
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    return ClientOut.model_validate(client)


@router.patch("/{client_id}", response_model=ClientOut)
def update_client(
    client_id: int,
    payload: ClientUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ClientOut:
    client = db.scalar(
        select(Client).where(
            Client.id == client_id,
            Client.business_id == current_user.business_id,
            Client.deleted_at.is_(None),
        )
    )
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(client, field, value)
    db.commit()
    db.refresh(client)
    return ClientOut.model_validate(client)


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(
    client_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    client = db.scalar(
        select(Client).where(
            Client.id == client_id,
            Client.business_id == current_user.business_id,
            Client.deleted_at.is_(None),
        )
    )
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    client.soft_delete()
    db.commit()
