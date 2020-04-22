class Config:
  orm_mode = True

from pydantic.dataclasses import dataclass
from typing import List, Optional
from enum import Enum, auto


@dataclass(config=Config)
class UserInfo:
  username: str  
  password: str  
  enum_field: SOME_ENUM  
  nullable_field: Optional[float]  
  nullable_list: Optional[List[int]]

@dataclass(config=Config)
class TokenOutput:
  accessToken: str

@dataclass(config=Config)
class InsertUserActionArgs:
  user_info: UserInfo

class SOME_ENUM(Enum):
  TYPE_A = auto()  
  TYPE_B = auto()  
  TYPE_C = auto()

@dataclass(config=Config)
class Mutation:
  InsertUserAction: Optional[TokenOutput]

from fastapi import Body, FastAPI

app = FastAPI()

@app.post("/items/", response_model=InsertUserActionArgs)
async def InsertUserActionHandler(item: InsertUserActionArgs = Body(...)) -> TokenOutput:
    # business logic here