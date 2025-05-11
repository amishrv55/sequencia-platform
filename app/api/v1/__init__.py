from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, user, question, prediction, comment, category, keyword, leaderboard, profile,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(user.router, prefix="/users", tags=["Users"])
api_router.include_router(question.router, prefix="/questions", tags=["Questions"])
api_router.include_router(prediction.router, prefix="/predictions", tags=["Predictions"])
api_router.include_router(comment.router, prefix="/comments", tags=["Comments"])
api_router.include_router(category.router, prefix="/categories", tags=["Categories"])
api_router.include_router(keyword.router, prefix="/keywords", tags=["Keywords"])
api_router.include_router(leaderboard.router, prefix="/leaderboard", tags=["Leaderboard"])
api_router.include_router(profile.router, prefix="/profile", tags=["Profile"])


# Add others similarly
