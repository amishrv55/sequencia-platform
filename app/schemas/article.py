# schemas/article.py

#from pydantic import BaseModel
#from typing import Optional, List
#from datetime import datetime


#class ArticleBase(BaseModel):
    #title: str
    #summary: Optional[str]
    #content: str
    #image_url: Optional[str] = None  # ✅ Use singular name & type str

#class ArticleCreate(ArticleBase):
    #keywords: Optional[List[str]] = []

#class ArticleOut(ArticleBase):
    #id: int
    #created_at: datetime
    #keywords: List[str]

    #class Config:
        #from_attributes = True


from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal
from datetime import datetime

class ContentBlock(BaseModel):
    type: Literal["paragraph", "heading", "image", "table", "chart"]
    data: Dict[str, Any]
    
    class Config:
        json_encoders = {
            # Add any custom serializers if needed
        }

class ArticleBase(BaseModel):
    title: str
    summary: Optional[str]
    content: List[ContentBlock]  # Array of content blocks
    image_url: Optional[str] = None
    approval_rating: Optional[float] = Field(None, ge=0, le=100)
    sentiment_score: Optional[float] = Field(None, ge=-1, le=1)

class ArticleCreate(ArticleBase):
    keywords: Optional[List[str]] = []

class ArticleOut(ArticleBase):
    id: int
    created_at: datetime
    keywords: List[str]

    class Config:
        from_attributes = True