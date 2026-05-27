import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, ChevronLeft, CheckCheck } from "lucide-react";
import { DEMO_ACCOUNTS } from "../data/seed";
import { today } from "../utils/storage";

// ========================================================================
// CHAT — Real-time-style direct messaging for all users
// ========================================================================
export function ChatView({ user, directMessages, setDirectMessages, setNotifications }) {
  const myId = user.username;
  const [selectedContact, setSelectedContact] = useState(null);

  const contacts = DEMO_ACCOUNTS.filter((a) => a.username !== myId);

  const getConversation = (contactId) =>
    [...directMessages]
      .filter((m) => (m.fromId === myId && m.toId === contactId) || (m.fromId === contactId && m.toId === myId))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const getUnread = (contactId) =>
    directMessages.filter((m) => m.fromId === contactId && m.toId === myId && !m.read).length;

  const getLastMsg = (contactId) =>
    [...directMessages]
      .filter((m) => (m.fromId === myId && m.toId === contactId) || (m.fromId === contactId && m.toId === myId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] || null;

  const markRead = (contactId) => {
    setDirectMessages((msgs) =>
      msgs.map((m) => (m.fromId === contactId && m.toId === myId ? { ...m, read: true } : m))
    );
  };

  const selectContact = (contact) => {
    setSelectedContact(contact);
    markRead(contact.username);
  };

  const sendMessage = (content) => {
    if (!content.trim() || !selectedContact) return;
    const msg = {
      id: `dm${Date.now()}`,
      fromId: myId,
      fromName: user.name,
      fromRole: user.role,
      toId: selectedContact.username,
      toName: selectedContact.name,
      toRole: selectedContact.role,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setDirectMessages((msgs) => [...msgs, msg]);
    // Generate notification for recipient
    setNotifications((notifs) => [
      {
        id: `notif-msg-${Date.now()}`,
        userId: selectedContact.username,
        type: "message",
        title: `New message from ${user.name}`,
        body: content.trim().slice(0, 80),
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...notifs,
    ]);
  };

  const totalUnread = contacts.reduce((s, c) => s + getUnread(c.username), 0);

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex" style={{ height: "calc(100vh - 220px)", minHeight: 500 }}>
      {/* Contact list */}
      <div className={`w-full lg:w-80 border-r border-stone-200 flex flex-col shrink-0 ${selectedContact ? "hidden lg:flex" : "flex"}`}>
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Messages</h3>
          {totalUnread > 0 && (
            <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5 font-mono">{totalUnread} new</span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => {
            const lastMsg = getLastMsg(contact.username);
            const unread = getUnread(contact.username);
            const isSelected = selectedContact?.username === contact.username;
            return (
              <button key={contact.username} onClick={() => selectContact(contact)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-stone-50 transition text-left border-b border-stone-100 ${isSelected ? "bg-red-50 border-l-2 border-l-red-500" : ""}`}>
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center font-semibold text-stone-700">
                    {contact.name[0]}
                  </div>
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">{unread}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <div className={`text-sm truncate ${unread > 0 ? "font-semibold" : "font-medium"}`}>{contact.name}</div>
                    {lastMsg && (
                      <div className="text-[10px] font-mono text-stone-400 shrink-0">
                        {new Date(lastMsg.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    )}
                  </div>
                  <div className={`text-xs truncate ${unread > 0 ? "text-stone-800 font-medium" : "text-stone-500"}`}>
                    {lastMsg ? (lastMsg.fromId === myId ? "You: " : "") + lastMsg.content : <span className="italic capitalize text-stone-400">{contact.role}</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      {selectedContact ? (
        <ChatThread
          contact={selectedContact}
          messages={getConversation(selectedContact.username)}
          currentUser={user}
          onSend={sendMessage}
          onBack={() => setSelectedContact(null)}
        />
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center text-stone-400">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-25" />
            <p className="text-sm font-medium text-stone-500">Select a conversation</p>
            <p className="text-xs text-stone-400 mt-1">Choose someone from the list to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatThread({ contact, messages, currentUser, onSend, onBack }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const myId = currentUser.username;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const formatDate = (ts) => {
    const d = new Date(ts).toISOString().slice(0, 10);
    if (d === today()) return "Today";
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    if (d === yesterday.toISOString().slice(0, 10)) return "Yesterday";
    return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Group messages by date
  const grouped = messages.reduce((acc, msg) => {
    const d = new Date(msg.timestamp).toISOString().slice(0, 10);
    (acc[d] = acc[d] || []).push(msg);
    return acc;
  }, {});

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="p-4 border-b border-stone-200 flex items-center gap-3">
        <button onClick={onBack} className="lg:hidden p-1.5 hover:bg-stone-100 rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center font-semibold text-stone-700 shrink-0">
          {contact.name[0]}
        </div>
        <div>
          <div className="font-semibold text-sm">{contact.name}</div>
          <div className="text-xs text-stone-500 capitalize">{contact.role}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-25" />
            <p className="text-sm">No messages yet. Say hello!</p>
          </div>
        )}
        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">{formatDate(msgs[0].timestamp)}</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>
            <div className="space-y-2">
              {msgs.map((msg) => {
                const isMe = msg.fromId === myId;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    {!isMe && (
                      <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center font-semibold text-xs text-stone-700 mr-2 mt-1 shrink-0">
                        {msg.fromName[0]}
                      </div>
                    )}
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? "bg-stone-900 text-white rounded-br-md" : "bg-stone-100 text-stone-900 rounded-bl-md"}`}>
                      <p className="leading-relaxed">{msg.content}</p>
                      <div className={`flex items-center gap-1 mt-1 justify-end ${isMe ? "text-stone-400" : "text-stone-400"}`}>
                        <span className="text-[10px] font-mono">{formatTime(msg.timestamp)}</span>
                        {isMe && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-stone-200">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Message ${contact.name.split(" ")[0]}...`}
            className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-900 focus:bg-white"
          />
          <button onClick={handleSend} disabled={!input.trim()}
            className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition disabled:opacity-40 shrink-0">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-stone-400 text-center mt-2 font-mono">Enter to send</p>
      </div>
    </div>
  );
}
