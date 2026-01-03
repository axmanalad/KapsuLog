from fastapi import FastAPI, HTTPException, Request, Response, Query
from slowapi import Limiter
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from pydantic import BaseModel
import genshin

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

async def rate_limit_exceeded_handler(request: Request, exc: Exception):
    if isinstance(exc, RateLimitExceeded):
        return Response(status_code=429, content="Rate limit exceeded")
    raise exc

app.add_exception_handler(RateLimitExceeded, handler=rate_limit_exceeded_handler)

@app.get("/api/games/genshin-impact/stats")
# @limiter.limit("1/5minute")
async def get_genshin_stats(
    request: Request,
    ltuid_v2: str = Query(...),
    ltoken_v2: str = Query(...),
    uid: int = Query(...)
):
    try:
        cookies = {
            "ltuid_v2": ltuid_v2,
            "ltoken_v2": ltoken_v2
        }
        client = genshin.Client(cookies)
        user = await client.get_genshin_user(uid)
        # chars = await self.client.get_genshin_characters(self.uid)

        return {
            "success": True,
            "data": {
                "stats": user.stats.model_dump_json()
            }
        }
    except genshin.GenshinException as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        raise HTTPException(500, str(e))


@app.get("/api/games/genshin-impact/rt-notes")
# @limiter.limit("1/5minute")
async def get_real_time_notes(
    request: Request,
    ltuid_v2: str = Query(...),
    ltoken_v2: str = Query(...),
    uid: int = Query(...)
):
    try:
        cookies = {
            "ltuid_v2": ltuid_v2,
            "ltoken_v2": ltoken_v2
        }
        client = genshin.Client(cookies)
        notes = await client.get_genshin_notes(uid)

        return {
            "success": True,
            "data": {
                "current_resin": notes.current_resin,
                "max_resin": notes.max_resin,
                "resin_recovery_time": notes.resin_recovery_time,
                "completed_commissions": notes.completed_commissions,
                "max_commissions": notes.max_commissions,
                "claimed_commission_reward": notes.claimed_commission_reward,
                "remaining_resin_discounts": notes.remaining_resin_discounts,
                "max_resin_discounts": notes.max_resin_discounts,
                "expeditions": [exp.model_dump_json() for exp in notes.expeditions]
            }
        }
    except genshin.GenshinException as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        raise HTTPException(500, str(e))