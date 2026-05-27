import React, { useState, useEffect, useMemo } from "react";
import {
  seedMembers, seedTrainers, seedClasses, seedPayments,
  seedProducts, seedSales, seedLeads, seedAccessLogs,
  seedMessages, seedTemplates, NAV_BY_ROLE,
} from "./data/seed";
import { loadData, saveData, clearData } from "./utils/storage";
import { Sidebar, Header } from "./components/Layout";
import { LoginScreen } from "./views/LoginScreen";
import {
  Dashboard, MembersView, MemberDetail, ClassesView, TrainersView,
  CheckInsView, PaymentsView, AnalyticsView,
} from "./views/CoreViews";
import { POSView } from "./views/POSView";
import { LeadsView, AccessControlView, MessagesView } from "./views/PipelineViews";
import {
  TrainerHome, TrainerClasses, TrainerClients,
  MemberHome, MemberQRView, MemberBookClasses, MemberHistory, MemberPayments, MemberShop,
} from "./views/RoleViews";

export default function App() {
  // ----------------- Auth -----------------
  const [user, setUser] = useState(() => loadData("session", null));

  // ----------------- Persistent state -----------------
  const [members, setMembers] = useState(() => loadData("members", seedMembers));
  const [trainers, setTrainers] = useState(() => loadData("trainers", seedTrainers));
  const [classes, setClasses] = useState(() => loadData("classes", seedClasses));
  const [checkIns, setCheckIns] = useState(() => loadData("checkIns", []));
  const [payments, setPayments] = useState(() => loadData("payments", seedPayments));
  const [products, setProducts] = useState(() => loadData("products", seedProducts));
  const [sales, setSales] = useState(() => loadData("sales", seedSales));
  const [leads, setLeads] = useState(() => loadData("leads", seedLeads));
  const [accessLogs, setAccessLogs] = useState(() => loadData("accessLogs", seedAccessLogs));
  const [messages, setMessages] = useState(() => loadData("messages", seedMessages));
  const [templates, setTemplates] = useState(() => loadData("templates", seedTemplates));
  const [shopOrders, setShopOrders] = useState(() => loadData("shopOrders", []));

  // ----------------- UI state -----------------
  const [view, setView] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // ----------------- Persistence effects -----------------
  useEffect(() => { saveData("members", members); }, [members]);
  useEffect(() => { saveData("trainers", trainers); }, [trainers]);
  useEffect(() => { saveData("classes", classes); }, [classes]);
  useEffect(() => { saveData("checkIns", checkIns); }, [checkIns]);
  useEffect(() => { saveData("payments", payments); }, [payments]);
  useEffect(() => { saveData("products", products); }, [products]);
  useEffect(() => { saveData("sales", sales); }, [sales]);
  useEffect(() => { saveData("leads", leads); }, [leads]);
  useEffect(() => { saveData("accessLogs", accessLogs); }, [accessLogs]);
  useEffect(() => { saveData("messages", messages); }, [messages]);
  useEffect(() => { saveData("templates", templates); }, [templates]);
  useEffect(() => { saveData("shopOrders", shopOrders); }, [shopOrders]);

  // ----------------- Set default view when user logs in -----------------
  useEffect(() => {
    if (user && !view) {
      setView(NAV_BY_ROLE[user.role][0]);
    }
  }, [user, view]);

  // ----------------- Auth handlers -----------------
  const handleLogin = (account) => {
    saveData("session", account);
    setUser(account);
    setView(NAV_BY_ROLE[account.role][0]);
  };

  const handleLogout = () => {
    clearData("session");
    setUser(null);
    setView(null);
    setSelectedMember(null);
  };

  // ----------------- Derived stats for dashboard -----------------
  const stats = useMemo(() => {
    const active = members.filter((m) => m.status === "active").length;
    const today = new Date().toISOString().slice(0, 10);
    const currentMonth = today.slice(0, 7);
    const revenue = payments
      .filter((p) => p.status === "paid" && p.date.slice(0, 7) === currentMonth)
      .reduce((s, p) => s + p.amount, 0);
    const todayCheckIns = checkIns.filter((c) => c.date === today).length;
    const classUtil = classes.length > 0
      ? classes.reduce((s, c) => s + c.booked / c.capacity, 0) / classes.length
      : 0;
    const overdueCount = payments.filter((p) => p.status === "overdue").length;
    const expiringSoon = members.filter((m) => {
      if (m.status !== "active") return false;
      const days = (new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 14;
    }).length;
    return { active, revenue, todayCheckIns, classUtil, overdueCount, expiringSoon };
  }, [members, payments, checkIns, classes]);

  // ----------------- Not logged in -----------------
  if (!user) return <LoginScreen onLogin={handleLogin} />;

  // ----------------- Logged in -----------------
  return (
    <div className="min-h-screen bg-stone-50 flex">
      <Sidebar
        view={view}
        setView={(v) => { setView(v); setSidebarOpen(false); }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header view={view} onMenuClick={() => setSidebarOpen(true)} user={user} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl w-full">
          {/* ---------- ADMIN & RECEPTIONIST VIEWS ---------- */}
          {view === "dashboard" && (
            <Dashboard
              stats={stats}
              members={members}
              classes={classes}
              payments={payments}
              onMemberClick={setSelectedMember}
              onNavigate={setView}
              user={user}
            />
          )}

          {view === "members" && (
            <MembersView
              members={members}
              setMembers={setMembers}
              onMemberClick={setSelectedMember}
              user={user}
            />
          )}

          {view === "classes" && (
            <ClassesView
              classes={classes}
              setClasses={setClasses}
              trainers={trainers}
              user={user}
            />
          )}

          {view === "trainers" && <TrainersView trainers={trainers} />}

          {view === "checkins" && (
            <CheckInsView checkIns={checkIns} />
          )}

          {view === "payments" && (
            <PaymentsView payments={payments} setPayments={setPayments} user={user} />
          )}

          {view === "pos" && (
            <POSView
              products={products}
              setProducts={setProducts}
              sales={sales}
              setSales={setSales}
              members={members}
              user={user}
            />
          )}

          {view === "leads" && (
            <LeadsView
              leads={leads}
              setLeads={setLeads}
              members={members}
              setMembers={setMembers}
            />
          )}

          {view === "access" && (
            <AccessControlView
              accessLogs={accessLogs}
              setAccessLogs={setAccessLogs}
              members={members}
            />
          )}

          {view === "messages" && (
            <MessagesView
              messages={messages}
              setMessages={setMessages}
              templates={templates}
              setTemplates={setTemplates}
              members={members}
            />
          )}

          {view === "analytics" && (
            <AnalyticsView members={members} payments={payments} classes={classes} />
          )}

          {/* ---------- TRAINER VIEWS ---------- */}
          {view === "trainer-home" && (
            <TrainerHome user={user} classes={classes} members={members} />
          )}

          {view === "my-classes" && (
            <TrainerClasses user={user} classes={classes} members={members} />
          )}

          {view === "my-clients" && (
            <TrainerClients user={user} members={members} onMemberClick={setSelectedMember} />
          )}

          {/* ---------- MEMBER VIEWS ---------- */}
          {view === "member-home" && (
            <MemberHome
              user={user}
              members={members}
              classes={classes}
              payments={payments}
              checkIns={checkIns}
              onNavigate={setView}
            />
          )}

          {view === "my-qr" && (
            <MemberQRView
              user={user}
              members={members}
              setMembers={setMembers}
              checkIns={checkIns}
              setCheckIns={setCheckIns}
              onNavigate={setView}
            />
          )}

          {view === "book-classes" && (
            <MemberBookClasses user={user} classes={classes} setClasses={setClasses} />
          )}

          {view === "my-history" && (
            <MemberHistory user={user} checkIns={checkIns} classes={classes} />
          )}

          {view === "my-payments" && (
            <MemberPayments user={user} payments={payments} members={members} />
          )}

          {view === "my-shop" && (
            <MemberShop user={user} shopOrders={shopOrders} setShopOrders={setShopOrders} />
          )}
        </main>
      </div>

      {/* Member detail drawer */}
      {selectedMember && (
        <MemberDetail
          member={selectedMember}
          payments={payments.filter((p) => p.memberId === selectedMember.id)}
          checkIns={checkIns.filter((c) => c.memberId === selectedMember.id)}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}
