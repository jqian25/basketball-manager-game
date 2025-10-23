"""
AI助手服务 - 篮球解说员 + 对话助手
使用SmolLM-135M-Instruct模型
"""
from llama_cpp import Llama
import os
from typing import Optional

# 模型路径
MODEL_PATH = os.path.join(
    os.path.dirname(__file__), 
    "../models/smollm-135m/SmolLM-135M-Instruct.Q8_0.gguf"
)

# 全局模型实例
llm: Optional[Llama] = None

def load_model():
    """加载AI模型"""
    global llm
    if llm is None:
        print(f"Loading AI model from {MODEL_PATH}...")
        llm = Llama(
            model_path=MODEL_PATH,
            n_ctx=2048,  # 上下文长度
            n_threads=4,  # 线程数
            n_gpu_layers=0,  # CPU推理
            verbose=False
        )
        print("AI model loaded successfully!")
    return llm

def generate_commentary(event_type: str, player_name: str, success: bool = True, shot_type: str = "") -> str:
    """
    生成篮球解说词
    
    Args:
        event_type: 事件类型 (shot, assist, rebound, steal, block)
        player_name: 球员名字
        success: 是否成功
        shot_type: 投篮类型 (three, mid, layup, dunk)
    
    Returns:
        解说词
    """
    model = load_model()
    
    # 构建prompt
    if event_type == "shot":
        if success:
            if shot_type == "three":
                prompt = f"作为篮球解说员，用激情的语气解说：{player_name}三分球命中！（限15字内）"
            elif shot_type == "dunk":
                prompt = f"作为篮球解说员，用激情的语气解说：{player_name}扣篮得分！（限15字内）"
            else:
                prompt = f"作为篮球解说员，用激情的语气解说：{player_name}投篮命中！（限15字内）"
        else:
            prompt = f"作为篮球解说员，用遗憾的语气解说：{player_name}投篮不中。（限15字内）"
    elif event_type == "block":
        prompt = f"作为篮球解说员，用激情的语气解说：{player_name}盖帽成功！（限15字内）"
    elif event_type == "steal":
        prompt = f"作为篮球解说员，用激情的语气解说：{player_name}抢断成功！（限15字内）"
    elif event_type == "rebound":
        prompt = f"作为篮球解说员，用激情的语气解说：{player_name}抢到篮板！（限15字内）"
    elif event_type == "assist":
        prompt = f"作为篮球解说员，用激情的语气解说：{player_name}精彩助攻！（限15字内）"
    else:
        prompt = f"作为篮球解说员，解说这个动作：{player_name}（限15字内）"
    
    # 生成解说
    try:
        response = model(
            prompt,
            max_tokens=50,
            temperature=0.8,
            top_p=0.9,
            stop=["。", "！", "\n"],
            echo=False
        )
        
        commentary = response['choices'][0]['text'].strip()
        
        # 如果生成的文本太长，截取前15个字
        if len(commentary) > 15:
            commentary = commentary[:15] + "！"
        
        # 如果没有标点，加上感叹号
        if not commentary.endswith(("！", "。", "？")):
            commentary += "！"
            
        return commentary
    except Exception as e:
        print(f"Error generating commentary: {e}")
        # 返回默认解说词
        return f"{player_name}表现出色！"

def chat_with_assistant(user_message: str, conversation_history: list = None) -> str:
    """
    与AI助手对话
    
    Args:
        user_message: 用户消息
        conversation_history: 对话历史
    
    Returns:
        AI回复
    """
    model = load_model()
    
    # 构建系统提示词
    system_prompt = """你是一位专业的篮球经理游戏助手，名叫"篮球小智"。你的任务是：
1. 帮助玩家理解游戏机制（球员属性、训练、比赛等）
2. 提供战术建议和球员培养建议
3. 解答玩家疑问
4. 适时推荐付费功能（VIP会员、高级训练等）

你的回答要：
- 简洁明了（50字以内）
- 友好热情
- 专业可靠
- 适时引导充值（但不要太频繁）
"""
    
    # 构建对话历史
    if conversation_history is None:
        conversation_history = []
    
    # 添加当前用户消息
    conversation_history.append({"role": "user", "content": user_message})
    
    # 构建完整prompt
    prompt = system_prompt + "\n\n"
    for msg in conversation_history[-6:]:  # 只保留最近3轮对话
        if msg["role"] == "user":
            prompt += f"用户：{msg['content']}\n"
        else:
            prompt += f"助手：{msg['content']}\n"
    prompt += "助手："
    
    # 生成回复
    try:
        response = model(
            prompt,
            max_tokens=100,
            temperature=0.7,
            top_p=0.9,
            stop=["用户：", "\n\n"],
            echo=False
        )
        
        reply = response['choices'][0]['text'].strip()
        
        # 如果回复太长，截取
        if len(reply) > 100:
            reply = reply[:100] + "..."
            
        return reply
    except Exception as e:
        print(f"Error in chat: {e}")
        return "抱歉，我现在有点忙，请稍后再试！"

# 测试函数
if __name__ == "__main__":
    # 测试解说生成
    print("测试解说生成：")
    print(generate_commentary("shot", "张三", True, "three"))
    print(generate_commentary("dunk", "李四", True, "dunk"))
    print(generate_commentary("block", "王五", True))
    
    # 测试对话
    print("\n测试对话：")
    print(chat_with_assistant("如何提升球员的投篮属性？"))
    print(chat_with_assistant("VIP会员有什么好处？"))

