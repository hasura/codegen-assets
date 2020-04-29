class Config:
  orm_mode = True

from pydantic.dataclasses import dataclass
from typing import List, Optional
from enum import Enum, auto

@dataclass(config=Config)
class Mutation:
  CustomInsertUser: Optional[CustomInsertUserOutput]

@dataclass(config=Config)
class CustomInsertUserOutput:
  email: str
  id: int
  name: str
  enum_value: Optional[SOME_ENUM]
  nullable_field: Optional[float]
  nullable_list: Optional[List[int]]

@dataclass(config=Config)
class CustomInsertUserArgs:
  email: str
  name: str

class SOME_ENUM(Enum):
  TYPE_A = auto()
  TYPE_B = auto()
  TYPE_C = auto()

from fastapi import Body, FastAPI

app = FastAPI()

@app.post("/items/", response_model=CustomInsertUserArgs)
async def CustomInsertUserHandler(item: CustomInsertUserArgs = Body(...)) -> CustomInsertUserOutput:
    # business logic here