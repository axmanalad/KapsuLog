from fastapi import FastAPI, HTTPException, Request, Response
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from pydantic import BaseModel
import genshin

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter

async def rate_limit_exceeded_handler(request: Request, exc: Exception):
    if isinstance(exc, RateLimitExceeded):
        return Response(status_code=429, content="Rate limit exceeded")
    raise exc

app.add_exception_handler(RateLimitExceeded, handler=rate_limit_exceeded_handler)


class StatsRequest(BaseModel):
    ltuid: str
    ltoken: str
    uid: int

class GenshinUserStats:
    def __init__(self, data: StatsRequest):
        self.cookies = {
            "ltuid_v2": data.ltuid,
            "ltoken_v2": data.ltoken
        }
        self.uid = data.uid
        try:
            self.client = genshin.Client(self.cookies)
        except genshin.GenshinException as e:
            raise HTTPException(400, str(e))
        except Exception as e:
            raise HTTPException(500, str(e))
        
    @app.get("/api/games/genshin-impact/full-user-stats")
    @limiter.limit("1/5minute")
    async def get_full_user_stats(self):
        try:
            stats = await self.get_genshin_stats()
            notes = await self.get_real_time_notes()

            return {
                "success": True,
                "data": {
                    "stats": stats["data"]["stats"],
                    "real_time_notes": {
                        "current_resin": notes["data"]["current_resin"],
                        "max_resin": notes["data"]["max_resin"],
                        "resin_recovery_time": notes["data"]["resin_recovery_time"],
                        "completed_commissions": notes["data"]["completed_commissions"],
                        "max_commissions": notes["data"]["max_commissions"],
                        "remaining_resin_discounts": notes["data"]["remaining_resin_discounts"],
                        "max_resin_discounts": notes["data"]["max_resin_discounts"],
                        "expeditions": [exp.model_dump_json() for exp in notes["data"]["expeditions"]]
                    }
                }
            }
        except genshin.GenshinException as e:
            raise HTTPException(400, str(e))
        except Exception as e:
            raise HTTPException(500, str(e))

    @app.get("/api/games/genshin-impact/stats")
    async def get_genshin_stats(self):
        try:

            user = await self.client.get_genshin_user(self.uid)
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
    async def get_real_time_notes(self):
        try:
            notes = await self.client.get_genshin_notes(self.uid)

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