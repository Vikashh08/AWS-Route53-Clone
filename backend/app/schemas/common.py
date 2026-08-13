from pydantic import BaseModel
from typing import Generic, TypeVar, List

T = TypeVar("T")

class Pagination(BaseModel):
    page: int
    page_size: int
    total: int
    total_pages: int

class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]
    pagination: Pagination
