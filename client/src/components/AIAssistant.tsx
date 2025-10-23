import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "你好！我是篮球小智，你的专属篮球经理助手！有什么可以帮你的吗？",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.ai.chat.useMutation();

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // 调用AI服务
      const response = await chatMutation.mutateAsync({
        message: inputValue,
        history: messages,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "抱歉，我现在有点忙，请稍后再试！",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* 浮动气泡按钮 */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-16 w-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-2xl"
            >
              <MessageCircle className="w-8 h-8 text-white" />
            </Button>
            {/* 小红点提示 */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 聊天窗口 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: isMinimized ? 0.3 : 1,
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50"
            style={{
              transformOrigin: "bottom right",
            }}
          >
            <Card className="w-96 h-[600px] flex flex-col shadow-2xl overflow-hidden">
              {/* 头部 */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* AI助手头像 */}
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <span className="text-2xl">🏀</span>
                  </div>
                  <div>
                    <div className="text-white font-bold">篮球小智</div>
                    <div className="text-white/80 text-xs">
                      {isTyping ? "正在输入..." : "在线"}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white hover:bg-white/20"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* 消息列表 */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.role === "user"
                              ? "bg-orange-500 text-white"
                              : "bg-white text-gray-800 shadow-sm"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex gap-1">
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: 0,
                              }}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                            />
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: 0.2,
                              }}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                            />
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: 0.4,
                              }}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* 输入框 */}
                  <div className="p-4 bg-white border-t">
                    <div className="flex gap-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="输入你的问题..."
                        className="flex-1"
                        disabled={isTyping}
                      />
                      <Button
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isTyping}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-gray-400 text-center">
                      AI助手可能会出错，请谨慎参考
                    </div>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

