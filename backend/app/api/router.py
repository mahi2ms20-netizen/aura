from fastapi import APIRouter

from app.api.routes import auth, brands, collab, creators, discover, feed, health, map, scores

router = APIRouter()
router.include_router(health.router, tags=['health'])
router.include_router(auth.router, prefix='/auth', tags=['auth'])
router.include_router(discover.router, prefix='/discover', tags=['discover'])
router.include_router(map.router, prefix='/map', tags=['map'])
router.include_router(creators.router, prefix='/creators', tags=['creators'])
router.include_router(feed.router, prefix='/feed', tags=['feed'])
router.include_router(collab.router, prefix='/collab', tags=['collaboration'])
router.include_router(brands.router, prefix='/brands', tags=['brands'])
router.include_router(scores.router, prefix='/scores', tags=['scores'])
