from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import genshin

app = FastAPI()

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

    @app.post("/api/genshin/stats")
    async def get_genshin_stats(self):
        try:

            user = await self.client.get_genshin_user(self.uid)
            chars = await self.client.get_genshin_characters(self.uid)

            return {
                "success": True,
                "data": {
                    "stats": user.stats.model_dump_json(),
                    "characters": [char.model_dump_json() for char in chars]
                }
            }
        except genshin.GenshinException as e:
            raise HTTPException(400, str(e))
        except Exception as e:
            raise HTTPException(500, str(e))
        
    @app.post("/api/genshin/rt-notes")
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
                    "remaining_resin_discounts": notes.remaining_resin_discounts,
                    "max_resin_discounts": notes.max_resin_discounts,
                    "expeditions": [exp.model_dump_json() for exp in notes.expeditions]
                }
            }
        except genshin.GenshinException as e:
            raise HTTPException(400, str(e))
        except Exception as e:
            raise HTTPException(500, str(e))