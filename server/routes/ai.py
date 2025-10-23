"""
AI助手API路由
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

# 添加server目录到路径
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from ai_service import generate_commentary, chat_with_assistant

router = APIRouter(prefix="/api/ai", tags=["ai"])

class CommentaryRequest(BaseModel):
    event_type: str  # shot, assist, rebound, steal, block
    player_name: str
    success: bool = True
    shot_type: Optional[str] = ""  # three, mid, layup, dunk

class ChatMessage(BaseModel):
    role: str  # user or assistant
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None

@router.post("/commentary")
async def get_commentary(request: CommentaryRequest):
    """
    生成篮球解说词
    """
    try:
        commentary = generate_commentary(
            event_type=request.event_type,
            player_name=request.player_name,
            success=request.success,
            shot_type=request.shot_type or ""
        )
        return {"commentary": commentary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def chat(request: ChatRequest):
    """
    与AI助手对话
    """
    try:
        # 转换历史记录格式
        history = None
        if request.history:
            history = [{"role": msg.role, "content": msg.content} for msg in request.history]
        
        reply = chat_with_assistant(
            user_message=request.message,
            conversation_history=history
        )
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    """
    健康检查
    """
    return {"status": "ok", "model": "SmolLM-135M-Instruct"}

